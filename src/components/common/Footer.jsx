import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="site-footer" className="relative border-t border-white/5">
      {/* Gradient top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kerala-teal/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kerala-green to-kerala-teal flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <span className="font-heading text-xl font-semibold text-kerala-white">
                Kerala<span className="text-kerala-teal">Tourism</span>
              </span>
            </Link>
            <p className="text-kerala-white/50 text-sm leading-relaxed">
              Discover God's Own Country. Experience the magic of Kerala's backwaters, beaches, hills, and vibrant culture.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-heading text-kerala-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              {['Destinations', 'Map', 'Trip Planner'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-kerala-white/50 text-sm hover:text-kerala-teal transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-kerala-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {['Beaches', 'Hills', 'Backwaters', 'Wildlife', 'Temples'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/destinations?category=${item.toLowerCase()}`}
                    className="text-kerala-white/50 text-sm hover:text-kerala-teal transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-kerala-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-kerala-white/50 text-sm mb-4">
              Get travel tips and seasonal recommendations.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-kerala-white placeholder:text-kerala-white/30 focus:outline-none focus:border-kerala-teal/50 transition-colors"
              />
              <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-kerala-green to-kerala-teal text-white text-sm font-medium hover:shadow-lg hover:shadow-kerala-green/20 transition-all">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-kerala-white/30 text-xs">
            © 2026 Kerala Tourism Guide. Built with ❤️ for God's Own Country.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-kerala-white/30 text-xs hover:text-kerala-teal transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
