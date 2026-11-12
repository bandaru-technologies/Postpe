import { Link } from 'react-router-dom'
import { Zap, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { DEFAULT_CATEGORIES } from '../lib/utils'

export default function Footer() {
  const leftCategories = DEFAULT_CATEGORIES.slice(0, 9)
  const rightCategories = DEFAULT_CATEGORIES.slice(9)

  return (
    <footer className="bg-navy-950 border-t border-navy-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white">
                Post<span className="text-accent">Pe</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              India's trusted platform for buying and selling. Post your ad for free and connect with millions of buyers and sellers.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-gray-400 transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-gray-400 transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-navy-700 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-gray-400 transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {leftCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/posts?category=${cat.slug}`}
                    className="text-gray-400 hover:text-accent text-sm transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">More Categories</h3>
            <ul className="space-y-2">
              {rightCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/posts?category=${cat.slug}`}
                    className="text-gray-400 hover:text-accent text-sm transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mt-6 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/posts/create" className="text-gray-400 hover:text-accent text-sm transition-colors">Post Free Ad</Link></li>
              <li><Link to="/posts" className="text-gray-400 hover:text-accent text-sm transition-colors">Browse Ads</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-accent text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Tech Park, Bengaluru,<br />Karnataka 560001, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="tel:+918001234567" className="text-gray-400 hover:text-accent text-sm transition-colors">
                  +91 800 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="mailto:support@postpe.in" className="text-gray-400 hover:text-accent text-sm transition-colors">
                  support@postpe.in
                </a>
              </li>
            </ul>
            <div className="mt-6 p-3 rounded-lg bg-navy-800 border border-navy-600">
              <p className="text-xs text-gray-400 mb-1">Support Hours</p>
              <p className="text-sm text-white font-medium">Mon - Sat: 9AM - 6PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} PostPe. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}
