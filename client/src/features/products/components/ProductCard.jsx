import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // console.log(product)
  const imgSrc = product?.images[0].url || '/images/cat-shirts.png'
  const altImg = product?.images[1]?.url || imgSrc
  const title = product?.title || 'Premium Product'
  const price = product?.price?.amount || 2499
  const currency = product?.price?.currency || 'INR'

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
      <div onClick={()=>{nevigate(`/product/${product._id}`)}} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-surface mb-4 cursor-pointer">
        <img
          src={hovered ? altImg : imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted) }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          aria-label="Add to wishlist"
        >
          <svg width="16" height="16" fill={wishlisted ? '#C86B3C' : 'none'} stroke={wishlisted ? '#C86B3C' : '#2C2825'} strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* Quick View */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full py-3 bg-charcoal/90 backdrop-blur-sm text-white text-[12px] font-medium tracking-[0.1em] uppercase rounded-lg hover:bg-charcoal transition-colors">
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
    </div>
  )
}

export default ProductCard
