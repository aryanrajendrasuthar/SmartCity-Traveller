import api from './api'
import type { Booking, Page } from '../types'

export const bookingService = {
  create: (data: { listingId: number; startDate: string; endDate: string; guestCount: number }) =>
    api.post<Booking>('/bookings', data).then(r => r.data),

  confirm: (id: number) =>
    api.post<Booking>(`/bookings/${id}/confirm`).then(r => r.data),

  cancel: (id: number, reason?: string) =>
    api.post<Booking>(`/bookings/${id}/cancel`, { reason }).then(r => r.data),

  getUserBookings: (page = 0, size = 10) =>
    api.get<Page<Booking>>('/bookings', { params: { page, size } }).then(r => r.data),

  getById: (id: number) =>
    api.get<Booking>(`/bookings/${id}`).then(r => r.data),

  // Admin
  getAllBookings: (page = 0, size = 20) =>
    api.get<Page<Booking>>('/admin/bookings', { params: { page, size } }).then(r => r.data),
}
