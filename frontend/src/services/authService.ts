import api from './api'
import type { AuthResponse, User } from '../types'

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data).then(r => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then(r => r.data),

  getMe: () => api.get<User>('/users/me').then(r => r.data),

  updateProfile: (data: Record<string, string>) =>
    api.patch<User>('/users/me', data).then(r => r.data),
}
