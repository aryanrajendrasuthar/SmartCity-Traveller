import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FiGlobe, FiUser, FiMenu, FiX, FiLogOut, FiMap, FiBriefcase } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <FiGlobe className="text-white text-lg" />
            </div>
            <span className="font-bold text-lg text-slate-800">
              Smart<span className="text-primary-500">City</span> Traveller
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search?type=FLIGHT" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1.5">
              Flights
            </Link>
            <Link to="/search?type=HOTEL" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Hotels
            </Link>
            <Link to="/search?type=TOUR" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Tours
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user?.name[0]}</span>
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.name.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm">{user?.name}</p>
                        <p className="text-slate-400 text-xs">{user?.email}</p>
                      </div>
                      <Link to="/trips" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <FiBriefcase className="text-slate-400" /> My Trips
                      </Link>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <FiUser className="text-slate-400" /> Profile
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <FiMap className="text-slate-400" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                          <FiLogOut /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden sm:block text-slate-600 hover:text-slate-800 font-medium px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Get started
                </Link>
              </div>
            )}

            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1"
          >
            {['FLIGHT', 'HOTEL', 'TOUR'].map(type => (
              <Link key={type} to={`/search?type=${type}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium capitalize">
                {type.charAt(0) + type.slice(1).toLowerCase()}s
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Sign in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-primary-600 hover:bg-primary-50 font-medium">Get started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </header>
  )
}
