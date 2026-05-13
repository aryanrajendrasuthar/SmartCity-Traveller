import { Link } from 'react-router-dom'
import { FiGlobe, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <FiGlobe className="text-white" />
              </div>
              <span className="font-bold text-white">SmartCity Traveller</span>
            </div>
            <p className="text-sm leading-relaxed">Discover the world's most incredible destinations — flights, hotels, and tours all in one place.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search?type=FLIGHT" className="hover:text-white transition-colors">Flights</Link></li>
              <li><Link to="/search?type=HOTEL" className="hover:text-white transition-colors">Hotels</Link></li>
              <li><Link to="/search?type=TOUR" className="hover:text-white transition-colors">Tours</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/trips" className="hover:text-white transition-colors">My Trips</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><FiGithub /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><FiTwitter /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><FiLinkedin /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-sm text-center">
          © 2025 Smart City Traveller. Built by Aryan Suthar.
        </div>
      </div>
    </footer>
  )
}
