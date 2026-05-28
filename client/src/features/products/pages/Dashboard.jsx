import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { useSelector } from 'react-redux'

/* ── Google Fonts ─────────────────────────────────── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@700;800&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');
  `}</style>
)

/* ── Theme Toggle Button ──────────────────────────── */
const ThemeToggle = ({ dark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    className={`fixed top-5 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center
      shadow-lg transition-all duration-200 hover:scale-110 active:scale-95
      ${dark
        ? 'bg-[#2A2A2A] hover:bg-[#333] text-yellow-300 border border-[#3A3A3A]'
        : 'bg-white hover:bg-[#F5F2EE] text-[#57423B] border border-[#DDD8D3] shadow-[0_2px_10px_rgba(0,0,0,0.08)]'
      }`}
    aria-label="Toggle theme"
  >
    {dark ? (
      /* Sun icon */
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" strokeWidth={2} strokeLinecap="round" />
        <path strokeWidth={2} strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ) : (
      /* Moon icon */
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    )}
  </button>
)

/* ── Formatter ────────────────────────────────────── */
const formatPrice = (amount, currency) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  const d = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }).format(d)
}

/* ── Main Dashboard ───────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate()
  const { handleGetSellerProducts } = useProduct()
  const sellerProducts = useSelector(state => state.product.sellerProducts) || []

  const [dark, setDark] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        await handleGetSellerProducts()
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, []) // eslint-disable-line

  /* ── theme tokens ── */
  const T = {
    pageBg:    dark ? 'bg-[#111111]'   : 'bg-[#EFEDE9]',
    cardBg:    dark ? 'bg-[#1C1C1C]'   : 'bg-white',
    headText:  dark ? 'text-[#F0F0F0]' : 'text-[#1A1A1A]',
    subText:   dark ? 'text-[#888]'    : 'text-[#57423B]',
    cardShadow: dark
      ? 'shadow-[0_4px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_50px_rgba(232,112,64,0.15)]'
      : 'shadow-[0_4px_24px_rgba(139,114,105,0.10)] hover:shadow-[0_8px_30px_rgba(232,112,64,0.2)]',
    cardBorder: dark ? 'border border-[#2E2E2E]' : 'border border-[#EDEAE5]',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.pageBg} px-6 py-8 sm:px-10`}>
      <Fonts />

      {/* ── Theme toggle — fixed top-right ── */}
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />

      {/* Header section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
        <div>
          <h1
            className={`text-[40px] sm:text-[48px] font-extrabold leading-none tracking-tight ${T.headText}`}
            style={{ fontFamily: 'Epilogue, sans-serif' }}
          >
            Dashboard
          </h1>
          <p className={`mt-2 text-[14px] ${T.subText}`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Manage your uploaded products and inventory.
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => navigate('/seller/createproduct')}
          style={{ fontFamily: 'Epilogue, sans-serif' }}
          className={`flex-shrink-0 px-6 py-3.5 rounded-xl text-[14px] font-bold text-white transition-all duration-200
            bg-[#E87040] hover:bg-[#D0612C] hover:shadow-[0_6px_20px_rgba(232,112,64,0.35)] active:scale-[0.98]
            flex items-center gap-2`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          /* Loading skeleton grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`${T.cardBg} ${T.cardBorder} rounded-3xl overflow-hidden animate-pulse flex flex-col h-[380px]`}>
                <div className={`h-[240px] w-full ${dark ? 'bg-[#2A2A2A]' : 'bg-[#E5E1DB]'}`}></div>
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className={`h-5 w-3/4 rounded ${dark ? 'bg-[#333]' : 'bg-[#DCD8D3]'}`}></div>
                  <div className={`h-4 w-1/2 rounded ${dark ? 'bg-[#333]' : 'bg-[#DCD8D3]'}`}></div>
                  <div className="mt-auto flex justify-between">
                    <div className={`h-5 w-1/3 rounded ${dark ? 'bg-[#333]' : 'bg-[#DCD8D3]'}`}></div>
                    <div className={`h-4 w-1/4 rounded ${dark ? 'bg-[#333]' : 'bg-[#DCD8D3]'}`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sellerProducts.length === 0 ? (
          /* Empty state */
          <div className={`${T.cardBg} ${T.cardBorder} rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]`}>
            <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${dark ? 'bg-[#2A2A2A] text-[#555]' : 'bg-[#F5F2EE] text-[#C2B9B3]'}`}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className={`text-[20px] font-bold mb-2 ${T.headText}`} style={{ fontFamily: 'Epilogue, sans-serif' }}>
              No products found
            </h3>
            <p className={`text-[14px] max-w-md ${T.subText}`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              You haven't uploaded any products yet. Click "Add New Product" to start building your catalog.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellerProducts.map(product => (
              <div 
                key={product._id} 
                className={`${T.cardBg} ${T.cardBorder} ${T.cardShadow} rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 group`}
              >
                {/* Image container */}
                <div className="relative h-[280px] w-full overflow-hidden bg-[#E5E1DB]">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.images[0].alt || product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9A8880]">
                      <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Image count badge */}
                  {product.images && product.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {product.images.length}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title & Price Row */}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 
                      className={`text-[18px] font-bold leading-tight line-clamp-2 ${T.headText}`} 
                      style={{ fontFamily: 'Epilogue, sans-serif' }}
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                    <div 
                      className="text-[#E87040] font-bold text-[16px] whitespace-nowrap"
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    >
                      {formatPrice(product.price?.amount, product.price?.currency)}
                    </div>
                  </div>

                  {/* Description */}
                  <p 
                    className={`text-[13px] line-clamp-2 mb-4 ${dark ? 'text-[#888]' : 'text-[#666]'}`} 
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >
                    {product.description}
                  </p>

                  {/* Footer */}
                  <div className={`mt-auto pt-4 border-t ${dark ? 'border-[#333]' : 'border-[#F5F2EE]'} flex justify-between items-center`}>
                    <span 
                      className={`text-[11px] uppercase tracking-wider font-semibold ${dark ? 'text-[#555]' : 'text-[#A39A96]'}`}
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                    >
                      Added {formatDate(product.createdAt)}
                    </span>
                    
                    {/* Quick Action (Optional e.g. edit) */}
                    <button 
                      className={`p-2 rounded-lg transition-colors duration-200 ${dark ? 'hover:bg-[#2A2A2A] text-[#888] hover:text-[#E87040]' : 'hover:bg-[#F5F2EE] text-[#A39A96] hover:text-[#E87040]'}`}
                      aria-label="Edit Product"
                      title="Edit Product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}