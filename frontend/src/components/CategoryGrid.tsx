import { useNavigate } from 'react-router-dom'
import {
  Car,
  Bike,
  Briefcase,
  Home,
  Smartphone,
  Sofa,
  Shirt,
  BookOpen,
  Trophy,
  Wrench,
  PawPrint,
  GraduationCap,
  UtensilsCrossed,
  Plane,
  Heart,
  Leaf,
  MoreHorizontal,
} from 'lucide-react'
import type { Category } from '../types'
import { DEFAULT_CATEGORIES } from '../lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Car,
  Bike,
  Briefcase,
  Home,
  Smartphone,
  Sofa,
  Shirt,
  BookOpen,
  Trophy,
  Wrench,
  PawPrint,
  GraduationCap,
  UtensilsCrossed,
  Plane,
  Heart,
  Leaf,
  MoreHorizontal,
}

const CATEGORY_COLORS = [
  'from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 border-blue-500/20 hover:border-blue-400/40 text-blue-400',
  'from-orange-500/20 to-orange-600/10 hover:from-orange-500/30 border-orange-500/20 hover:border-orange-400/40 text-orange-400',
  'from-green-500/20 to-green-600/10 hover:from-green-500/30 border-green-500/20 hover:border-green-400/40 text-green-400',
  'from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 border-purple-500/20 hover:border-purple-400/40 text-purple-400',
  'from-cyan-500/20 to-cyan-600/10 hover:from-cyan-500/30 border-cyan-500/20 hover:border-cyan-400/40 text-cyan-400',
  'from-pink-500/20 to-pink-600/10 hover:from-pink-500/30 border-pink-500/20 hover:border-pink-400/40 text-pink-400',
  'from-yellow-500/20 to-yellow-600/10 hover:from-yellow-500/30 border-yellow-500/20 hover:border-yellow-400/40 text-yellow-400',
  'from-red-500/20 to-red-600/10 hover:from-red-500/30 border-red-500/20 hover:border-red-400/40 text-red-400',
  'from-indigo-500/20 to-indigo-600/10 hover:from-indigo-500/30 border-indigo-500/20 hover:border-indigo-400/40 text-indigo-400',
  'from-teal-500/20 to-teal-600/10 hover:from-teal-500/30 border-teal-500/20 hover:border-teal-400/40 text-teal-400',
  'from-rose-500/20 to-rose-600/10 hover:from-rose-500/30 border-rose-500/20 hover:border-rose-400/40 text-rose-400',
  'from-emerald-500/20 to-emerald-600/10 hover:from-emerald-500/30 border-emerald-500/20 hover:border-emerald-400/40 text-emerald-400',
  'from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 border-amber-500/20 hover:border-amber-400/40 text-amber-400',
  'from-sky-500/20 to-sky-600/10 hover:from-sky-500/30 border-sky-500/20 hover:border-sky-400/40 text-sky-400',
  'from-lime-500/20 to-lime-600/10 hover:from-lime-500/30 border-lime-500/20 hover:border-lime-400/40 text-lime-400',
  'from-violet-500/20 to-violet-600/10 hover:from-violet-500/30 border-violet-500/20 hover:border-violet-400/40 text-violet-400',
  'from-gray-500/20 to-gray-600/10 hover:from-gray-500/30 border-gray-500/20 hover:border-gray-400/40 text-gray-400',
]

interface CategoryGridProps {
  categories?: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const navigate = useNavigate()
  const cats = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {cats.map((cat, i) => {
        const Icon = ICON_MAP[cat.iconName] || MoreHorizontal
        const colorClass = CATEGORY_COLORS[i % CATEGORY_COLORS.length]

        return (
          <button
            key={cat.id}
            onClick={() => navigate(`/posts?category=${cat.slug}`)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border bg-gradient-to-br ${colorClass} transition-all duration-300 hover:scale-105 hover:shadow-card-hover group`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-navy-900/50 group-hover:scale-110 transition-transform duration-200">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-white text-center leading-tight">
              {cat.name}
            </span>
            {cat.postCount !== undefined && (
              <span className="text-xs text-gray-400">{cat.postCount}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
