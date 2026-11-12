import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import { postService, categoryService } from '../services/api'
import type { PostFilters, PostType } from '../types'
import PostCard from '../components/PostCard'
import PostCardSkeleton from '../components/PostCardSkeleton'
import PriceFilter from '../components/PriceFilter'
import { INDIAN_CITIES, POST_TYPE_LABELS, DEFAULT_CATEGORIES } from '../lib/utils'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const POST_TYPES: PostType[] = ['SELL', 'BUY', 'SERVICE', 'RENT']

const MAX_PRICE = 10000000

export default function PostsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filters from URL
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [postType, setPostType] = useState<PostType | ''>((searchParams.get('postType') as PostType) || '')
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'newest')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE])
  const [page, setPage] = useState(0)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  })

  const cats = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES

  const filters: PostFilters = {
    page,
    size: 12,
    search: search || undefined,
    category: category || undefined,
    city: city || undefined,
    postType: postType || undefined,
    sort: sort as PostFilters['sort'],
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => postService.getPosts(filters),
  })

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (category) params.category = category
    if (city) params.city = city
    if (postType) params.postType = postType
    if (sort && sort !== 'newest') params.sort = sort
    setSearchParams(params, { replace: true })
  }, [search, category, city, postType, sort, setSearchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    setCity('')
    setPostType('')
    setSort('newest')
    setPriceRange([0, MAX_PRICE])
    setPage(0)
  }

  const hasActiveFilters = !!(search || category || city || postType || priceRange[0] > 0 || priceRange[1] < MAX_PRICE)

  const Sidebar = (
    <div className="space-y-6">
      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}

      {/* Category */}
      <div>
        <h3 className="text-white font-semibold mb-3 text-sm">Category</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => { setCategory(''); setPage(0) }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              !category ? 'bg-accent/10 text-accent border border-accent/20' : 'text-gray-400 hover:bg-navy-700 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {cats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.slug); setPage(0) }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                category === cat.slug ? 'bg-accent/10 text-accent border border-accent/20' : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-navy-700">
        <PriceFilter
          min={0}
          max={MAX_PRICE}
          value={priceRange}
          onChange={(v) => { setPriceRange(v); setPage(0) }}
        />
      </div>

      {/* City */}
      <div className="pt-4 border-t border-navy-700">
        <h3 className="text-white font-semibold mb-3 text-sm">City</h3>
        <select
          value={city}
          onChange={(e) => { setCity(e.target.value); setPage(0) }}
          className="input text-sm"
        >
          <option value="">All Cities</option>
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Post Type */}
      <div className="pt-4 border-t border-navy-700">
        <h3 className="text-white font-semibold mb-3 text-sm">Ad Type</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => { setPostType(''); setPage(0) }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              !postType ? 'bg-accent/10 text-accent border border-accent/20' : 'text-gray-400 hover:bg-navy-700 hover:text-white'
            }`}
          >
            All Types
          </button>
          {POST_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => { setPostType(type); setPage(0) }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                postType === type ? 'bg-accent/10 text-accent border border-accent/20' : 'text-gray-400 hover:bg-navy-700 hover:text-white'
              }`}
            >
              {POST_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Top bar */}
      <div className="bg-navy-900 border-b border-navy-700/50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listings..."
                className="input pl-10 py-2.5 text-sm"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0) }}
              className="input py-2.5 text-sm w-auto pr-8 hidden sm:block"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-secondary py-2.5 text-sm lg:hidden flex-none"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-accent text-navy-900 rounded-full text-xs font-bold flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-5 sticky top-32">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-4 h-4 text-accent" />
                <h2 className="text-white font-bold text-sm">Filters</h2>
              </div>
              {Sidebar}
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed left-0 top-0 bottom-0 w-72 bg-navy-900 z-50 p-5 overflow-y-auto lg:hidden border-r border-navy-700 animate-slide-up">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-bold">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                {Sidebar}
              </div>
            </>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-semibold">
                  {isLoading ? (
                    <span className="skeleton h-5 w-32 inline-block rounded" />
                  ) : (
                    `${data?.totalElements?.toLocaleString() ?? 0} listings found`
                  )}
                </p>
                {(category || city || postType) && (
                  <p className="text-gray-400 text-xs mt-0.5">
                    {[category, city, postType ? POST_TYPE_LABELS[postType] : ''].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(0) }}
                className="input py-2 text-sm w-auto pr-8 sm:hidden"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => <PostCardSkeleton key={i} />)
                : data?.content.length === 0
                ? (
                  <div className="col-span-full text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-white text-xl font-bold mb-2">No listings found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                    <button onClick={clearFilters} className="btn-secondary">
                      Clear Filters
                    </button>
                  </div>
                )
                : data?.content.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="btn-secondary px-3 py-2 disabled:opacity-40"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(data.totalPages, 7) }).map((_, i) => {
                  const pageNum = i
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-accent text-navy-900'
                          : 'text-gray-400 hover:bg-navy-700 hover:text-white'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  )
                })}

                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                  disabled={page >= data.totalPages - 1}
                  className="btn-secondary px-3 py-2 disabled:opacity-40"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
