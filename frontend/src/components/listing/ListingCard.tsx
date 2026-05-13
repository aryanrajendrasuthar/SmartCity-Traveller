import { Link } from 'react-router-dom'
import { FiStar, FiMapPin, FiUsers } from 'react-icons/fi'
import type { Listing } from '../../types'

interface Props {
  listing: Listing
}

const typeBadge: Record<string, string> = {
  HOTEL: 'badge-hotel',
  FLIGHT: 'badge-flight',
  TOUR: 'badge-tour',
}

export default function ListingCard({ listing }: Props) {
  const image = listing.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'

  return (
    <Link to={`/listings/${listing.id}`} className="card group block overflow-hidden hover:-translate-y-1 transition-transform duration-200">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`${typeBadge[listing.type]} absolute top-3 left-3`}>
          {listing.type.charAt(0) + listing.type.slice(1).toLowerCase()}
        </span>
        {listing.available === false && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-slate-800 font-semibold px-3 py-1 rounded-full text-sm">Sold Out</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-base leading-snug mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
          <FiMapPin className="flex-shrink-0 text-xs" />
          <span className="truncate">{listing.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary-600">${listing.price.toLocaleString()}</span>
            <span className="text-slate-400 text-xs ml-1">/ night</span>
          </div>

          <div className="flex items-center gap-2">
            {listing.maxGuests && (
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <FiUsers className="text-xs" />
                <span>{listing.maxGuests}</span>
              </div>
            )}
            {listing.rating != null && (
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-medium">
                <FiStar className="fill-amber-400 text-amber-400" />
                <span>{listing.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
