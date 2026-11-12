import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Menu,
  X,
  MessageSquare,
  User,
  LogOut,
  ChevronDown,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
              <Zap className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white">
              Post<span className="text-accent">Pe</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="btn-ghost text-sm">Home</Link>
            <Link to="/posts" className="btn-ghost text-sm">Browse Ads</Link>
            {isAuthenticated && (
              <Link to="/messages" className="btn-ghost text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Messages
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/posts/create"
              className="btn-primary text-sm hidden sm:flex"
            >
              <Plus className="w-4 h-4" />
              Post Ad
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-navy-600 transition-colors"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-accent/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-navy-600 border border-accent/30 flex items-center justify-center text-accent font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm text-white font-medium max-w-24 truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="hidden md:block w-4 h-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-20 w-52 card py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-navy-500 mb-1">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/messages"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Link>
                      <div className="border-t border-navy-500 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-navy-600 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-navy-600/50 bg-navy-900 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/posts"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
            >
              Browse Ads
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-navy-600 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-accent font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/posts/create"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-navy-900 font-semibold mt-2',
              )}
            >
              <Plus className="w-4 h-4" />
              Post Free Ad
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
