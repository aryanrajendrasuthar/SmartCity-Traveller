import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiSearch, FiSliders, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { listingService } from '../services/listingService'
import ListingCard from '../components/listing/ListingCard'
import SearchFilters from '../components/listing/SearchFilters'
import type { SearchParams } from '../types'

const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [filters, setFilters] = useState<SearchParams>({
    type: searchParams.get('type') || undefined,
    location: searchParams.get('location') || undefined,
    keyword: searchParams.get('keyword') || undefined,
    sortBy: 'default',
    page: 0,
    size: 12,
  })

  const [keyword, setKeyword] = useState(filters.keyword || '')

  const { data, isLoading } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingService.search(filters),
    placeholderData: prev => prev,
  })

  useEffect(() => {
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    if (type || location) {
      setFilters(f => ({ ...f, type: type || undefined, location: location || undefined, page: 0 }))
    }
  }, [])

  const updateFilters = (partial: Partial<SearchParams>) => {
    setFilters(f => ({ ...f, ...partial }))
  }

  const resetFilters = () => {
    setFilters({ sortBy: 'default', page: 0, size: 12 })
    setKeyword('')
  }

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ keyword: keyword || undefined, page: 0 })
  }

  const totalResults = data?.totalElements ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {filters.type ? `${filters.type.charAt(0) + filters.type.slice(1).toLowerCase()}s` : 'All Listings'}
          {filters.location && <span className="font-normal text-slate-500"> in {filters.location}</span>}
        </h1>
        {data && <p className="text-slate-500 text-sm mt-1">{totalResults} results found</p>}
      </div>

      {/* Keyword search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleKeywordSearch} className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="input pl-10 w-full"
          />
        </form>

        <select
          value={filters.sortBy || 'default'}
          onChange={e => updateFilters({ sortBy: e.target.value, page: 0 })}
          className="input w-full sm:w-48"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden btn-outline flex items-center gap-2 px-4 py-2"
        >
          <FiSliders /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="card p-4 sticky top-24">
            <SearchFilters filters={filters} onChange={updateFilters} onReset={resetFilters} />
          </div>
        </aside>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {filtersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed left-0 top-0 h-full w-72 bg-white z-50 p-6 overflow-y-auto shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)}><FiX className="text-xl" /></button>
                </div>
                <SearchFilters filters={filters} onChange={f => { updateFilters(f); setFiltersOpen(false) }} onReset={() => { resetFilters(); setFiltersOpen(false) }} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !data?.content.length ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No listings found</h3>
              <p className="text-slate-400 mb-4">Try adjusting your filters or search term</p>
              <button onClick={resetFilters} className="btn-primary px-6 py-2">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.content.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    disabled={data.first}
                    onClick={() => updateFilters({ page: (filters.page ?? 0) - 1 })}
                    className="btn-outline px-4 py-2 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-slate-500 text-sm">
                    Page {(filters.page ?? 0) + 1} of {data.totalPages}
                  </span>
                  <button
                    disabled={data.last}
                    onClick={() => updateFilters({ page: (filters.page ?? 0) + 1 })}
                    className="btn-outline px-4 py-2 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
