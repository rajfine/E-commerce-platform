import React, { useEffect, useLayoutEffect, useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct.js'
import { useCart } from '../../cart/hook/useCart.js'

/* ─────────────────────────────────────────────────────────────────────────────
  PRODUCT DETAIL PAGE  ·  SNITCH Premium Fashion E-commerce
  Design System: Playfair Display (editorial) + Inter (functional)
  Palette: Ivory #FAF7F2 · Charcoal #2C2825 · Terracotta #C86B3C
───────────────────────────────────────────────────────────────────────────── */

/* ── SKELETON LOADER ──────────────────────────────────────────────────────── */
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-sand/60 rounded-sm ${className}`} />
)

/* ── PREMIUM TRUST BADGES ─────────────────────────────────────────────────── */
const trustItems = [
  {
    label: 'Premium Fabric',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 3.582-9 8s4.03 8 9 8 9-3.582 9-8-4.03-8-9-8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v4l2.5 2.5" />
      </svg>
    ),
  },
  {
    label: 'Easy Returns',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  {
    label: 'Free Shipping',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    label: 'Secure Checkout',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

/* ── ACCORDION ITEM ───────────────────────────────────────────────────────── */
const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-sand/70">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={open}
      >
        <span className="font-body text-[11px] tracking-[0.12em] uppercase text-charcoal/70 group-hover:text-charcoal transition-colors duration-200">
          {title}
        </span>
        <span
          className="text-charcoal/50 transition-transform duration-300 group-hover:text-charcoal"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ maxHeight: open ? '400px' : '0px' }}
      >
        <div className="pb-5 font-body text-[13px] leading-relaxed text-charcoal/60">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
  MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const MAIN_ID = '__main__' // sentinel for the base product slot

const ProductDetail = () => {
  const { productId } = useParams()
  const { handleGetProductById } = useProduct()
  const { handleAddItem } = useCart()
  const navigate = useNavigate()

  /* ── State ──────────────────────────────────────────────────────────────── */
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [quantity, setQuantity]       = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [zoomProps, setZoomProps]     = useState({ show: false, x: 0, y: 0 })
  /* MAIN_ID = base product selected (default); variant._id = variant selected */
  const [selectedId, setSelectedId]   = useState(MAIN_ID)
  /* null = no size chosen yet */
  const [selectedSize, setSelectedSize] = useState(null)

  /* ── Scroll to top on new product ──────────────────────────────────────── */
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [productId])

  const handleDoubleClick = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const clientX = e.clientX
    const clientY = e.clientY

    setZoomProps(prev => {
      if (prev.show) {
        return { show: false, x: 50, y: 50 }
      } else {
        const x = ((clientX - left) / width) * 100
        const y = ((clientY - top) / height) * 100
        return { show: true, x, y }
      }
    })
  }

  const handleMouseMove = (e) => {
    if (!zoomProps.show) return
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomProps(prev => ({ ...prev, x, y }))
  }
  const handleMouseLeave = () => setZoomProps({ show: false, x: 50, y: 50 })

  /* ── Fetch product ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!productId) return
    let active = true
    const run = async () => {
      setLoading(true)
      try {
        const data = await handleGetProductById(productId)
        if (active) {
          setProduct(data)
          setSelectedId(data?.variant?.[0]?._id || MAIN_ID)
          setSelectedSize(null)
          setActiveImage(0)
          setImageLoaded(false)
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
        if (active) setProduct(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [handleGetProductById, productId])

  /* ── All "slots": main product first, then each variant ─────────────────── */
  const slots = useMemo(() => {
    if (!product) return []
    const variantSlots = (product.variant ?? []).map((v) => ({
      id: v._id,
      label: v.attributes?.colorName ?? v.attributes?.color ?? 'Variant',
      coverUrl: (v.images?.length ? v.images[0].url : product.images?.[0]?.url) ?? '',
      images: v.images?.length ? v.images : product.images ?? [],
      price: v.price ?? product.price,
      sizes: v.attributes?.sizes ?? (v.attributes?.size ? [{label: v.attributes.size, stock: v.stock}] : []),
      color: v.attributes?.color ?? null,
      colorName: v.attributes?.colorName ?? null,
      stock: v.stock ?? null,
    }))

    // Fallback for older products created before variant auto-generation
    if (variantSlots.length === 0) {
      return [{
        id: MAIN_ID,
        label: 'Original',
        coverUrl: product.images?.[0]?.url ?? '',
        images: product.images ?? [],
        price: product.price,
        size: null,
        sizes: [],
        color: null,
        colorName: 'Original',
        stock: product.stock ?? null,
      }]
    }

    return variantSlots
  }, [product])

  /* ── Active slot ─────────────────────────────────────────────────────────── */
  const activeSlot = slots.find((s) => s.id === selectedId) ?? slots[0]
  const displayImages = activeSlot?.images ?? []
  const currentImage  = displayImages[activeImage]
  const activeSizes   = activeSlot?.sizes || []

  /* ── All Unique Sizes ────────────────────────────────────────────────────── */
  const allSizes = useMemo(() => {
    const baseSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    const sizeSet = new Set(baseSizes)
    slots.forEach(slot => {
      slot.sizes?.forEach(s => sizeSet.add(s.label))
    })
    
    // Sort logic to keep standard sizes in order, followed by custom ones
    const sizeOrder = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6 }
    return Array.from(sizeSet).sort((a, b) => {
      const orderA = sizeOrder[a] || 99
      const orderB = sizeOrder[b] || 99
      if (orderA !== orderB) return orderA - orderB
      return a.localeCompare(b)
    })
  }, [slots])

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const handleImageChange = useCallback((next) => {
    setImageLoaded(false)
    setActiveImage(typeof next === 'function' ? next : () => next)
  }, [])

  const handleSelectSlot = useCallback((id) => {
    if (id === selectedId) return
    setSelectedId(id)
    setActiveImage(0)
    setImageLoaded(false)
    // Clear selected size when switching slots (variants)
    setSelectedSize(null)
  }, [selectedId, slots])

  const handleSelectSize = useCallback((sizeLabel, inStock) => {
    if (!inStock) return // disabled
    setSelectedSize(sizeLabel)
  }, [])

  const formatPrice = useCallback((amount, currency) => {
    if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`
    return `${currency} ${amount.toLocaleString()}`
  }, [])

  const handleAddToCart = () => {
    setAddedToCart(true)
    handleAddItem({                                                    
      productId: product._id,
      variantId: activeSlot.id === MAIN_ID ? null : activeSlot.id,
      size: selectedSize || activeSlot.sizes?.[0]?.label || 'XS',
    })
    setTimeout(() => setAddedToCart(false), 2000)
  }

  /* ─────────────────────────────────────────────────────────────────────────
    LOADING SKELETON
  ───────────────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory pt-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="lg:w-[58%] flex gap-3">
              <div className="flex flex-col gap-2 w-[72px]">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-[90px] w-full" />)}
              </div>
              <Skeleton className="flex-1 aspect-[3/4]" />
            </div>
            <div className="lg:w-[42%] space-y-5 pt-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  /* ─────────────────────────────────────────────────────────────────────────
    RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-ivory">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 pt-17 pb-20">

        {/* ── Back Button ── */}
        <button
          id="btn-back"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 mb-5 text-charcoal/40 hover:text-charcoal transition-colors duration-200 group"
          aria-label="Go back"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"
            className="transition-transform duration-200 group-hover:-translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="font-body text-[10px] tracking-[0.1em] uppercase">Back</span>
        </button>

        {/* ── Breadcrumb ── */}
        <nav className="mb-8 animate-fade-in">
          <ol className="flex items-center gap-2">
            {['Home', 'Men', product.title].map((crumb, i, arr) => (
              <React.Fragment key={crumb}>
                <li>
                  <a
                    href={i < arr.length - 1 ? '#' : undefined}
                    className={`font-body text-[10px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                      i === arr.length - 1
                        ? 'text-charcoal pointer-events-none'
                        : 'text-charcoal/40 hover:text-charcoal'
                    }`}
                  >
                    {crumb}
                  </a>
                </li>
                {i < arr.length - 1 && <li className="text-charcoal/25 text-[10px]">/</li>}
              </React.Fragment>
            ))}
          </ol>
        </nav>

        {/* ── Two-Column Grid ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-24">

          {/* ══════════════════════════════════════════════════════
              LEFT — IMAGE GALLERY
          ══════════════════════════════════════════════════════ */}
          <section className="lg:w-[58%] animate-fade-in" aria-label="Product image gallery">
            <div className="flex items-start gap-3">

              {/* Vertical thumbnail strip */}
              <div className="hidden sm:flex flex-col gap-2.5 w-[68px] flex-shrink-0">
                {displayImages.map((img, idx) => (
                  <button
                    key={img._id || idx}
                    id={`thumbnail-${idx}`}
                    onClick={() => handleImageChange(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-full aspect-[3/4] overflow-hidden rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/40 ${
                      activeImage === idx
                        ? 'ring-[1.5px] ring-charcoal'
                        : 'ring-1 ring-sand/60 hover:ring-charcoal/40 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt || `Product view ${idx + 1}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" />
                    {activeImage === idx && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-charcoal" />
                    )}
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div 
                className={`flex-1 relative aspect-[3/4] max-h-[85vh] overflow-hidden rounded-sm bg-surface group ${zoomProps.show ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onDoubleClick={handleDoubleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    key={currentImage?.url}
                    src={currentImage?.url}
                    alt={currentImage?.alt || product.title}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover object-top ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: zoomProps.show ? 'scale(1.6)' : 'scale(1)',
                      transformOrigin: zoomProps.show ? `${zoomProps.x}% ${zoomProps.y}%` : 'center top',
                      transition: zoomProps.show ? 'none' : 'transform 0.4s ease-out, opacity 0.7s ease'
                    }}
                  />
                  {!imageLoaded && <div className="absolute inset-0 bg-surface animate-pulse" />}
                </div>

                {/* Mobile dot indicators */}
                <div className="flex sm:hidden justify-center gap-1.5 absolute bottom-4 left-0 right-0">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleImageChange(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        activeImage === idx ? 'w-4 h-1.5 bg-charcoal' : 'w-1.5 h-1.5 bg-charcoal/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-ivory/80 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                  <span className="font-body text-[10px] tracking-[0.1em] text-charcoal/60">
                    {String(activeImage + 1).padStart(2, '0')} / {String(displayImages.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Prev / Next */}
                <button id="img-prev"
                  onClick={() => handleImageChange((i) => Math.max(0, i - 1))}
                  disabled={activeImage === 0}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-ivory/85 backdrop-blur-sm rounded-sm text-charcoal/70 hover:text-charcoal hover:bg-ivory transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button id="img-next"
                  onClick={() => handleImageChange((i) => Math.min(displayImages.length - 1, i + 1))}
                  disabled={activeImage === displayImages.length - 1}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-ivory/85 backdrop-blur-sm rounded-sm text-charcoal/70 hover:text-charcoal hover:bg-ivory transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile thumbnail row */}
            <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto no-scrollbar">
              {displayImages.map((img, idx) => (
                <button
                  key={img._id || idx}
                  onClick={() => handleImageChange(idx)}
                  className={`flex-shrink-0 w-16 h-20 rounded-sm overflow-hidden transition-all duration-300 ${
                    activeImage === idx ? 'ring-[1.5px] ring-charcoal' : 'ring-1 ring-sand/60 opacity-60'
                  }`}
                >
                  <img src={img.url} alt={img.alt || `View ${idx + 1}`}
                    className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              RIGHT — PRODUCT INFORMATION
          ══════════════════════════════════════════════════════ */}
          <section className="lg:w-[42%] animate-slide-right delay-100" aria-label="Product information">

            {/* Title */}
            <h1 className="font-display text-[32px] md:text-[38px] lg:text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-charcoal mb-3 capitalize">
              {product.title}
            </h1>

            {/* Price — updates with selected slot */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-body text-[24px] font-medium text-charcoal tracking-tight transition-all duration-300">
                {activeSlot?.price
                  ? formatPrice(activeSlot.price.amount, activeSlot.price.currency)
                  : '—'}
              </span>
              <span className="font-body text-[11px] tracking-[0.1em] uppercase text-charcoal/40">
                Incl. of all taxes
              </span>
            </div>

            <div className="w-full h-px bg-sand mb-6" />

            {/* Description */}
            <p className="font-body text-[14px] leading-[1.8] text-charcoal/65 mb-7">
              {product.description}. Crafted from premium-grade denim with a refined slim silhouette.
              Tailored for the modern wardrobe — versatile enough for both elevated casual and smart-casual dressing.
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-4 gap-0 border border-sand/80 rounded-sm mb-8">
              {trustItems.map((item, idx) => (
                <div
                  key={item.label}
                  className={`flex flex-col items-center gap-2 py-4 px-2 text-center ${
                    idx < trustItems.length - 1 ? 'border-r border-sand/80' : ''
                  }`}
                >
                  <span className="text-charcoal/50">{item.icon}</span>
                  <span className="font-body text-[9px] tracking-[0.08em] uppercase text-charcoal/50 leading-tight">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* ════════════════════════════════════════════════════
                VARIANT SWITCHER — image thumbnail cards
            ════════════════════════════════════════════════════ */}
            {slots.length > 0 && (
              <div className="mb-7">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-[10px] tracking-[0.12em] uppercase text-charcoal/60">
                    Style
                    {activeSlot?.colorName && (
                      <> — <span className="text-charcoal font-medium">{activeSlot.colorName}</span></>
                    )}
                  </span>
                  {/* Stock pill */}
                  {activeSlot?.stock !== null && (
                    <span className={`font-body text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      activeSlot.stock > 10
                        ? 'bg-emerald-50 text-emerald-700'
                        : activeSlot.stock > 0
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        activeSlot.stock > 10 ? 'bg-emerald-400' : activeSlot.stock > 0 ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      {activeSlot.stock > 10 ? 'In Stock' : activeSlot.stock > 0 ? `${activeSlot.stock} left` : 'Sold Out'}
                    </span>
                  )}
                </div>

                {/* Image thumbnail cards */}
                <div className="flex gap-2.5 flex-wrap">
                  {slots.map((slot) => {
                    const isActive = selectedId === slot.id
                    return (
                      <button
                        key={slot.id}
                        id={`slot-${slot.id}`}
                        onClick={() => handleSelectSlot(slot.id)}
                        aria-pressed={isActive}
                        aria-label={`Switch to ${slot.label}`}
                        title={slot.label}
                        className={`
                          relative w-[72px] aspect-[3/4] rounded-md overflow-hidden flex-shrink-0
                          transition-all duration-250 focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-charcoal/50
                          ${isActive
                            ? 'ring-[2px] ring-charcoal shadow-md scale-[1.04]'
                            : 'ring-1 ring-sand/70 opacity-70 hover:opacity-100 hover:ring-charcoal/30 hover:scale-[1.02]'
                          }
                        `}
                      >
                        {/* Cover image */}
                        <img
                          src={slot.coverUrl}
                          alt={slot.label}
                          className="w-full h-full object-cover object-top"
                        />

                        {/* Color dot for variant slots */}
                        {slot.color && (
                          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full border border-white/70 shadow-sm"
                            style={{ background: slot.color }} />
                        )}

                        {/* Active check overlay */}
                        {isActive && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-charcoal/80 backdrop-blur-sm flex items-center justify-center">
                            <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════
                SIZE SELECTOR
            ════════════════════════════════════════════════════ */}
            {allSizes.length > 0 && (
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-body text-[10px] tracking-[0.12em] uppercase text-charcoal/60">
                    Size
                    {selectedSize && (
                      <> — <span className="text-charcoal font-medium">{selectedSize}</span></>
                    )}
                  </span>
                  <button className="font-body text-[10px] tracking-[0.08em] uppercase text-charcoal/40 hover:text-terracotta underline underline-offset-2 transition-colors duration-200">
                    Size Guide
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {allSizes.map((size) => {
                    const activeSizeObj = activeSizes.find(s => s.label === size)
                    const inStock = activeSizeObj ? (activeSizeObj.stock ?? 0) > 0 : false
                    const isSelected = selectedSize === size
                    return (
                      <button
                        key={size}
                        id={`size-${size}`}
                        onClick={() => handleSelectSize(size, inStock)}
                        disabled={!inStock}
                        aria-pressed={isSelected}
                        aria-label={`Size ${size}${!inStock ? ' — sold out' : ''}`}
                        title={!inStock ? 'Sold out' : size}
                        className={`
                          relative w-11 h-11 rounded-sm font-body text-[12px] font-medium tracking-wide
                          transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
                          focus-visible:ring-charcoal/40 overflow-hidden select-none
                          ${
                            !inStock
                              ? 'bg-transparent text-charcoal/25 ring-1 ring-sand/40 cursor-not-allowed'
                              : isSelected
                              ? 'bg-charcoal text-white ring-0 shadow-sm'
                              : 'bg-transparent text-charcoal/70 ring-1 ring-sand hover:ring-charcoal/50 hover:text-charcoal cursor-pointer'
                          }
                        `}
                      >
                        {size}
                        {/* Diagonal strikethrough for sold-out sizes */}
                        {!inStock && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none"
                          >
                            <svg width="100%" height="100%" viewBox="0 0 44 44" preserveAspectRatio="none">
                              <line
                                x1="2" y1="42" x2="42" y2="2"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                className="text-charcoal/20"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Quantity Selector ── */}
            <div className="mb-8">
              <span className="font-body text-[10px] tracking-[0.12em] uppercase text-charcoal/60 block mb-3">
                Quantity
              </span>
              <div className="flex items-center ring-1 ring-sand rounded-sm w-fit">
                <button id="qty-decrease"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-surface transition-all duration-150 rounded-l-sm"
                  aria-label="Decrease quantity"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M5 12h14" />
                  </svg>
                </button>
                <span className="w-10 h-10 flex items-center justify-center font-body text-[13px] font-medium text-charcoal border-x border-sand">
                  {quantity}
                </span>
                <button id="qty-increase"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-surface transition-all duration-150 rounded-r-sm"
                  aria-label="Increase quantity"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                id="btn-add-to-cart"
                onClick={handleAddToCart}
                className="w-full h-[52px] rounded-sm ring-[1.5px] ring-charcoal bg-transparent font-body text-[11px] font-medium tracking-[0.14em] uppercase text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/60"
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Added to Cart
                  </span>
                ) : 'Add to Cart'}
              </button>
              <button
                id="btn-buy-now"
                className="w-full h-[52px] rounded-sm bg-terracotta font-body text-[11px] font-medium tracking-[0.14em] uppercase text-white hover:bg-terracotta-dark transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/60 active:scale-[0.99]"
              >
                Buy Now
              </button>
            </div>

            {/* ── Wishlist / Share ── */}
            <div className="flex items-center gap-5 mb-10">
              <button className="flex items-center gap-2 text-charcoal/50 hover:text-charcoal transition-colors duration-200 group">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                  className="group-hover:fill-terracotta group-hover:stroke-terracotta transition-all duration-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="font-body text-[10px] tracking-[0.1em] uppercase">Wishlist</span>
              </button>
              <div className="w-px h-4 bg-sand" />
              <button className="flex items-center gap-2 text-charcoal/50 hover:text-charcoal transition-colors duration-200">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z" />
                </svg>
                <span className="font-body text-[10px] tracking-[0.1em] uppercase">Share</span>
              </button>
            </div>

            {/* ── Accordion ── */}
            <div className="border-b border-sand/70">
              <AccordionItem title="Product Details">
                <p className="mb-2">
                  Slim-fit silhouette with a mid-rise waist. Constructed from a premium 98% cotton, 2% elastane blend for comfort and shape retention.
                </p>
                <ul className="space-y-1 list-none">
                  {['Slim fit', 'Mid-rise waist', 'Five-pocket design', '5-button fly closure', 'Machine washable'].map((d) => (
                    <li key={d} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-charcoal/30 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem title="Size &amp; Fit">
                <p>This style runs true to size. Model is 6&apos;1&quot; (185cm) and is wearing size 32. For a relaxed fit, we recommend sizing up one.</p>
              </AccordionItem>

              <AccordionItem title="Care Instructions">
                <ul className="space-y-1">
                  {['Machine wash cold (30°C)', 'Do not bleach', 'Tumble dry low', 'Warm iron if needed', 'Do not dry clean'].map((c) => (
                    <li key={c} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-charcoal/30 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem title="Shipping &amp; Returns">
                <p className="mb-2">
                  <strong className="font-medium text-charcoal/80">Free standard shipping</strong> on all orders. Estimated delivery in 3–5 business days.
                </p>
                <p>Easy 30-day returns on all full-price items. Items must be unworn, unwashed, and in original packaging.</p>
              </AccordionItem>
            </div>

          </section>
        </div>
      </main>
    </div>
  )
}

export default ProductDetail
