import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

interface UploadedImage {
  id?: number
  url: string
  file?: File
  uploading?: boolean
}

interface ImageUploadProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
  onUpload?: (files: File[]) => Promise<{ id: number; url: string }[]>
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 5,
  onUpload,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxImages - images.length
      const filesToProcess = acceptedFiles.slice(0, remaining)
      if (filesToProcess.length === 0) return

      // Show previews immediately
      const previews: UploadedImage[] = filesToProcess.map((file) => ({
        url: URL.createObjectURL(file),
        file,
        uploading: !!onUpload,
      }))
      onChange([...images, ...previews])

      if (onUpload) {
        setUploading(true)
        try {
          const uploaded = await onUpload(filesToProcess)
          // Replace previews with uploaded versions
          onChange([
            ...images,
            ...uploaded.map((u) => ({ id: u.id, url: u.url })),
          ])
        } catch {
          // Remove failed previews
          onChange(images)
        } finally {
          setUploading(false)
        }
      }
    },
    [images, maxImages, onChange, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages || uploading,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (from: number, to: number) => {
    const newImages = [...images]
    const [item] = newImages.splice(from, 1)
    newImages.splice(to, 0, item)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-accent bg-accent/5 scale-[1.01]'
              : 'border-navy-500 hover:border-accent/50 hover:bg-navy-700/30',
            (images.length >= maxImages || uploading) && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            ) : isDragActive ? (
              <Upload className="w-10 h-10 text-accent" />
            ) : (
              <ImageIcon className="w-10 h-10 text-gray-500" />
            )}
            <div>
              <p className="text-white font-medium">
                {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                or click to select • JPG, PNG, WebP • Max 5MB each
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {images.length}/{maxImages} images uploaded
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-navy-800 group">
              <img
                src={img.url}
                alt={`Upload ${i + 1}`}
                className="w-full h-full object-cover"
              />
              {img.uploading && (
                <div className="absolute inset-0 bg-navy-900/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>
              )}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-accent text-navy-900 font-semibold px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-colors" />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400"
              >
                <X className="w-3 h-3 text-white" />
              </button>
              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    onClick={() => moveImage(i, i - 1)}
                    className="w-5 h-5 bg-navy-800 rounded text-xs text-white flex items-center justify-center hover:bg-navy-600"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                {i < images.length - 1 && (
                  <button
                    onClick={() => moveImage(i, i + 1)}
                    className="w-5 h-5 bg-navy-800 rounded text-xs text-white flex items-center justify-center hover:bg-navy-600"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
