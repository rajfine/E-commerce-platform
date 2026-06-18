import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLike } from '../../likes/hooks/useLike.js'

const ProductCard = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const user = useSelector(state => state.auth.user)
  const { handleToggleLike, likedProducts } = useLike()
  const isLiked = likedProducts?.some(p => p._id === product._id)

  // console.log(product)
  const imgSrc = product?.images[0].url || '/images/cat-shirts.png'
  const altImg = product?.images[1]?.url || imgSrc
  const title = product?.title || 'Premium Product'
  const price = product?.variant?.[0]?.price?.amount ?? (product?.price?.amount || 2499)
  const currency = product?.variant?.[0]?.price?.currency || product?.price?.currency || 'INR'

  const nevigate = useNavigate()

  const formatPrice = (amt, cur) => {
    if (cur === 'INR') return `₹${Number(amt).toLocaleString('en-IN')}`
    return `$${Number(amt).toFixed(2)}`
  }

  return (
    <div
      className="group opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div onClick={()=>{nevigate(`/product/${product._id}`)}} className="relative aspect-[3/4] rounded-[3px] overflow-hidden bg-surface mb-4 cursor-pointer">
        <img
          src={hovered ? altImg : imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!user) {
              setShowLoginPopup(true)
              return
            }
            handleToggleLike(product)
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          aria-label="Add to wishlist"
        >
          <svg width="16" height="16" fill={isLiked ? '#C86B3C' : 'none'} stroke={isLiked ? '#C86B3C' : '#2C2825'} strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* Quick View */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full py-3 bg-charcoal/90 backdrop-blur-sm text-white text-[12px] font-medium tracking-[0.1em] uppercase rounded-[3px] hover:bg-charcoal transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-1.5 px-0.5">
        <h3 className="font-body text-[14px] text-charcoal font-medium leading-snug line-clamp-1">
          {title}
        </h3>
        <p className="font-body text-[15px] text-charcoal/90 font-semibold tracking-wide">
          {formatPrice(price, currency)}
        </p>
      </div>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => { e.stopPropagation(); setShowLoginPopup(false); }}
        >
          <div 
            className="bg-ivory w-full max-w-sm rounded-[3px] p-8 shadow-xl relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setShowLoginPopup(false); }}
              className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal transition-colors"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-2">Login Required</h3>
              <p className="font-body text-sm text-charcoal/70 mb-6">Please log in to your account to add items to your wishlist.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); nevigate('/login'); }}
                  className="w-full py-3 bg-terracotta text-white text-[11px] font-semibold tracking-widest uppercase rounded-[3px] hover:bg-terracotta-dark transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowLoginPopup(false); }}
                  className="w-full py-3 border border-sand text-charcoal text-[11px] font-semibold tracking-widest uppercase rounded-[3px] hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard
