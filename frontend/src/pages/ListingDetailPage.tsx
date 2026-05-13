import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiStar, FiMapPin, FiUsers, FiCheck, FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi'
import { listingService } from '../services/listingService'
import BookingModal from '../components/booking/BookingModal'
import { useAuth } from '../context/AuthContext'

const typeBadge: Record<string, string> = {
  HOTEL: 'badge-hotel',
  FLIGHT: 'badge-flight',
  TOUR: 'badge-tour',
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [activeImg, setActiveImg] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getById(Number(id)),
  })

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="aspect-video bg-slate-200 rounded-2xl" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Listing not found.</p>
        <button onClick={() => navigate(-1)} className="btn-outline px-6 py-2">Go back</button>
      </div>
    )
  }

  const amenities = listing.amenities ? listing.amenities.split(',').map(a => a.trim()) : []
  const highlights = listing.highlights ? listing.highlights.split(',').map(h => h.trim()) : []
  const images = listing.images.length ? listing.images : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200']

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setBookingOpen(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 mb-6 transition-colors text-sm"
      >
        <FiArrowLeft /> Back to results
      </button>

      {/* Image gallery */}
      <div className="mb-8">
        <div className="overflow-x-auto flex gap-3 snap-x snap-mandatory rounded-2xl">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="snap-start flex-shrink-0 cursor-pointer"
              style={{ width: i === 0 ? '100%' : 200 }}
              onClick={() => setActiveImg(i)}
            >
              <img
                src={img}
                alt={`${listing.title} ${i + 1}`}
                className={`rounded-2xl object-cover transition-all ${
                  i === 0
                    ? 'w-full aspect-video'
                    : 'w-48 h-32'
                } ${activeImg === i && i !== 0 ? 'ring-2 ring-primary-500' : ''}`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title row */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={typeBadge[listing.type]}>
                    {listing.type.charAt(0) + listing.type.slice(1).toLowerCase()}
                  </span>
                  {listing.category && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{listing.category}</span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">{listing.title}</h1>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                <FiShare2 className="text-slate-500" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <FiMapPin className="text-primary-500" />
                <span>{listing.location}</span>
              </div>
              {listing.rating != null && (
                <div className="flex items-center gap-1">
                  <FiStar className="fill-amber-400 text-amber-400" />
                  <span className="font-medium text-slate-700">{listing.rating.toFixed(1)}</span>
                  {listing.reviewCount != null && (
                    <span>({listing.reviewCount} reviews)</span>
                  )}
                </div>
              )}
              {listing.maxGuests && (
                <div className="flex items-center gap-1">
                  <FiUsers />
                  <span>Up to {listing.maxGuests} guests</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="font-semibold text-slate-800 mb-2">About</h2>
              <p className="text-slate-600 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div>
              <h2 className="font-semibold text-slate-800 mb-3">Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {highlights.map(h => (
                  <li key={h} className="flex items-start gap-2 text-slate-600 text-sm">
                    <FiCheck className="text-primary-500 mt-0.5 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="font-semibold text-slate-800 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-1.5">
                    <FiCheck className="text-primary-500 text-xs" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking card */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary-600">${listing.price.toLocaleString()}</span>
              <span className="text-slate-400 text-sm ml-1">/ night</span>
            </div>

            {listing.rating != null && (
              <div className="flex items-center gap-1.5 mb-4 text-sm">
                <FiStar className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-800">{listing.rating.toFixed(1)}</span>
                {listing.reviewCount != null && (
                  <span className="text-slate-400">· {listing.reviewCount} reviews</span>
                )}
              </div>
            )}

            {listing.available === false ? (
              <div className="bg-red-50 text-red-600 text-center py-3 rounded-xl text-sm font-medium mb-3">
                Currently unavailable
              </div>
            ) : (
              <button onClick={handleBook} className="btn-primary w-full py-3 text-base mb-3">
                Book Now
              </button>
            )}

            <button className="btn-outline w-full py-2.5 flex items-center justify-center gap-2 text-sm">
              <FiHeart className="text-sm" /> Save to Wishlist
            </button>

            <p className="text-xs text-slate-400 text-center mt-3">No charge until confirmation</p>
          </div>
        </div>
      </div>

      {/* Booking modal */}
      {bookingOpen && (
        <BookingModal listing={listing} onClose={() => setBookingOpen(false)} />
      )}
    </div>
  )
}
