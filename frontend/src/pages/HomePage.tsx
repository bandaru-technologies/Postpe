import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  TrendingUp,
  Zap,
  ChevronRight,
  Star,
} from 'lucide-react'
import SearchBar from '../components/SearchBar'
import CategoryGrid from '../components/CategoryGrid'
import PostCard from '../components/PostCard'
import PostCardSkeleton from '../components/PostCardSkeleton'
import { categoryService, postService } from '../services/api'

const STATS = [
  { label: 'Active Listings', value: '2.5M+' },
  { label: 'Happy Users', value: '8M+' },
  { label: 'Cities Covered', value: '500+' },
  { label: 'Daily Deals', value: '50K+' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '📝',
    title: 'Post Your Ad',
    desc: 'Create a free listing in minutes. Add photos, set your price, and reach millions of buyers instantly.',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
  },
  {
    step: '02',
    icon: '🤝',
    title: 'Connect with Buyers',
    desc: 'Receive messages directly from interested buyers. Chat securely within our platform.',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  },
  {
    step: '03',
    icon: '💰',
    title: 'Close the Deal',
    desc: 'Meet, negotiate, and finalize your deal safely. Get paid and hand over the item.',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  },
]

export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  })

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => postService.getPosts({ featured: true, size: 8 }),
  })

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['posts', 'recent'],
    queryFn: () => postService.getPosts({ size: 9, sort: 'newest' }),
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 pt-16 pb-20">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-navy-600/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            India's fastest growing marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Buy, Sell &{' '}
            <span className="text-gradient">Find Anything</span>
            <br />
            Near You
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            PostPe connects millions of buyers and sellers across India.
            Post your ad for free and start selling today.
          </p>

          <div className="max-w-3xl mx-auto">
            <SearchBar large />
          </div>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-gray-500 text-sm">Popular:</span>
            {['iPhone', 'Honda City', '2BHK Flat', 'Sofa', 'Laptop'].map((s) => (
              <Link
                key={s}
                to={`/posts?search=${encodeURIComponent(s)}`}
                className="text-sm text-gray-400 hover:text-accent transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-accent">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-14 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Browse Categories</h2>
              <p className="section-subtitle">Find what you're looking for</p>
            </div>
            <Link to="/posts" className="link text-sm flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-14 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-accent fill-accent/30" />
                <h2 className="section-title">Featured Ads</h2>
              </div>
              <p className="section-subtitle">Handpicked premium listings</p>
            </div>
            <Link to="/posts?featured=true" className="link text-sm flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-none w-60">
                    <PostCardSkeleton />
                  </div>
                ))
              : featuredData?.content.map((post) => (
                  <div key={post.id} className="flex-none w-60">
                    <PostCard post={post} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-14 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="section-title">Recent Listings</h2>
              </div>
              <p className="section-subtitle">Fresh ads posted today</p>
            </div>
            <Link to="/posts?sort=newest" className="link text-sm flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLoading
              ? Array.from({ length: 9 }).map((_, i) => <PostCardSkeleton key={i} />)
              : recentData?.content.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/posts" className="btn-secondary inline-flex">
              Browse All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-page-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">How PostPe Works</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              Buying and selling has never been this simple. Get started in 3 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent/30 to-transparent z-10 -translate-y-1/2" />
                )}
                <div className={`card p-8 text-center border bg-gradient-to-br ${step.color} hover:scale-[1.02] transition-transform`}>
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="text-xs font-bold text-gray-500 tracking-widest mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/posts/create" className="btn-primary text-base px-10 py-4">
              <Zap className="w-5 h-5" />
              Post Your First Ad — It's Free!
            </Link>
          </div>
        </div>
      </section>

      {/* Trust banner */}
      <section className="py-12 bg-navy-900 border-t border-navy-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Safe & Secure', desc: 'Verified users and secure messaging protect you from fraud.' },
              { icon: '⚡', title: 'Post in Seconds', desc: 'No sign-up required to browse. Post ads for free in minutes.' },
              { icon: '🌍', title: 'Reach Millions', desc: 'Your ad reaches buyers across 500+ cities in India.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
