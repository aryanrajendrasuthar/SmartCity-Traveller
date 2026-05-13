export type ListingType = 'FLIGHT' | 'HOTEL' | 'TOUR'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string
  phone?: string
  role: UserRole
  createdAt: string
}

export interface Listing {
  id: number
  type: ListingType
  title: string
  location: string
  description?: string
  price: number
  images: string[]
  rating?: number
  reviewCount?: number
  amenities?: string
  maxGuests?: number
  available?: boolean
  highlights?: string
  category?: string
  createdAt: string
}

export interface Booking {
  id: number
  user: User
  listing: Listing
  startDate: string
  endDate: string
  guestCount: number
  totalPrice: number
  status: BookingStatus
  stripeClientSecret?: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface SearchParams {
  type?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  available?: boolean
  keyword?: string
  sortBy?: string
  page?: number
  size?: number
}
