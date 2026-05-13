import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi'
import { listingService } from '../services/listingService'
import ListingCard from '../components/listing/ListingCard'

const DESTINATIONS = [
  { city: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1431274172761-fcdab704a698?w=600', type: 'HOTEL' },
  { city: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', type: 'TOUR' },
  { city: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600', type: 'HOTEL' },
  { city: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', type: 'TOUR' },
  { city: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600', type: 'HOTEL' },
  { city: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600', type: 'FLIGHT' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [type, setType] = useState('HOTEL')
  const [location, setLocation] = useState('')
  const [guests, setGuests] = useState(1)

  const { data: featured } = useQuery({
    queryKey: ['featured'],
    queryFn: () => listingService.getFeatured(0, 6),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ type, ...(location && { location }) })
    navigate(`/search?${params}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70" />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            Explore the World with{' '}
            <span className="text-primary-400">SmartCity</span> Traveller
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg text-white/80 mb-10 max-w-xl mx-auto"
          >
            Flights, hotels, and tours — all in one place. Discover your next adventure.
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto"
          >
            {/* Type selector */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {['HOTEL', 'FLIGHT', 'TOUR'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    type === t ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.charAt(0) + t.slice(1).toLowerCase()}s
                </button>
              ))}
            </div>

            {/* Location */}
            <div className="flex-1 relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Where to?"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2 px-3 border-l border-slate-200">
              <FiUsers className="text-slate-400" />
              <input
                type="number"
                min={1}
                max={20}
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="w-14 text-slate-800 bg-transparent outline-none text-center"
              />
              <span className="text-slate-400 text-sm">guests</span>
            </div>

            <button type="submit" className="btn-primary px-6 py-2.5 flex items-center gap-2 rounded-xl">
              <FiSearch />
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[['50K+', 'Happy Travelers'], ['200+', 'Destinations'], ['4.9★', 'Avg Rating']].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-bold">{num}</p>
                <p className="text-primary-100 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Featured Destinations</h2>
            <p className="text-slate-500 mt-1">Handpicked places for your next trip</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {DESTINATIONS.map(dest => (
            <motion.button
              key={dest.city}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/search?type=${dest.type}&location=${dest.city}`)}
              className="group text-left"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-2">
                <img
                  src={dest.img}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{dest.city}</p>
              <p className="text-slate-400 text-xs">{dest.country}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Top Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Top Listings</h2>
            <p className="text-slate-500 mt-1">Most popular flights, hotels, and tours</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center gap-1.5 text-primary-600 font-medium hover:gap-2.5 transition-all text-sm"
          >
            View all <FiArrowRight />
          </button>
        </div>

        {featured?.content ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.content.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}
      </section>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to start your adventure?</h2>
          <p className="text-primary-100 mb-8">Join thousands of travelers exploring the world with SmartCity Traveller.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
          >
            Get started for free
          </button>
        </div>
      </section>
    </div>
  )
}
