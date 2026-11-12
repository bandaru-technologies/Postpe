import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera, Edit2, Check, X, Package, Heart, MessageCircle,
  BadgeCheck, CalendarDays, Phone, Mail, Plus,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { postService, userService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import PostCardSkeleton from '../components/PostCardSkeleton'
import { formatDate } from '../lib/utils'
import type { Post } from '../types'

type Tab = 'posts' | 'favorites' | 'messages'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState<Tab>('posts')
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [savingProfile, setSavingProfile] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: myPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['myPosts'],
    queryFn: () => postService.getMyPosts(),
    enabled: tab === 'posts',
  })

  const { data: favorites, isLoading: favsLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => postService.getFavorites(),
    enabled: tab === 'favorites',
  })

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await userService.uploadAvatar(file)
      updateUser({ ...user!, avatarUrl: res.avatarUrl })
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to upload avatar')
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) return
    setSavingProfile(true)
    try {
      const updated = await userService.updateProfile({ name, phone })
      updateUser({ ...user!, name: updated.name, phone: updated.phone })
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  if (!user) return null

  const posts: Post[] = Array.isArray(myPosts) ? myPosts : (myPosts as { content?: Post[] })?.content ?? []
  const favs: Post[] = Array.isArray(favorites) ? favorites : (favorites as { content?: Post[] })?.content ?? []

  const TABS = [
    { id: 'posts' as Tab, label: 'My Ads', icon: Package, count: posts.length },
    { id: 'favorites' as Tab, label: 'Saved', icon: Heart, count: favs.length },
    { id: 'messages' as Tab, label: 'Messages', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-page-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-accent/30 bg-navy-700">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-accent">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-navy-900 flex items-center justify-center hover:bg-cyan-400 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3 mb-3">
                  <div>
                    <label className="label">Display Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="input max-w-xs" />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input max-w-xs" type="tel" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveProfile} disabled={savingProfile}
                      className="btn-primary py-2 text-sm">
                      <Check className="w-4 h-4" />
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => { setEditing(false); setName(user.name); setPhone(user.phone ?? '') }}
                      className="btn-ghost py-2 text-sm">
                      <X className="w-4 h-4" />Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    {user.verified && <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-500/20" />}
                    <button onClick={() => setEditing(true)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-navy-700 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{user.email}</span>
                    {user.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{user.phone}</span>}
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link to="/posts/create" className="btn-primary text-sm whitespace-nowrap">
                <Plus className="w-4 h-4" />Post New Ad
              </Link>
              {!user.verified && (
                <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-400/20 text-yellow-400 text-xs text-center">
                  <p className="font-semibold">Not Verified</p>
                  <p className="opacity-70">Verify for more trust</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-navy-800 rounded-xl p-1">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === id ? 'bg-navy-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count !== undefined && count > 0 && (
                <span className="w-5 h-5 bg-accent/20 text-accent text-xs rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* My Ads */}
        {tab === 'posts' && (
          postsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">No ads yet</h3>
              <p className="text-gray-400 mb-6">Start selling by posting your first ad</p>
              <Link to="/posts/create" className="btn-primary inline-flex">
                <Plus className="w-4 h-4" />Post Free Ad
              </Link>
            </div>
          )
        )}

        {/* Saved */}
        {tab === 'favorites' && (
          favsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : favs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {favs.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">No saved listings</h3>
              <p className="text-gray-400 mb-6">Browse and save items you're interested in</p>
              <Link to="/posts" className="btn-secondary inline-flex">Browse Listings</Link>
            </div>
          )
        )}

        {/* Messages tab shortcut */}
        {tab === 'messages' && (
          <div className="text-center py-20 card">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">Your Messages</h3>
            <p className="text-gray-400 mb-6">View all your conversations with buyers and sellers</p>
            <Link to="/messages" className="btn-primary inline-flex">
              <MessageCircle className="w-4 h-4" />Go to Messages
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
