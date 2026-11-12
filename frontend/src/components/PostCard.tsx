import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Clock, Eye, Star } from 'lucide-react'
import type { Post } from '../types'
import { formatPrice, formatDate, POST_TYPE_LABELS, POST_TYPE_COLORS, cn } from '../lib/utils'
import { postService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface PostCardProps {
  post: Post
  onFavoriteToggle?: (postId: number, favorited: boolean) => void
}

export default function PostCard({ post, onFavoriteToggle }: PostCardProps) {
  const { isAuthenticated } = useAuth()
  const [favorited, setFavorited] = useState(post.isFavorited ?? false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  const mainImage = post.images?.[0]?.url || null

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please sign in to save favorites')
      return
    }
    if (favoriteLoading) return
    setFavoriteLoading(true)
    try {
      const res = await postService.toggleFavorite(post.id)
      setFavorited(res.favorited)
      onFavoriteToggle?.(post.id, res.favorited)
      toast.success(res.favorited ? 'Saved to favorites' : 'Removed from favorites')
    } catch {
      toast.error('Failed to update favorite')
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <Link to={`/posts/${post.id}`} className="card group block overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-navy-800 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl opacity-20">📦</div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {post.featured && (
            <span className="badge badge-accent text-xs">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          <span className={cn('badge border text-xs', POST_TYPE_COLORS[post.postType])}>
            {POST_TYPE_LABELS[post.postType]}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={favoriteLoading}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
            favorited
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-navy-900/70 text-gray-300 hover:bg-red-500/20 hover:text-red-400 backdrop-blur-sm',
          )}
        >
          <Heart className={cn('w-4 h-4', favorited && 'fill-current')} />
        </button>

        {/* View count */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-white bg-navy-900/70 backdrop-blur-sm px-2 py-1 rounded-full">
          <Eye className="w-3 h-3" />
          {post.views}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category */}
        <p className="text-xs text-accent font-medium mb-1">{post.category?.name}</p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors leading-snug mb-2">
          {post.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-accent mb-2">
          {formatPrice(post.price)}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-24">{post.city}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
