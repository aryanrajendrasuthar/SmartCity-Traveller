import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiEdit2, FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)

  if (!user) return null

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{initials}</span>
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiUser className="text-slate-500 text-sm" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Full Name</p>
              <p className="text-slate-800 font-medium">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiMail className="text-slate-500 text-sm" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Email</p>
              <p className="text-slate-800 font-medium">{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPhone className="text-slate-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                <p className="text-slate-800 font-medium">{user.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FiCheck className="text-slate-500 text-sm" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Member Since</p>
              <p className="text-slate-800 font-medium">{format(new Date(user.createdAt), 'MMMM yyyy')}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => setEditing(!editing)}
            className="btn-outline px-5 py-2.5 flex items-center gap-2 text-sm"
          >
            <FiEdit2 className="text-sm" />
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
          {editing && (
            <p className="text-sm text-slate-400 mt-2">Profile editing connects to the backend API — implement as needed.</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
