export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  verified: boolean
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  iconName: string
  displayOrder: number
  postCount?: number
}

export interface PostImage {
  id: number
  url: string
  displayOrder: number
}

export type PostType = 'SELL' | 'BUY' | 'SERVICE' | 'RENT'
export type PostStatus = 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'DELETED'

export interface Post {
  id: number
  title: string
  description: string
  price: number
  category: Category
  user: User
  location: string
  city: string
  state: string
  status: PostStatus
  postType: PostType
  featured: boolean
  views: number
  images: PostImage[]
  createdAt: string
  isFavorited?: boolean
}

export interface Message {
  id: number
  sender: User
  receiver: User
  post: Post
  content: string
  read: boolean
  createdAt: string
}

export interface Conversation {
  id: number
  otherUser: User
  post: Post
  lastMessage: Message
  unreadCount: number
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  phone: string
  password: string
}

export interface OTPVerifyRequest {
  email: string
  otp: string
}

export interface PostFilters {
  page?: number
  size?: number
  search?: string
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  postType?: PostType
  sort?: 'newest' | 'price_asc' | 'price_desc'
  featured?: boolean
}

export interface CreatePostRequest {
  title: string
  description: string
  price: number
  categoryId: number
  location: string
  city: string
  state: string
  postType: PostType
  imageIds?: number[]
}
