import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Clock, Eye, Heart, Share2, MessageSquare,
  ChevronLeft, ChevronRight, Star, CalendarDays, Loader2, Flag, BadgeCheck,
} from 'lucide-react'
import { postService } from '../services/api'
import { formatDate, formatPrice, POST_TYPE_LABELS, POST_TYPE_COLORS, cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import MessageModal from '../components/MessageModal'
import PostCard from '../components/PostCard'
import PostCardSkeleton from '../components/PostCardSkeleton'
import toast from 'react-hot-toast'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState(0)
  const [messageOpen, setMessageOpen] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPost(Number(id)),
    enabled: !!id,
  })

  const { data: relatedData, isLoading: relatedLoading } = useQuery({
    queryKey: ['posts', 'related', post?.category?.slug],
    queryFn: () => postService.getPosts({ category: post?.category?.slug, size: 5 }),
    enabled: !!post?.category?.slug,
  })

  const handleFavorite = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!post || favLoading) return
    setFavLoading(true)
    try {
      const res = await postService.toggleFavorite(post.id)
      setFavorited(res.favorited)
      toast.success(res.favorited ? 'Saved to favorites' : 'Removed from favorites')
    } catch {
      toast.error('Failed to update favorite')
    } finally {
      setFavLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post?.title, url: window.location.href })
      else { await navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }
    } catch { /* cancelled */ }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-[4/3] skeleton rounded-xl" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-32 w-full rounded" />
          </div>
          <div className="space-y-4">
            <div className="skeleton h-48 w-full rounded-xl" />
            <div className="skeleton h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Post not found</h2>
          <Link to="/posts" className="btn-primary mt-4 inline-flex">Browse Listings</Link>
        </div>
      </div>
    )
  }

  const images = post.images && post.images.length > 0 ? post.images : []

  return (
    <div className="bg-page-bg min-h-screen">
      <div className="bg-navy-900 border-b border-navy-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/posts" className="hover:text-accent transition-colors">Listings</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300 truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden">
              <div className="relative aspect-[4/3] bg-navy-800">
                {images.length > 0 ? (
                  <img src={images[activeImage]?.url} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">📦</div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {post.featured && (
                    <span className="badge badge-accent"><Star className="w-3 h-3" />Featured</span>
                  )}
                  <span className={cn('badge border', POST_TYPE_COLORS[post.postType])}>
                    {POST_TYPE_LABELS[post.postType]}
                  </span>
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy-900/80 rounded-full flex items-center justify-center text-white">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setActiveImage((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy-900/80 rounded-full flex items-center justify-center text-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-accent' : 'border-navy-600'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-accent text-sm font-medium mb-1">{post.category?.name}</p>
                  <h1 className="text-2xl font-bold text-white">{post.title}</h1>
                </div>
                <div className="text-3xl font-extrabold text-accent">{formatPrice(post.price)}</div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-accent" />{post.city}, {post.state}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDate(post.createdAt)}</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{post.views} views</span>
              </div>
              <div className="border-t border-navy-700 pt-4">
                <h2 className="text-white font-semibold mb-3">Description</h2>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{post.description}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleFavorite} disabled={favLoading}
                  className={cn('btn-secondary flex-none', favorited && 'border-red-500/50 text-red-400')}>
                  {favLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={cn('w-4 h-4', favorited && 'fill-current')} />}
                  {favorited ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleShare} className="btn-secondary flex-none">
                  <Share2 className="w-4 h-4" />Share
                </button>
                <button className="btn-ghost flex-none text-xs">
                  <Flag className="w-4 h-4" />Report
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <button onClick={() => { if (!isAuthenticated) { navigate('/login'); return } setMessageOpen(true) }}
                className="btn-primary w-full text-base py-3 mb-3">
                <MessageSquare className="w-5 h-5" />Contact Seller
              </button>
              <button onClick={handleFavorite} disabled={favLoading}
                className={cn('btn-secondary w-full', favorited && 'border-red-500/50 text-red-400')}>
                {favLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className={cn('w-4 h-4', favorited && 'fill-current')} />}
                {favorited ? 'Saved' : 'Save to Favorites'}
              </button>
            </div>

            <div className="card p-5">
              <h2 className="text-white font-semibold mb-4">Seller</h2>
              <div className="flex items-center gap-3 mb-4">
                {post.user.avatarUrl ? (
                  <img src={post.user.avatarUrl} alt={post.user.name} className="w-14 h-14 rounded-full object-cover border-2 border-accent/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-navy-700 border-2 border-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                    {post.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <Link to={`/users/${post.user.id}`} className="text-white font-semibold hover:text-accent transition-colors flex items-center gap-1.5">
                    {post.user.name}
                    {post.user.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                  </Link>
                  <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    Member since {new Date(post.user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <Link to={`/users/${post.user.id}`} className="btn-secondary w-full text-center text-sm">View All Listings</Link>
            </div>

            <div className="card p-4 bg-yellow-500/5 border-yellow-500/20">
              <h3 className="text-yellow-400 font-semibold text-sm mb-2">Safety Tips</h3>
              <ul className="text-xs text-gray-400 space-y-1.5">
                <li>Meet seller in a public place</li>
                <li>Check the item before payment</li>
                <li>Never send money in advance</li>
                <li>Report suspicious activity</li>
              </ul>
            </div>

            <div className="card p-4">
              <h3 className="text-white font-semibold text-sm mb-3">Ad Details</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Ad ID', value: `#${post.id}` },
                  { label: 'Type', value: POST_TYPE_LABELS[post.postType] },
                  { label: 'Category', value: post.category?.name },
                  { label: 'Location', value: `${post.city}, ${post.state}` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-300 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(relatedData?.content.length ?? 0) > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-5">Related Listings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedLoading
                ? Array.from({ length: 4 }).map((_, i) => <PostCardSkeleton key={i} />)
                : relatedData?.content.filter((p) => p.id !== post.id).slice(0, 4).map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </div>

      <MessageModal post={post} open={messageOpen} onOpenChange={setMessageOpen} />
    </div>
  )
}
