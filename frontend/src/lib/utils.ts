import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 30) {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return 'Just now'
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi',
]

export const POST_TYPE_LABELS: Record<string, string> = {
  SELL: 'For Sale',
  BUY: 'Wanted',
  SERVICE: 'Service',
  RENT: 'For Rent',
}

export const POST_TYPE_COLORS: Record<string, string> = {
  SELL: 'bg-green-500/10 text-green-400 border-green-500/20',
  BUY: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  SERVICE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  RENT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

export const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Cars', slug: 'cars', iconName: 'Car', displayOrder: 1 },
  { id: 2, name: 'Bikes', slug: 'bikes', iconName: 'Bike', displayOrder: 2 },
  { id: 3, name: 'Jobs', slug: 'jobs', iconName: 'Briefcase', displayOrder: 3 },
  { id: 4, name: 'Real Estate', slug: 'real-estate', iconName: 'Home', displayOrder: 4 },
  { id: 5, name: 'Electronics', slug: 'electronics', iconName: 'Smartphone', displayOrder: 5 },
  { id: 6, name: 'Furniture', slug: 'furniture', iconName: 'Sofa', displayOrder: 6 },
  { id: 7, name: 'Fashion', slug: 'fashion', iconName: 'Shirt', displayOrder: 7 },
  { id: 8, name: 'Books', slug: 'books', iconName: 'BookOpen', displayOrder: 8 },
  { id: 9, name: 'Sports', slug: 'sports', iconName: 'Trophy', displayOrder: 9 },
  { id: 10, name: 'Services', slug: 'services', iconName: 'Wrench', displayOrder: 10 },
  { id: 11, name: 'Pets', slug: 'pets', iconName: 'PawPrint', displayOrder: 11 },
  { id: 12, name: 'Education', slug: 'education', iconName: 'GraduationCap', displayOrder: 12 },
  { id: 13, name: 'Food', slug: 'food', iconName: 'UtensilsCrossed', displayOrder: 13 },
  { id: 14, name: 'Travel', slug: 'travel', iconName: 'Plane', displayOrder: 14 },
  { id: 15, name: 'Health', slug: 'health', iconName: 'Heart', displayOrder: 15 },
  { id: 16, name: 'Agriculture', slug: 'agriculture', iconName: 'Leaf', displayOrder: 16 },
  { id: 17, name: 'Others', slug: 'others', iconName: 'MoreHorizontal', displayOrder: 17 },
]
