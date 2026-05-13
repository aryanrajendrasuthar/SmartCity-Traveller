import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin, FiUsers, FiX } from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { bookingService } from '../services/bookingService'
import type { Booking, BookingStatus } from '../types'

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'Pending Payment', bg: 'bg-amber-100', text: 'text-amber-700' },
  CONFIRMED: { label: 'Upcoming', bg: 'bg-green-100', text: 'text-green-700' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-600' },
  COMPLETED: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-600' },
}

function CancelDialog({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const qc = useQueryClient()

  const cancel = useMutation({
    mutationFn: () => bookingService.cancel(booking.id, reason),
    onSuccess: () => {
      toast.success('Booking cancelled')
      qc.invalidateQueries({ queryKey: ['my-bookings'] })
      onClose()
    },
    onError: () => toast.error('Failed to cancel booking'),
  })

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 className="font-bold text-slate-800 mb-2">Cancel Booking</h3>
        <p className="text-slate-500 text-sm mb-4">Are you sure you want to cancel "<span className="font-medium text-slate-700">{booking.listing.title}</span>"?</p>
        <textarea
          placeholder="Reason (optional)"
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          className="input w-full text-sm resize-none mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="btn-outline flex-1 py-2.5">Keep Booking</button>
          <button
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {cancel.isPending ? 'Cancelling…' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyTripsPage() {
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingService.getUserBookings(0, 20),
  })

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-5 animate-pulse flex gap-4">
            <div className="w-24 h-24 bg-slate-200 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const bookings = data?.content || []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Trips</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">✈️</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No trips yet</h3>
          <p className="text-slate-400 mb-6">Start exploring and book your first adventure!</p>
          <a href="/search" className="btn-primary px-6 py-2.5">Explore listings</a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => {
            const config = STATUS_CONFIG[booking.status]
            const img = booking.listing.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'
            const canCancel = booking.status === 'CONFIRMED' || booking.status === 'PENDING'

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-4 flex gap-4"
              >
                <img
                  src={img}
                  alt={booking.listing.title}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 truncate">{booking.listing.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-xs text-primary-500" /> {booking.listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-xs" />
                      {format(new Date(booking.startDate), 'MMM d')} – {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="text-xs" /> {booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">${booking.totalPrice.toLocaleString()}</span>
                    {canCancel && (
                      <button
                        onClick={() => setCancelTarget(booking)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition-colors"
                      >
                        <FiX className="text-xs" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {cancelTarget && (
        <CancelDialog booking={cancelTarget} onClose={() => setCancelTarget(null)} />
      )}
    </div>
  )
}
