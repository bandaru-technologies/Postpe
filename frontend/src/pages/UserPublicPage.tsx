import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Package, BadgeCheck, MapPin, MessageSquare } from 'lucide-react'
import { userService, postService } from '../services/api'
import PostCard from '../components/PostCard'
import PostCardSkeleton from '../components/PostCardSkeleton'
import { formatDate } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

export default function UserPublicPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()

  const { data: user, isLoading: userLoading, isError } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(Number(id)),
    enabled: !!id,
  })

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts', id],
    queryFn: () => userService.getUserPosts(Number(id)),
    enabled: !!id,
  })

  const posts = Array.isArray(postsData) ? postsData : []

  if (userLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full skeleton" />
            <div className="space-y-3 flex-1">
              <div className="skeleton h-7 w-48 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-40 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
          <Link to="/posts" className="btn-primary inline-flex mt-4">Browse Listings</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-page-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User profile card */}
        <div className="card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-accent/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-navy-700 border-4 border-accent/20 flex items-center justify-center text-3xl font-bold text-accent">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                {user.verified && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  Joined {formatDate(user.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  {posts.length} active listing{posts.length !== 1 ? 's' : ''}
                </span>
                {user.verified && (
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <BadgeCheck className="w-4 h-4" />
                    Identity verified
                  </span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-accent">{posts.length}</p>
                  <p className="text-xs text-gray-400">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-accent">
                    {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Total Views</p>
                </div>
              </div>
            </div>

            {/* Contact button */}
            {isAuthenticated && (
              <div className="flex-shrink-0">
                <Link to="/messages" className="btn-primary text-sm">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Listings by {user.name}
            </h2>
            <span className="text-gray-400 text-sm">{posts.length} ads</span>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">No active listings</h3>
              <p className="text-gray-400">This user hasn't posted any ads yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
