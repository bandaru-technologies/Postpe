import { useState } from 'react'
import { Search, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { INDIAN_CITIES } from '../lib/utils'

interface SearchBarProps {
  initialQuery?: string
  initialCity?: string
  className?: string
  large?: boolean
}

export default function SearchBar({
  initialQuery = '',
  initialCity = '',
  className = '',
  large = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [city, setCity] = useState(initialCity)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('search', query)
    if (city) params.set('city', city)
    navigate(`/posts?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
    >
      <div className={`relative flex-1 ${large ? '' : ''}`}>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for cars, phones, houses..."
          className={`w-full bg-navy-800 border border-navy-500 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all ${
            large
              ? 'pl-12 pr-4 py-4 text-base'
              : 'pl-10 pr-4 py-3 text-sm'
          }`}
        />
      </div>

      <div className="relative sm:w-52">
        <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={`w-full appearance-none bg-navy-800 border border-navy-500 text-white rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all ${
            large
              ? 'pl-10 pr-8 py-4 text-base'
              : 'pl-10 pr-8 py-3 text-sm'
          }`}
        >
          <option value="">All Cities</option>
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={`btn-primary whitespace-nowrap ${large ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm'}`}
      >
        <Search className={large ? 'w-5 h-5' : 'w-4 h-4'} />
        Search
      </button>
    </form>
  )
}
