import axios from 'axios'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  User,
  Post,
  PostFilters,
  CreatePostRequest,
  Category,
  Message,
  Conversation,
  PagedResponse,
} from '../types'

// Axios instance — uses Vite proxy so no CORS needed
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api

// ─── Auth Service ────────────────────────────────────────────────────────────
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  verifyOTP: async (data: OTPVerifyRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/verify-otp', data)
    return res.data
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me')
    return res.data
  },

  resendOTP: async (email: string): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>('/auth/resend-otp', { email })
    return res.data
  },
}

// ─── Post Service ─────────────────────────────────────────────────────────────
export const postService = {
  getPosts: async (filters: PostFilters = {}): Promise<PagedResponse<Post>> => {
    const params = new URLSearchParams()
    if (filters.page !== undefined) params.set('page', String(filters.page))
    if (filters.size !== undefined) params.set('size', String(filters.size))
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.city) params.set('city', filters.city)
    if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
    if (filters.postType) params.set('postType', filters.postType)
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.featured !== undefined) params.set('featured', String(filters.featured))
    const res = await api.get<PagedResponse<Post>>(`/posts?${params.toString()}`)
    return res.data
  },

  getPost: async (id: number): Promise<Post> => {
    const res = await api.get<Post>(`/posts/${id}`)
    return res.data
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const res = await api.post<Post>('/posts', data)
    return res.data
  },

  updatePost: async (id: number, data: Partial<CreatePostRequest>): Promise<Post> => {
    const res = await api.put<Post>(`/posts/${id}`, data)
    return res.data
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },

  toggleFavorite: async (postId: number): Promise<{ favorited: boolean }> => {
    const res = await api.post<{ favorited: boolean }>(`/posts/${postId}/favorite`)
    return res.data
  },

  getFavorites: async (): Promise<Post[]> => {
    const res = await api.get<Post[]>('/posts/favorites')
    return res.data
  },

  uploadImages: async (postId: string, files: File[]): Promise<{ id: number; url: string }[]> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    const res = await api.post<{ id: number; url: string }[]>(`/posts/${postId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  getMyPosts: async (): Promise<Post[]> => {
    const res = await api.get<Post[]>('/posts/my')
    return res.data
  },
}

// ─── Category Service ─────────────────────────────────────────────────────────
export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>('/categories')
    return res.data
  },
}

// ─── User Service ─────────────────────────────────────────────────────────────
export const userService = {
  getUser: async (id: number): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`)
    return res.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put<User>('/users/me', data)
    return res.data
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post<{ avatarUrl: string }>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  getUserPosts: async (userId: number): Promise<Post[]> => {
    const res = await api.get<Post[]>(`/users/${userId}/posts`)
    return res.data
  },
}

// ─── Message Service ──────────────────────────────────────────────────────────
export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const res = await api.get<Conversation[]>('/messages/conversations')
    return res.data
  },

  getMessages: async (conversationId: number): Promise<Message[]> => {
    const res = await api.get<Message[]>(`/messages/conversations/${conversationId}`)
    return res.data
  },

  sendMessage: async (data: {
    receiverId: number
    postId: number
    content: string
  }): Promise<Message> => {
    const res = await api.post<Message>('/messages', data)
    return res.data
  },

  markRead: async (conversationId: number): Promise<void> => {
    await api.put(`/messages/conversations/${conversationId}/read`)
  },
}
