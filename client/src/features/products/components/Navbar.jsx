import React, { useState, useEffect } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = ['Men', 'Women', 'New Arrivals', 'Collections', 'Sale']

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <a href="/" className="font-display text-2xl md:text-[26px] tracking-[0.15em] text-charcoal font-medium">
            SNITCH
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <a
                key={link}
                href="#"
                className="font-body text-[13px] tracking-[0.08em] uppercase text-charcoal/80 hover:text-terracotta transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 md:gap-6">
            {/* Search */}
            <button aria-label="Search" className="text-charcoal/70 hover:text-charcoal transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />
              </svg>
            </button>
            {/* Wishlist */}
            <button aria-label="Wishlist" className="hidden md:block text-charcoal/70 hover:text-charcoal transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            {/* Cart */}
            <button aria-label="Cart" className="relative text-charcoal/70 hover:text-charcoal transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-terracotta text-white text-[9px] font-semibold rounded-full flex items-center justify-center">0</span>
            </button>
            {/* Profile */}
            <a href="/login" aria-label="Profile" className="hidden md:block text-charcoal/70 hover:text-charcoal transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </a>
            {/* Mobile hamburger */}
            <button
              aria-label="Menu"
              className="lg:hidden text-charcoal"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? 'max-h-80' : 'max-h-0'}`}>
        <div className="px-6 py-6 bg-ivory/95 backdrop-blur-xl border-t border-sand/50 space-y-4">
          {navLinks.map(link => (
            <a
              key={link}
              href="#"
              className="block font-body text-sm tracking-[0.06em] uppercase text-charcoal/80 hover:text-terracotta transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
