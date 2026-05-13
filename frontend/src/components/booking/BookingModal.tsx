import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { FiX, FiCalendar, FiUsers, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { differenceInDays, addDays, format } from 'date-fns'
import { bookingService } from '../../services/bookingService'
import type { Listing } from '../../types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

interface Props {
  listing: Listing
  onClose: () => void
}

function CheckoutForm({ listing, startDate, endDate, guestCount, bookingId, clientSecret, onSuccess }: {
  listing: Listing
  startDate: Date
  endDate: Date
  guestCount: number
  bookingId: number
  clientSecret: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const nights = differenceInDays(endDate, startDate)
  const total = listing.price * nights

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const card = elements.getElement(CardElement)
    if (!card) { setLoading(false); return }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    })

    if (error) {
      toast.error(error.message || 'Payment failed')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      await bookingService.confirm(bookingId)
      toast.success('Booking confirmed!')
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>${listing.price} × {nights} night{nights !== 1 ? 's' : ''}</span>
          <span>${(listing.price * nights).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>{guestCount} guest{guestCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-2 mt-1">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Card details</label>
        <div className="border border-slate-300 rounded-xl p-3 bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#334155', '::placeholder': { color: '#94a3b8' } } } }} />
        </div>
        <p className="text-xs text-slate-400 mt-1">Use test card: 4242 4242 4242 4242</p>
      </div>

      <button type="submit" disabled={loading || !stripe} className="btn-primary w-full py-3">
        {loading ? 'Processing…' : `Pay $${total.toLocaleString()}`}
      </button>
    </form>
  )
}

export default function BookingModal({ listing, onClose }: Props) {
  const [step, setStep] = useState<'dates' | 'payment' | 'done'>('dates')
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 3))
  const [guestCount, setGuestCount] = useState(1)
  const [booking, setBooking] = useState<{ id: number; clientSecret: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const nights = differenceInDays(endDate, startDate)

  const handleContinue = async () => {
    if (nights < 1) { toast.error('End date must be after start date'); return }
    setLoading(true)
    try {
      const result = await bookingService.create({
        listingId: listing.id,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        guestCount,
      })
      setBooking({ id: result.id, clientSecret: result.stripeClientSecret! })
      setStep('payment')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-800">
                {step === 'dates' && 'Select Dates'}
                {step === 'payment' && 'Complete Payment'}
                {step === 'done' && 'Booking Confirmed!'}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{listing.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <FiX className="text-slate-500" />
            </button>
          </div>

          <div className="p-5">
            {step === 'dates' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <FiCalendar className="text-xs" /> Check-in
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={d => d && setStartDate(d)}
                      minDate={new Date()}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="MMM d, yyyy"
                      className="input w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                      <FiCalendar className="text-xs" /> Check-out
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={d => d && setEndDate(d)}
                      minDate={addDays(startDate, 1)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="MMM d, yyyy"
                      className="input w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <FiUsers className="text-xs" /> Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={listing.maxGuests || 20}
                    value={guestCount}
                    onChange={e => setGuestCount(Number(e.target.value))}
                    className="input w-full"
                  />
                  {listing.maxGuests && (
                    <p className="text-xs text-slate-400 mt-1">Max {listing.maxGuests} guests</p>
                  )}
                </div>

                {nights >= 1 && (
                  <div className="bg-primary-50 rounded-xl p-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>${listing.price.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                      <span className="font-semibold text-primary-700">${(listing.price * nights).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  disabled={loading || nights < 1}
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  {loading ? 'Preparing…' : 'Continue to Payment'}
                </button>
              </div>
            )}

            {step === 'payment' && booking && (
              <Elements stripe={stripePromise} options={{ clientSecret: booking.clientSecret }}>
                <CheckoutForm
                  listing={listing}
                  startDate={startDate}
                  endDate={endDate}
                  guestCount={guestCount}
                  bookingId={booking.id}
                  clientSecret={booking.clientSecret}
                  onSuccess={() => setStep('done')}
                />
              </Elements>
            )}

            {step === 'done' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-600 text-2xl" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">You're all set!</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Confirmation email sent. Check My Trips to manage your booking.
                </p>
                <button onClick={onClose} className="btn-primary px-8 py-2.5">Done</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
