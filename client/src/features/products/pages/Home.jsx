import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
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

/* ─── CATEGORY DATA ─── */
const categories = [
  { name: 'Shirts', img: '/images/cat-shirts.png' },
  { name: 'T-Shirts', img: '/images/cat-tshirts.png' },
  { name: 'Jeans', img: '/images/cat-jeans.png' },
  { name: 'Oversized', img: '/images/cat-oversized.png' },
  { name: 'Jackets', img: '/images/cat-jackets.png' },
  { name: 'New Arrivals', img: '/images/cat-newarrivals.png' },
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
  const [email, setEmail] = useState('')
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    handleGetAllProducts()
    setTimeout(() => setHeroLoaded(true), 100)
  }, [])

  const bestSellers = products?.slice(0, 8) || []
  const trending = products?.slice(0, 6) || []

  return (
    <div className="bg-ivory min-h-screen overflow-x-hidden">

      {/* ═══ 1. HERO SECTION ═══ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 bg-ivory overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[80vh]">
            {/* Left - Image */}
            <div className={`relative transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative rounded-[3px] overflow-hidden aspect-[3/4] max-h-[75vh] mx-auto lg:mx-0 max-w-[520px]">
                <img
                  src="/images/hero-model.png"
                  alt="SNITCH Fashion - Modern streetwear model"
                  className="w-full h-full object-cover"
                />
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md rounded-[3px] px-5 py-3">
                  <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-terracotta">New Season</p>
                  <p className="text-[13px] font-medium text-charcoal mt-0.5">Summer '25 Collection</p>
                </div>
              </div>
            </div>

            {/* Right - Copy */}
            <div className={`flex flex-col justify-center lg:pl-12 xl:pl-20 transition-all duration-1000 delay-300 ${heroLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <p className="font-body text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-6">
                Premium Menswear
              </p>
              <h1 className="font-display text-[40px] md:text-[56px] lg:text-[64px] font-light leading-[1.08] tracking-[-0.02em] text-charcoal">
                Designed For<br />
                <span className="italic">Modern</span>{' '}
                <span className="text-terracotta">Confidence</span>
              </h1>
              <p className="font-body text-[16px] md:text-[18px] text-muted leading-relaxed mt-6 max-w-[420px]">
                Premium fashion crafted for everyday elegance. Where minimalism meets modern sophistication.
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                <a href="#best-sellers" className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white text-[12px] font-semibold tracking-[0.1em] uppercase rounded-[3px] hover:bg-terracotta-dark transition-all duration-300 hover:-translate-y-0.5">
                  Shop Collection
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <a href="#categories" className="inline-flex items-center gap-2 px-8 py-4 border border-charcoal/20 text-charcoal text-[12px] font-semibold tracking-[0.1em] uppercase rounded-[3px] hover:border-charcoal/50 hover:bg-charcoal/5 transition-all duration-300">
                  Explore New Arrivals
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-10 mt-14 pt-8 border-t border-sand/60">
                {[['50K+', 'Happy Customers'], ['200+', 'Premium Styles'], ['4.8★', 'Average Rating']].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-display text-[24px] font-light text-charcoal">{num}</p>
                    <p className="text-[11px] tracking-[0.05em] text-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. FEATURED CATEGORIES ═══ */}
      <Section id="categories" className="py-20 md:py-28 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-14 md:mb-18">
            <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">Explore</p>
            <h2 className="font-display text-[32px] md:text-[42px] font-light text-charcoal">Shop By Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <a
                key={cat.name}
                href="#"
                className="group relative rounded-[3px] overflow-hidden aspect-[4/5] cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-softblack/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-body text-[13px] md:text-[15px] font-medium text-white tracking-[0.05em]">{cat.name}</p>
                  <p className="text-[11px] text-white/60 mt-1 tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ 3. BEST SELLERS ═══ */}
      <Section id="best-sellers" className="py-20 md:py-28 lg:py-32 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">Curated For You</p>
              <h2 className="font-display text-[32px] md:text-[42px] font-light text-charcoal">Best Sellers</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
              View All
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bestSellers.length > 0
              ? bestSellers.map((p, i) => <ProductCard key={p._id || i} product={p} index={i} />)
              : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] rounded-[3px] bg-sand/40 mb-4" />
                  <div className="h-3 bg-sand/40 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-sand/40 rounded w-1/2" />
                </div>
              ))
            }
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
      <Section id="trending" className="py-20 md:py-28 lg:py-32 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">What's Hot</p>
              <h2 className="font-display text-[32px] md:text-[42px] font-light text-charcoal">Trending Now</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
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
      <Section id="brand-values" className="py-20 md:py-24 bg-surface">
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
      <Section id="style-journal" className="py-20 md:py-28 lg:py-32 bg-ivory">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-3">Editorials</p>
              <h2 className="font-display text-[32px] md:text-[42px] font-light text-charcoal">The Style Journal</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-[12px] font-semibold tracking-[0.1em] uppercase text-charcoal/70 hover:text-terracotta transition-colors">
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
      <Section id="newsletter" className="py-20 md:py-28 lg:py-32 bg-cream">
        <div className="max-w-[680px] mx-auto px-6 text-center">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-4">Newsletter</p>
          <h2 className="font-display text-[32px] md:text-[46px] font-light text-charcoal leading-tight">
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
