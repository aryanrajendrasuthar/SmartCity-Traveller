import api from './api'
import type { Listing, Page, SearchParams } from '../types'

export const listingService = {
  search: (params: SearchParams) =>
    api.get<Page<Listing>>('/listings', { params }).then(r => r.data),

  getById: (id: number) =>
    api.get<Listing>(`/listings/${id}`).then(r => r.data),

  getFeatured: (page = 0, size = 6) =>
    api.get<Page<Listing>>('/listings/featured', { params: { page, size } }).then(r => r.data),

  // Admin
  create: (data: Partial<Listing>) =>
    api.post<Listing>('/admin/listings', data).then(r => r.data),

  update: (id: number, data: Partial<Listing>) =>
    api.put<Listing>(`/admin/listings/${id}`, data).then(r => r.data),

  delete: (id: number) =>
    api.delete(`/admin/listings/${id}`),
}
