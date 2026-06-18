import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct.js'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

/* ─── Intersection Observer Hook ─── */
const useInView = (options = {}) => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.15, ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

const Section = ({ children, className = '', id }) => {
  const [ref, inView] = useInView()
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </section>
  )
}

/* ─── Offset Icon Component ─── */
const OffsetIcon = ({ children }) => (
  <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 ease-out">
    {/* Colored Fill Layer (offset) */}
    <svg 
      viewBox="0 0 24 24" 
      className="absolute inset-0 w-full h-full text-[#F1A290] translate-x-1.5 translate-y-1.5 opacity-70 transition-transform duration-500 group-hover:translate-x-2.5 group-hover:translate-y-2.5"
      fill="currentColor"
      stroke="none"
    >
      {children}
    </svg>
    {/* Charcoal Outline Layer */}
    <svg 
      viewBox="0 0 24 24" 
      className="absolute inset-0 w-full h-full text-charcoal"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  </div>
)

/* ─── CATEGORY DATA ─── */
const categories = [
  { name: 'Shirts', icon: <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" /> },
  { name: 'T-Shirts', icon: <path d="M20 5l-4-3H8L4 5l-2 6h3v10h14V11h3l-2-6z" /> },
  { name: 'Jeans', icon: <path d="M6 3h12l2 4-3 15h-4l-1-9-1 9H7L4 7l2-4z" /> },
  { name: 'Oversized', icon: <><path d="M22 8l-5-4H7L2 8l-1 7h5v7h12v-7h5l-1-7z" /><path d="M9 4v3a3 3 0 006 0V4" /></> },
  { name: 'Jackets', icon: <><path d="M19 5l-3-3H8L5 5l-3 7h3v10h14V12h3l-3-7z" /><path d="M12 5v17" /><path d="M8 5l4 4 4-4" /></> },
  { name: 'New Arrivals', icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
]

/* ─── JOURNAL DATA ─── */
const journalPosts = [
  { label: 'Trends', title: 'Summer Essentials: The Modern Man\'s Guide', img: '/images/journal-trends.png', date: 'May 28, 2025' },
  { label: 'Style Tips', title: 'Mastering Minimalist Dressing in 5 Steps', img: '/images/journal-styletips.png', date: 'May 22, 2025' },
  { label: 'Seasonal Picks', title: 'Curated: The Fall Capsule Wardrobe', img: '/images/journal-seasonal.png', date: 'May 15, 2025' },
]

/* ─── BRAND VALUES ─── */
const brandValues = [
  { title: 'Free Shipping', desc: 'Complimentary delivery on orders above ₹999', icon: <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 18h2a2 2 0 0 0 2-2v-2.5M15 6h6l3 4v4M5.5 18a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0zM12.5 18a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z" /> },
  { title: 'Secure Payments', desc: 'SSL encrypted transactions for your safety', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" /> },
  { title: 'Easy Returns', desc: 'Hassle-free 30-day return & exchange policy', icon: <path d="M3 12h4l3-9 4 18 3-9h4" /> },
  { title: 'Premium Quality', desc: 'Crafted with the finest fabrics & attention to detail', icon: <path d="M12 2 L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" /> },
]

/* ═══════════════════════════════════════════ */
/*               HOME COMPONENT                */
/* ═══════════════════════════════════════════ */
const Home = () => {
  const products = useSelector(state => state.product.products)
  const { handleGetAllProducts } = useProduct()
  const location = useLocation()
  
  const query = new URLSearchParams(location.search)
  const initialCategory = query.get('category')

  const [email, setEmail] = useState('')
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null)

  useEffect(() => {
    handleGetAllProducts()
    setTimeout(() => setHeroLoaded(true), 100)
  }, [])

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory)
      const el = document.getElementById('product-display')
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 80
        setTimeout(() => window.scrollTo({ top: y, behavior: 'smooth' }), 300)
      }
    }
  }, [initialCategory])

  const bestSellers = products?.slice(0, 8) || []
  const trending = products?.slice(0, 6) || []

  const handleCategoryClick = (e, catName) => {
    e.preventDefault()
    setSelectedCategory(catName)
    if (catName) {
      window.history.pushState({}, '', `/?category=${encodeURIComponent(catName)}`)
    } else {
      window.history.pushState({}, '', '/')
    }
    const el = document.getElementById('product-display')
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const displayedProducts = selectedCategory
    ? products?.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase() || 
        p.title?.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    : bestSellers

  useEffect(() => {
    if (selectedCategory && products && products.length > 0) {
      if (displayedProducts && displayedProducts.length === 0) {
        const timer = setTimeout(() => {
          setSelectedCategory(null)
          window.history.replaceState({}, '', '/')
        }, 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [selectedCategory, products, displayedProducts])

  return (
    <div className="bg-ivory min-h-screen overflow-x-hidden">

      {/* ═══ 1. HERO SECTION ═══ */}
      <section id="hero" className="relative h-[65vh] min-h-[500px] w-full flex items-center overflow-hidden bg-ivory">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-[20s] ease-linear hover:scale-105" 
            style={{ backgroundImage: "url('/images/hero-half.png')" }}
          ></div>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
        <div className="relative z-10 px-6 md:px-12 lg:px-[64px] max-w-[1440px] mx-auto w-full">
          <div className={`max-w-2xl transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-body text-[12px] uppercase tracking-[0.3em] mb-6 text-charcoal/80 font-semibold">Collection 2025</p>
            <h1 className="font-display text-[48px] md:text-[64px] lg:text-[84px] text-charcoal leading-[1.05] tracking-[-0.02em] mb-8 font-light">
              The Architecture of <br/><span className="italic text-terracotta">Modern Style</span>
            </h1>
            <div className="flex flex-wrap gap-6">
              <a href="#best-sellers" className="px-10 py-4 bg-charcoal text-ivory font-body text-[12px] font-semibold uppercase tracking-widest hover:bg-terracotta transition-colors duration-500 rounded-[2px]">Shop Men</a>
              <a href="#categories" className="px-10 py-4 border border-charcoal text-charcoal font-body text-[12px] font-semibold uppercase tracking-widest hover:bg-charcoal hover:text-ivory transition-all duration-500 rounded-[2px]">Shop Women</a>
            </div>
          </div>
        </div>
        <div className={`absolute bottom-8 left-6 md:left-12 lg:left-[64px] transition-all duration-1000 delay-500 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-4 text-charcoal">
            <span className="w-12 h-[1px] bg-charcoal/60"></span>
            <span className="font-body text-[10px] font-semibold tracking-widest uppercase">SCROLL TO DISCOVER</span>
          </div>
        </div>
      </section>

      {/* ═══ 2. FEATURED CATEGORIES ═══ */}
      <Section id="categories" className="py-10 md:py-12 border-b border-sand/30 bg-ivory">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-[64px]">
          <div className="text-center mb-8 md:mb-10">
            <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">Explore</p>
            <h2 className="font-display text-[28px] md:text-[36px] font-light text-charcoal">Shop By Category</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-6 md:gap-8 justify-center max-w-5xl mx-auto">
            <a 
              href="#" 
              onClick={(e) => handleCategoryClick(e, null)} 
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              <OffsetIcon>
                <path d="M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z" />
              </OffsetIcon>
              <p className={`font-body text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors ${!selectedCategory ? 'text-terracotta' : 'text-charcoal/60 group-hover:text-charcoal'}`}>
                All Products
              </p>
            </a>
            {categories.map((cat, i) => (
              <a
                key={cat.name}
                href="#"
                onClick={(e) => handleCategoryClick(e, cat.name)}
                className="group flex flex-col items-center text-center cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <OffsetIcon>
                  {cat.icon}
                </OffsetIcon>
                <p className={`font-body text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors ${selectedCategory && selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-terracotta' : 'text-charcoal/60 group-hover:text-charcoal'}`}>
                  {cat.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 3. PRODUCTS DISPLAY ═══ */}
      <Section id="product-display" className="py-10 md:py-12 lg:py-16 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">
                {selectedCategory ? 'Filtered Selection' : 'Curated For You'}
              </p>
              <h2 className="font-display text-[28px] md:text-[36px] font-light text-charcoal">
                {selectedCategory ? `${selectedCategory} Collection` : 'Best Sellers'}
              </h2>
            </div>
            {selectedCategory ? (
               <button onClick={() => { setSelectedCategory(null); window.history.pushState({}, '', '/'); }} className="hidden md:flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
                 Clear Filter ✕
               </button>
            ) : (
               <a href="#" className="hidden md:flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
                 View All
                 <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
               </a>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products && products.length > 0 ? (
              displayedProducts?.length > 0 ? (
                displayedProducts.map((p, i) => <ProductCard key={p._id || i} product={p} index={i} />)
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center animate-fade-in transition-all duration-500">
                  <p className="font-body text-[11px] uppercase tracking-[0.2em] text-terracotta font-semibold mb-4">No Matches Found</p>
                  <h3 className="font-display text-[28px] md:text-[32px] font-light text-charcoal mb-4">We couldn't find items in this category.</h3>
                  <p className="text-muted text-[13px] md:text-[14px] max-w-md">Showing all products in just a moment...</p>
                </div>
              )
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-[3px] bg-sand/40 mb-4" />
                  <div className="h-3 bg-sand/40 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-sand/40 rounded w-1/2" />
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      {/* ═══ 4. COLLECTION BANNER ═══ */}
      <Section id="collection-banner" className="py-0">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src="/images/collection-banner.png"
            alt="SNITCH Collection - Minimal Timeless Essential"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-softblack/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="font-body text-[11px] tracking-[0.25em] uppercase text-white/60 font-medium mb-5">The Essentials Edit</p>
            <h2 className="font-display text-[36px] md:text-[52px] lg:text-[64px] font-light text-white leading-[1.1] tracking-[-0.01em]">
              Minimal. <span className="italic">Timeless.</span> Essential.
            </h2>
            <p className="font-body text-[15px] md:text-[17px] text-white/60 mt-5 max-w-[480px] leading-relaxed">
              Discover pieces designed to transcend seasons and trends.
            </p>
            <a href="#" className="mt-9 inline-flex items-center gap-2 px-9 py-4 bg-terracotta text-white text-[12px] font-semibold tracking-[0.1em] uppercase rounded-[3px] hover:bg-terracotta-dark transition-all duration-300 hover:-translate-y-0.5">
              Shop Collection
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </Section>

      {/* ═══ 5. TRENDING PRODUCTS ═══ */}
      <Section id="trending" className="py-12 md:py-16 lg:py-20 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">What's Hot</p>
              <h2 className="font-display text-[28px] md:text-[36px] font-light text-charcoal">Trending Now</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
              See All
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
            {trending.length > 0
              ? trending.map((p, i) => (
                <div key={p._id || i} className="min-w-[260px] md:min-w-0">
                  <ProductCard product={p} index={i} />
                </div>
              ))
              : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[260px] md:min-w-0 animate-pulse">
                  <div className="aspect-[3/4] rounded-[3px] bg-sand/40 mb-4" />
                  <div className="h-3 bg-sand/40 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-sand/40 rounded w-1/2" />
                </div>
              ))
            }
          </div>
        </div>
      </Section>

      {/* ═══ 6. BRAND VALUES ═══ */}
      <Section id="brand-values" className="py-12 md:py-16 bg-surface">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {brandValues.map((val) => (
              <div
                key={val.title}
                className="group bg-ivory rounded-[3px] p-8 md:p-10 text-center hover:shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-terracotta/8 flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-all duration-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">{val.icon}</svg>
                </div>
                <h3 className="font-body text-[14px] font-semibold text-charcoal tracking-wide mb-2">{val.title}</h3>
                <p className="text-[13px] text-muted leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 7. STYLE JOURNAL ═══ */}
      <Section id="style-journal" className="py-12 md:py-16 lg:py-20 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">Editorials</p>
              <h2 className="font-display text-[28px] md:text-[36px] font-light text-charcoal">The Style Journal</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-[10px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
              Read More
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {journalPosts.map((post) => (
              <a
                key={post.title}
                href="#"
                className="group block"
              >
                <div className="relative rounded-[3px] overflow-hidden aspect-[4/3] mb-5">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/85 backdrop-blur-sm rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase text-terracotta">
                      {post.label}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted tracking-wide mb-2">{post.date}</p>
                <h3 className="font-display text-[20px] md:text-[22px] font-normal text-charcoal leading-snug group-hover:text-terracotta transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[13px] text-muted mt-2 flex items-center gap-1 group-hover:text-charcoal transition-colors">
                  Read Article
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 8. NEWSLETTER ═══ */}
      <Section id="newsletter" className="py-16 md:py-20 bg-cream">
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-4">Newsletter</p>
          <h2 className="font-display text-[28px] md:text-[36px] font-light text-charcoal leading-tight">
            Stay In <span className="italic">Style</span>
          </h2>
          <p className="font-body text-[15px] md:text-[16px] text-muted mt-4 mb-10 leading-relaxed max-w-[460px] mx-auto">
            Be the first to know about new collections, exclusive offers, and the latest from SNITCH.
          </p>
          <form
            onSubmit={e => { e.preventDefault(); setEmail(''); alert('Subscribed!') }}
            className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-4 bg-white border border-sand rounded-[3px] text-[14px] text-charcoal placeholder:text-muted/60 focus:outline-none focus:border-terracotta/40 focus:ring-1 focus:ring-terracotta/20 transition-all"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-terracotta text-white text-[12px] font-semibold tracking-[0.1em] uppercase rounded-[3px] hover:bg-terracotta-dark transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[11px] text-muted/60 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

export default Home
