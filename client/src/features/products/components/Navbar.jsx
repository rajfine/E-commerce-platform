import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../cart/hook/useCart'
import { useAuth } from '../../auth/hooks/useAuth'

const Navbar = () => {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [isDark, setIsDark]           = useState(() => document.documentElement.classList.contains('dark'))

  const nevigate = useNavigate()
  const location = useLocation()
  const { handleGetCart } = useCart()
  const { handleLogout } = useAuth()

  const isCartPage = location.pathname === '/cart'

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const user    = useSelector((state) => state.auth.user)
  const isSeller = user?.role === 'seller'
  const cartItems = useSelector(state => state.cart?.items) || []

  // Count total quantity of items in cart
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    
    // Fetch cart on mount if user is logged in
    if (user) {
      handleGetCart()
    }
    
    return () => window.removeEventListener('scroll', onScroll)
  }, [user])

  const navLinks = ['Men', 'Women', 'New Arrivals', 'Collections', 'Sale']

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-[30px]">
        <div className="flex items-center justify-between h-14 md:h-16">

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

            {/* Dashboard — only for sellers */}
            {isSeller && (
              <button
                onClick={() => nevigate("../seller/dashboard")}
                id="nav-dashboard"
                className="font-body text-[13px] tracking-[0.08em] uppercase text-terracotta hover:text-terracotta-dark transition-colors duration-300 flex items-center gap-1.5"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 md:gap-6">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} aria-label="Toggle Theme" className="text-charcoal/70 hover:text-charcoal transition-colors">
              {isDark ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
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
            <div className="relative group">
              <button 
                onClick={()=>{nevigate('/cart')}}
                aria-label="Cart" className="relative text-charcoal/70 hover:text-charcoal transition-colors py-2 flex items-center">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 -right-2 w-4 h-4 bg-terracotta text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mini Cart Dropdown */}
              <div className={`absolute right-0 top-full mt-0 w-[320px] bg-ivory border border-border shadow-2xl opacity-0 invisible transition-all duration-300 z-50 ${!isCartPage ? 'group-hover:opacity-100 group-hover:visible' : ''}`}>
                <div className="p-4 border-b border-border bg-ivory">
                  <h3 className="font-display tracking-widest uppercase text-xs">Your Cart ({cartCount})</h3>
                </div>
                
                <div className="max-h-[320px] overflow-y-auto p-4 space-y-5 bg-ivory">
                  {cartItems.length === 0 ? (
                    <p className="text-muted text-[10px] uppercase tracking-widest text-center py-6">Your cart is empty.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item._id} className="flex gap-4 group/item">
                        <img 
                          src={item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url} 
                          alt={item.product?.title} 
                          className="w-16 h-20 object-cover bg-surface border border-border"
                        />
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <p className="font-display text-[13px] uppercase tracking-wide">{item.product?.title}</p>
                            <p className="text-muted text-[10px] uppercase tracking-widest mt-1">Size: {item.size || 'OS'} / Qty: {item.quantity}</p>
                          </div>
                          <p className="font-display text-xs font-medium">₹ {item.price?.amount * item.quantity}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-4 border-t border-border bg-ivory">
                    <button 
                      onClick={() => nevigate('/cart')}
                      className="w-full bg-charcoal text-ivory py-3 text-[10px] tracking-widest uppercase hover:bg-softblack transition-colors"
                    >
                      Go to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile / Login */}
            <div className="relative group hidden md:block">
              <a href={user ? '#' : '/login'} aria-label="Profile" className="text-charcoal/70 hover:text-charcoal transition-colors py-2 block">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </a>
              {user && (
                <div className="absolute right-0 top-full mt-0 w-[200px] bg-ivory border border-border shadow-2xl opacity-0 invisible transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible">
                  <div className="p-4 border-b border-border bg-ivory text-center">
                    <p className="font-display tracking-widest text-sm text-charcoal truncate">Hi, {user.fullname || user.username || 'User'}</p>
                  </div>
                  <div className="p-4 bg-ivory flex justify-center">
                    <button 
                      onClick={() => {
                        handleLogout()
                        nevigate('/login')
                      }}
                      className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white bg-charcoal hover:bg-terracotta transition-colors px-6 py-2.5"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

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
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? 'max-h-96' : 'max-h-0'}`}>
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

          {/* Dashboard — mobile, seller only */}
          {isSeller && (
            <a
              href="/dashboard"
              id="nav-dashboard-mobile"
              className="flex items-center gap-2 font-body text-sm tracking-[0.06em] uppercase text-terracotta hover:text-terracotta-dark transition-colors"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
