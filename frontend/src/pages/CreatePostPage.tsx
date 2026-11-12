import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronRight, ChevronLeft, Check, MapPin,
  DollarSign, FileText, Tag, Loader2, ImageIcon,
} from 'lucide-react'

import toast from 'react-hot-toast'
import { categoryService, postService } from '../services/api'
import { INDIAN_CITIES, DEFAULT_CATEGORIES, cn } from '../lib/utils'
import ImageUpload from '../components/ImageUpload'

const detailsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  location: z.string().min(2, 'Enter a location/area'),
  city: z.string().min(1, 'Select a city'),
  state: z.string().min(1, 'Enter state'),
  postType: z.enum(['SELL', 'BUY', 'SERVICE', 'RENT']),
})

type DetailsData = z.infer<typeof detailsSchema>

const POST_TYPES = [
  { value: 'SELL', label: 'For Sale', desc: "You're selling this item", icon: '🏷️' },
  { value: 'BUY', label: 'Wanted', desc: 'You want to buy this', icon: '🛒' },
  { value: 'SERVICE', label: 'Service', desc: 'You offer a service', icon: '🔧' },
  { value: 'RENT', label: 'For Rent', desc: 'Available for rent/lease', icon: '🏠' },
]

const INDIAN_STATES = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
]

interface UploadedImage {
  id?: number
  url: string
  file?: File
}

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [images, setImages] = useState<UploadedImage[]>([])
  const [submitting, setSubmitting] = useState(false)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  })

  const cats = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DetailsData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { postType: 'SELL', price: 0 },
  })

  const watchedValues = watch()

  const selectedCategory = cats.find((c) => c.id === selectedCategoryId)

  const STEPS = [
    { label: 'Category', icon: Tag },
    { label: 'Details', icon: FileText },
    { label: 'Photos', icon: ImageIcon },
    { label: 'Preview', icon: Check },
  ]

  const onSubmit = async (data: DetailsData) => {
    if (!selectedCategoryId) {
      setStep(1)
      toast.error('Please select a category')
      return
    }
    setSubmitting(true)
    try {
      const post = await postService.createPost({
        ...data,
        categoryId: selectedCategoryId,
      })
      // Upload images now that we have a post ID
      const imageFiles = images.map((i) => i.file).filter(Boolean) as File[]
      if (imageFiles.length > 0) {
        await postService.uploadImages(String(post.id), imageFiles)
      }
      toast.success('Ad posted successfully!')
      navigate(`/posts/${post.id}`)
    } catch {
      toast.error('Failed to create post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-page-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Post a Free Ad</h1>
          <p className="text-gray-400">Fill in the details to reach thousands of buyers</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isCompleted = step > i + 1
            const isActive = step === i + 1
            return (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isActive ? 'border-accent text-accent bg-accent/10 shadow-glow' :
                    'border-navy-500 text-gray-500',
                  )}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium hidden sm:block ${isActive ? 'text-accent' : 'text-gray-500'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn('h-0.5 flex-1 mx-2 mb-4 sm:mb-0 transition-all', isCompleted ? 'bg-green-500' : 'bg-navy-600')} />
                )}
              </div>
            )
          })}
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Category */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-1">What are you posting?</h2>
                <p className="text-gray-400 text-sm mb-6">Choose the most relevant category</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cats.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={cn(
                        'p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02]',
                        selectedCategoryId === cat.id
                          ? 'border-accent bg-accent/10 text-accent shadow-card-hover'
                          : 'border-navy-500 text-gray-300 hover:border-accent/50 hover:bg-navy-700/50',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {selectedCategoryId === cat.id && <Check className="w-4 h-4 text-accent flex-shrink-0" />}
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedCategoryId) { toast.error('Please select a category'); return }
                      setStep(2)
                    }}
                    className="btn-primary px-8"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-1">Ad Details</h2>
                <p className="text-gray-400 text-sm mb-6">The more detail you provide, the faster you'll sell</p>

                <div>
                  <label className="label">Ad Title *</label>
                  <input
                    {...register('title')}
                    className="input"
                    placeholder="e.g. iPhone 13 Pro Max 256GB - Like New"
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="label">Description *</label>
                  <textarea
                    {...register('description')}
                    rows={5}
                    className="input resize-none"
                    placeholder="Describe your item in detail — condition, features, reason for selling..."
                  />
                  {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price (₹) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        {...register('price')}
                        type="number"
                        min={0}
                        className="input pl-10"
                        placeholder="0 for free"
                      />
                    </div>
                    {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="label">Ad Type *</label>
                    <select {...register('postType')} className="input">
                      {POST_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select {...register('city')} className="input pl-10">
                        <option value="">Select city</option>
                        {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label className="label">State *</label>
                    <select {...register('state')} className="input">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Location / Area *</label>
                  <input
                    {...register('location')}
                    className="input"
                    placeholder="e.g. Koramangala, HSR Layout"
                  />
                  {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location.message}</p>}
                </div>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary px-8">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-1">Add Photos</h2>
                <p className="text-gray-400 text-sm mb-6">Ads with photos get 5x more responses. Add up to 5 photos.</p>

                <ImageUpload
                  images={images}
                  onChange={setImages}
                  maxImages={5}
                />

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={() => setStep(4)} className="btn-primary px-8">
                    Preview <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Preview & Submit */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-1">Preview Your Ad</h2>
                <p className="text-gray-400 text-sm mb-6">This is how your ad will appear to buyers</p>

                <div className="card p-5 mb-6">
                  {images[0] && (
                    <img src={images[0].url} alt="cover" className="w-full h-52 object-cover rounded-lg mb-4" />
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="badge badge-accent">{selectedCategory?.name}</span>
                    <span className="badge bg-navy-700 text-gray-300 border border-navy-500">
                      {POST_TYPES.find((t) => t.value === watchedValues.postType)?.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{watchedValues.title}</h3>
                  <p className="text-2xl font-extrabold text-accent mb-2">
                    {watchedValues.price === 0 ? 'Free' : `₹${Number(watchedValues.price).toLocaleString('en-IN')}`}
                  </p>
                  {watchedValues.city && (
                    <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" />
                      {watchedValues.location}, {watchedValues.city}, {watchedValues.state}
                    </p>
                  )}
                  {watchedValues.description && (
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{watchedValues.description}</p>
                  )}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3">
                      {images.slice(1, 4).map((img, i) => (
                        <div key={i} className="w-14 h-14 rounded-lg overflow-hidden">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {images.length > 4 && (
                        <div className="w-14 h-14 rounded-lg bg-navy-700 flex items-center justify-center text-gray-400 text-xs">
                          +{images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Checklist */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-green-400 font-semibold text-sm mb-3">Ad Checklist</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      { label: 'Category selected', ok: !!selectedCategoryId },
                      { label: 'Title added', ok: !!watchedValues.title },
                      { label: 'Description added', ok: !!watchedValues.description },
                      { label: 'City selected', ok: !!watchedValues.city },
                      { label: 'Photos added', ok: images.length > 0 },
                    ].map((item) => (
                      <li key={item.label} className="flex items-center gap-2">
                        <span className={item.ok ? 'text-green-400' : 'text-gray-500'}>
                          {item.ok ? '✓' : '○'}
                        </span>
                        <span className={item.ok ? 'text-gray-300' : 'text-gray-500'}>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep(3)} className="btn-secondary">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary px-10 py-3">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Publish Ad
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
