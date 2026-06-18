import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLike } from '../hooks/useLike.js'
import ProductCard from '../../products/components/ProductCard.jsx'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {
  const { handleGetLikes, likedProducts, loading } = useLike()
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      handleGetLikes()
    } else {
      navigate('/login')
    }
  }, [user])

  if (loading && likedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-ivory pt-24 pb-20 px-6 md:px-12 flex justify-center">
        <p className="font-body text-charcoal/60 uppercase tracking-widest text-sm">Loading Wishlist...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        <div className="text-center mb-16 animate-fade-up">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">Your Selection</p>
          <h1 className="font-display text-[32px] md:text-[42px] font-light text-charcoal">Wishlist</h1>
        </div>

        {likedProducts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center animate-fade-in">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-charcoal/20 mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <h3 className="font-display text-2xl text-charcoal mb-4">Your Wishlist is Empty</h3>
            <p className="font-body text-sm text-charcoal/60 mb-8 max-w-md">Looks like you haven't added anything to your wishlist yet. Explore our collections and save your favorite items.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-charcoal text-white font-body text-[11px] font-semibold tracking-widest uppercase px-10 py-4 hover:bg-terracotta transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {likedProducts.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
