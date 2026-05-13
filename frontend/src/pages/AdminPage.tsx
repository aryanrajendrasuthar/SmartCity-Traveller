import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2, FiList, FiCalendar, FiUsers,
  FiCheck, FiX, FiRefreshCw
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { listingService } from '../services/listingService'
import { bookingService } from '../services/bookingService'
import type { Listing, BookingStatus } from '../types'

type Tab = 'listings' | 'bookings'

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
  COMPLETED: 'bg-slate-100 text-slate-600',
}

interface ListingFormData {
  type: string
  title: string
  location: string
  description: string
  price: string
  images: string
  amenities: string
  maxGuests: string
  highlights: string
  category: string
  available: boolean
}

const EMPTY_FORM: ListingFormData = {
  type: 'HOTEL', title: '', location: '', description: '',
  price: '', images: '', amenities: '', maxGuests: '',
  highlights: '', category: '', available: true,
}

function ListingFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Listing
  onSave: (data: Partial<Listing>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<ListingFormData>(
    initial
      ? {
          type: initial.type,
          title: initial.title,
          location: initial.location,
          description: initial.description || '',
          price: String(initial.price),
          images: initial.images.join(','),
          amenities: initial.amenities || '',
          maxGuests: initial.maxGuests ? String(initial.maxGuests) : '',
          highlights: initial.highlights || '',
          category: initial.category || '',
          available: initial.available !== false,
        }
      : EMPTY_FORM
  )

  const set = (key: keyof ListingFormData, val: string | boolean) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.location || !form.price) {
      toast.error('Title, location, and price are required')
      return
    }
    onSave({
      type: form.type as Listing['type'],
      title: form.title,
      location: form.location,
      description: form.description,
      price: Number(form.price),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
      amenities: form.amenities,
      maxGuests: form.maxGuests ? Number(form.maxGuests) : undefined,
      highlights: form.highlights,
      category: form.category,
      available: form.available,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-4">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">{initial ? 'Edit Listing' : 'New Listing'}</h2>
          <button onClick={onClose}><FiX className="text-slate-400 text-xl" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="input w-full">
                <option value="HOTEL">Hotel</option>
                <option value="FLIGHT">Flight</option>
                <option value="TOUR">Tour</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="Luxury, Budget…" className="input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Grand Palace Hotel" className="input w-full" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location *</label>
              <input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="Paris, France" className="input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Price (USD) *</label>
              <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="299" className="input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe this listing…" className="input w-full resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Image URLs (comma-separated)</label>
            <input value={form.images} onChange={e => set('images', e.target.value)} placeholder="https://…, https://…" className="input w-full" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amenities (comma-separated)</label>
              <input value={form.amenities} onChange={e => set('amenities', e.target.value)} placeholder="WiFi, Pool, Gym" className="input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Max Guests</label>
              <input type="number" min="1" value={form.maxGuests} onChange={e => set('maxGuests', e.target.value)} placeholder="4" className="input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Highlights (comma-separated)</label>
            <input value={form.highlights} onChange={e => set('highlights', e.target.value)} placeholder="Ocean view, Free breakfast" className="input w-full" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)} className="accent-primary-500 w-4 h-4" />
            <span className="text-sm text-slate-700">Available</span>
          </label>
        </form>

        <div className="flex gap-3 p-5 border-t border-slate-100">
          <button onClick={onClose} className="btn-outline flex-1 py-2.5">Cancel</button>
          <button form="listing-form" type="button" onClick={handleSubmit} className="btn-primary flex-1 py-2.5">
            {initial ? 'Save Changes' : 'Create Listing'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('listings')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Listing | null>(null)
  const qc = useQueryClient()

  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: () => listingService.search({ page: 0, size: 50 }),
  })

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => bookingService.getAllBookings(0, 50),
    enabled: tab === 'bookings',
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<Listing>) => listingService.create(data),
    onSuccess: () => {
      toast.success('Listing created!')
      qc.invalidateQueries({ queryKey: ['admin-listings'] })
      setFormOpen(false)
    },
    onError: () => toast.error('Failed to create listing'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Listing> }) => listingService.update(id, data),
    onSuccess: () => {
      toast.success('Listing updated!')
      qc.invalidateQueries({ queryKey: ['admin-listings'] })
      setEditTarget(null)
    },
    onError: () => toast.error('Failed to update listing'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => listingService.delete(id),
    onSuccess: () => {
      toast.success('Listing deleted')
      qc.invalidateQueries({ queryKey: ['admin-listings'] })
    },
    onError: () => toast.error('Failed to delete listing'),
  })

  const handleDelete = (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage listings, bookings, and more</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {(['listings', 'bookings'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t === 'listings' ? <FiList /> : <FiCalendar />}
            {t}
          </button>
        ))}
      </div>

      {tab === 'listings' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm">{listingsData?.totalElements ?? 0} total listings</p>
            <button onClick={() => setFormOpen(true)} className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
              <FiPlus /> New Listing
            </button>
          </div>

          {listingsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Listing</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Location</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Available</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listingsData?.content.map(listing => (
                    <motion.tr
                      key={listing.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {listing.images?.[0] && (
                            <img src={listing.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          )}
                          <span className="font-medium text-slate-800 truncate max-w-[180px]">{listing.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{listing.type}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-500">{listing.location}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">${listing.price.toLocaleString()}</td>
                      <td className="px-4 py-3 hidden sm:table-cell text-center">
                        {listing.available !== false
                          ? <FiCheck className="text-green-500 mx-auto" />
                          : <FiX className="text-red-400 mx-auto" />
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditTarget(listing)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDelete(listing.id, listing.title)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-600"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'bookings' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 text-sm">{bookingsData?.totalElements ?? 0} total bookings</p>
            <button onClick={() => qc.invalidateQueries({ queryKey: ['admin-bookings'] })} className="btn-outline py-1.5 px-3 flex items-center gap-1.5 text-sm">
              <FiRefreshCw className="text-sm" /> Refresh
            </button>
          </div>

          {bookingsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3">Booking</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">User</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Dates</th>
                    <th className="text-right px-4 py-3">Total</th>
                    <th className="text-center px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingsData?.content.map(booking => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 truncate max-w-[160px]">{booking.listing.title}</p>
                        <p className="text-xs text-slate-400">#{booking.id}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-slate-700">{booking.user.name}</p>
                        <p className="text-xs text-slate-400">{booking.user.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-xs" />
                          {format(new Date(booking.startDate), 'MMM d')} – {format(new Date(booking.endDate), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1 text-xs mt-0.5">
                          <FiUsers className="text-xs" /> {booking.guestCount} guest{booking.guestCount !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">${booking.totalPrice.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Listing Form Modal */}
      {formOpen && (
        <ListingFormModal
          onSave={data => createMutation.mutate(data)}
          onClose={() => setFormOpen(false)}
        />
      )}
      {editTarget && (
        <ListingFormModal
          initial={editTarget}
          onSave={data => updateMutation.mutate({ id: editTarget.id, data })}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  )
}
