import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'

/* ── Google Fonts ─────────────────────────────────── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@700;800&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');
  `}</style>
)

/* ── Theme-aware field label ──────────────────────── */
const FL = ({ htmlFor, orange, dark, children }) => (
  <label
    htmlFor={htmlFor}
    className={`block mb-2 text-[10.5px] font-semibold tracking-[0.13em] uppercase
      ${orange ? 'text-[#E87040]' : dark ? 'text-[#888]' : 'text-[#9A8880]'}`}
    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
  >
    {children}
  </label>
)

/* ── Theme-aware beige/dark input ─────────────────── */
const BI = ({ id, type = 'text', value, onChange, placeholder, className = '', error, dark, ...rest }) => (
  <>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      className={`w-full px-4 py-3.5 rounded-xl text-[15px] outline-none transition-all duration-200
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        ${dark
          ? 'bg-[#2A2A2A] text-[#F0F0F0] placeholder:text-[#555] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]'
          : 'bg-[#EDEAE5] text-[#1A1A1A] placeholder:text-[#C2B9B3] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'
        }
        ${error ? 'ring-2 ring-red-400/50' : ''} ${className}`}
    />
    {error && (
      <p className="mt-1 text-[11.5px] text-red-500" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>{error}</p>
    )}
  </>
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

/* ── ImageUploader ────────────────────────────────── */
const ImageUploader = ({ images, onAdd, onRemove, error, dark }) => {
  const ref = useRef(null)
  const [drag, setDrag] = useState(false)

  const addFiles = useCallback((files) => {
    const slots = 7 - images.length
    if (slots <= 0) return
    const valid = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, slots)
    onAdd(valid.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`
    })))
  }, [images.length, onAdd])

  return (
    <div>
      <FL dark={dark}>Product Imagery</FL>

      {/* Drop zone */}
      <div
        onClick={() => ref.current?.click()}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        className={`flex flex-col items-center justify-center gap-2 py-8 px-5 rounded-2xl cursor-pointer
          border-2 border-dashed transition-all duration-200
          ${drag
            ? 'border-[#E87040] bg-[#E87040]/10'
            : error
              ? 'border-red-400/50 bg-red-500/5'
              : dark
                ? 'border-[#E87040]/40 bg-[#1E1E1E] hover:border-[#E87040]/70 hover:bg-[#222]'
                : 'border-[#E87040]/60 bg-white hover:bg-[#FFF9F6] hover:border-[#E87040]/80'
          }`}
      >
        {/* Cloud upload icon */}
        <svg className="w-10 h-10 text-[#E87040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v5m-2-2.5L12 16l2-2.5" />
        </svg>

        <p
          className={`text-[14px] font-medium text-center leading-snug
            ${dark ? 'text-[#DADADA]' : 'text-[#1A1A1A]'}`}
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          {drag ? 'Release to upload' : 'Drag & drop images here or click to browse'}
        </p>
        <p
          className={`text-[12px] ${dark ? 'text-[#666]' : 'text-[#9A8880]'}`}
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          Up to 7 high-resolution images. JPEG, PNG.
        </p>

        <input ref={ref} type="file" accept="image/*" multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
      </div>

      {error && <p className="mt-1 text-[11.5px] text-red-500">{error}</p>}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-4 flex gap-3 flex-wrap">
          {images.map(img => (
            <div key={img.id}
              className={`relative w-[100px] h-[100px] rounded-2xl overflow-hidden flex-shrink-0
                ${dark ? 'ring-1 ring-[#333]' : ''}`}
            >
              <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onRemove(img.id) }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center
                  shadow hover:bg-white hover:scale-110 transition-transform duration-150"
                aria-label="Remove"
              >
                <svg className="w-2.5 h-2.5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main Page ────────────────────────────────────── */

export default function CreateProduct() {
  const navigate = useNavigate()
  const { handleCreateProduct } = useProduct()

  const [dark, setDark]           = useState(true)
  const [title, setTitle]         = useState('')
  const [desc, setDesc]           = useState('')
  const [amount, setAmount]       = useState('')
  const [currency, setCurrency]   = useState('INR')
  const [images, setImages]       = useState([])
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState({})
  const [success, setSuccess]     = useState('')

  const MAX = 1000
  const clr = (key) => errors[key] && setErrors(p => ({ ...p, [key]: '' }))

  const validate = () => {
    const e = {}
    if (!title.trim())                            e.title  = 'Title is required.'
    else if (title.trim().length < 3)              e.title  = 'Title must be at least 3 characters.'
    if (!desc.trim())                              e.desc   = 'Description is required.'
    else if (desc.trim().length < 10)              e.desc   = 'Description must be at least 10 characters.'
    else if (desc.length > MAX)                    e.desc   = `Max ${MAX} characters.`
    if (!amount || isNaN(amount) || +amount <= 0)  e.amount = 'Enter a valid price.'
    if (!images.length)                            e.images = 'Add at least one image.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('description', desc.trim())
      fd.append('priceAmount', amount)
      fd.append('priceCurrency', currency)
      images.forEach(img => fd.append('images', img.file))
      await handleCreateProduct(fd)
      setSuccess('Product created successfully!')
      setTimeout(() => navigate('/products'), 1500)
    } catch (err) {
      const serverErrors = err?.response?.data?.errors
      const serverMessage = Array.isArray(serverErrors)
        ? serverErrors.map(error => error.msg).join(' ')
        : err?.response?.data?.message

      setErrors({ submit: serverMessage || err?.message || 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  const addImages  = (newImgs) => setImages(p => [...p, ...newImgs])
  const removeImage = (id) => setImages(p => {
    const found = p.find(i => i.id === id)
    if (found) URL.revokeObjectURL(found.preview)
    return p.filter(i => i.id !== id)
  })

  /* ── theme tokens ── */
  const T = {
    pageBg:    dark ? 'bg-[#111111]'   : 'bg-[#EFEDE9]',
    cardBg:    dark ? 'bg-[#1C1C1C]'   : 'bg-white',
    inputBg:   dark ? 'bg-[#2A2A2A]'   : 'bg-[#EDEAE5]',
    divider:   dark ? 'border-[#2E2E2E]' : 'border-[#EDEAE5]',
    headText:  dark ? 'text-[#F0F0F0]' : 'text-[#1A1A1A]',
    subText:   dark ? 'text-[#888]'    : 'text-[#57423B]',
    cardShadow: dark
      ? 'shadow-[0_4px_40px_rgba(0,0,0,0.5)]'
      : 'shadow-[0_4px_24px_rgba(139,114,105,0.10)]',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.pageBg} px-6 py-8 sm:px-10`}>
      <Fonts />

      {/* ── Theme toggle — fixed top-right ── */}
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} />

      {/* Back link */}
      <div className="max-w-5xl mx-auto mb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1.5 text-[13px] transition-colors group
            ${dark ? 'text-[#888] hover:text-[#F0F0F0]' : 'text-[#57423B] hover:text-[#1A1A1A]'}`}
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
      </div>

      {/* Page title */}
      <div className="max-w-5xl mx-auto mb-6">
        <h1
          className={`text-[40px] sm:text-[48px] font-extrabold leading-none tracking-tight ${T.headText}`}
          style={{ fontFamily: 'Epilogue, sans-serif' }}
        >
          Create Product
        </h1>
        <p className={`mt-2 text-[14px] ${T.subText}`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          Add a new item to your collection.
        </p>
      </div>

      {/* ── Big card ── */}
      <form onSubmit={handleSubmit} noValidate className="max-w-5xl mx-auto">
        <div className={`${T.cardBg} ${T.cardShadow} rounded-3xl px-8 pt-8 pb-0 sm:px-10 sm:pt-10 transition-colors duration-300`}>

          {/* Two-column body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

            {/* ── Left: fields ── */}
            <div className="space-y-6 pb-8">

              {/* Product Title */}
              <div>
                <FL htmlFor="title" dark={dark}>Product Title</FL>
                <BI
                  id="title"
                  value={title}
                  onChange={e => { setTitle(e.target.value); clr('title') }}
                  error={errors.title}
                  dark={dark}
                />
              </div>

              {/* Description */}
              <div>
                <FL htmlFor="desc" dark={dark}>Description</FL>
                <div className="relative">
                  <textarea
                    id="desc"
                    value={desc}
                    onChange={e => { if (e.target.value.length <= MAX) { setDesc(e.target.value); clr('desc') } }}
                    rows={6}
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif", resize: 'vertical' }}
                    className={`w-full px-4 pt-3 pb-7 rounded-xl text-[15px] outline-none
                      transition-all duration-200 leading-relaxed
                      ${dark
                        ? 'bg-[#2A2A2A] text-[#F0F0F0] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]'
                        : 'bg-[#EDEAE5] text-[#1A1A1A] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'
                      }
                      ${errors.desc ? 'ring-2 ring-red-400/50' : ''}`}
                  />
                  <span
                    className={`absolute bottom-2.5 right-3.5 text-[11px] pointer-events-none
                      ${desc.length > MAX * 0.9 ? 'text-[#E87040]' : dark ? 'text-[#555]' : 'text-[#C2B9B3]'}`}
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                  >
                    {desc.length} / {MAX}
                  </span>
                </div>
                {errors.desc && <p className="mt-1 text-[11.5px] text-red-500">{errors.desc}</p>}
              </div>

              {/* Amount + Currency */}
              <div className="flex gap-4 items-start">
                {/* Amount */}
                <div className="flex-1">
                  <FL htmlFor="amount" dark={dark}>Amount</FL>
                  <BI
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); clr('amount') }}
                    error={errors.amount}
                    dark={dark}
                  />
                </div>

                {/* Currency */}
                <div className="w-48">
                  <FL htmlFor="currency" orange dark={dark}>Currency</FL>
                  <div className="relative">
                    <select
                      id="currency"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                      className={`w-full px-4 py-3.5 rounded-xl text-[15px] outline-none appearance-none cursor-pointer transition-all duration-200
                        ${dark
                          ? 'bg-[#2A2A2A] text-[#F0F0F0] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]'
                          : 'bg-[#EDEAE5] text-[#1A1A1A] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'
                        }`}
                    >
                      <option value="INR">INR – Indian Rupee</option>
                      <option value="USD">USD – US Dollar</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="GBP">GBP – Pound</option>
                      <option value="JPY">JPY – Japanese Yen</option>
                    </select>
                    <svg
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none
                        ${dark ? 'text-[#666]' : 'text-[#9A8880]'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: imagery ── */}
            <div className="pb-8">
              <ImageUploader
                images={images}
                onAdd={addImages}
                onRemove={removeImage}
                error={errors.images}
                dark={dark}
              />
            </div>
          </div>

          {/* Divider */}
          <div className={`border-t ${T.divider} transition-colors duration-300`} />

          {/* Feedback */}
          {(errors.submit || success) && (
            <div className="pt-5">
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3">
                  <p className="text-[13px] text-red-400">{errors.submit}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-[13px] text-green-400 font-medium">{success}</p>
                </div>
              )}
            </div>
          )}

          {/* CTA — left-aligned */}
          <div className="py-7">
            <button
              type="submit"
              disabled={loading}
              style={{ fontFamily: 'Epilogue, sans-serif' }}
              className={`px-10 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-200
                ${loading
                  ? 'bg-[#E87040]/60 cursor-not-allowed'
                  : 'bg-[#E87040] hover:bg-[#D0612C] hover:shadow-[0_6px_20px_rgba(232,112,64,0.35)] active:scale-[0.98]'
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2.5">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating…
                </span>
              ) : 'Create Product'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
