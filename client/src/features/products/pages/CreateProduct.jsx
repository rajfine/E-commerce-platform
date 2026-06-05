import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'

/* ── Google Fonts ─────────────────────────────────────────────── */
const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@600;700;800&family=Be+Vietnam+Pro:wght@300;400;500;600&display=swap');
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes popIn {
      0%   { transform: scale(0.85); opacity: 0; }
      70%  { transform: scale(1.05); }
      100% { transform: scale(1);    opacity: 1; }
    }
    .anim-fade-slide  { animation: fadeSlideUp 0.25s ease both; }
    .anim-pop-in      { animation: popIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
    .color-swatch:focus-visible { outline: 2px solid #E87040; outline-offset: 3px; }
  `}</style>
)

/* ── Design Tokens ──────────────────────────────────────────────── */
const getT = (dark) => ({
  pageBg:     dark ? '#111111' : '#f3f2f1ff',
  cardBg:     dark ? '#1C1C1C' : '#FFFFFF',
  cardBg2:    dark ? '#242424' : '#F8F5F2',
  inputBg:    dark ? '#2A2A2A' : '#EDEAE5',
  divider:    dark ? '#2E2E2E' : '#EDEAE5',
  headText:   dark ? '#F0F0F0' : '#1A1A1A',
  subText:    dark ? '#888888' : '#57423B',
  greenBg:    dark ? '#133519' : '#E8F5E9',
  greenText:  dark ? '#4ADE80' : '#2E7D32',
  amberBg:    dark ? '#3B2A10' : '#FFF8E1',
  amberText:  dark ? '#FBBF24' : '#F57F17',
  redBg:      dark ? '#3B1212' : '#FFEBEE',
  redText:    dark ? '#F87171' : '#C62828',
  cardShadow: dark
    ? 'shadow-[0_4px_40px_rgba(0,0,0,0.5)]'
    : "",
})

const FASHION_COLORS = [
  { name: 'Jet Black',     hex: '#0A0A0A' },
  { name: 'Off White',     hex: '#F5F0E8' },
  { name: 'Stone Grey',    hex: '#8E8E8E' },
  { name: 'Slate',         hex: '#4A5568' },
  { name: 'Navy',          hex: '#1B2B5E' },
  { name: 'Royal Blue',    hex: '#2563EB' },
  { name: 'Sky',           hex: '#7DD3FC' },
  { name: 'Teal',          hex: '#0D9488' },
  { name: 'Sage',          hex: '#84A98C' },
  { name: 'Olive',         hex: '#5C6B2E' },
  { name: 'Khaki',         hex: '#C3A882' },
  { name: 'Sand',          hex: '#E8D5B7' },
  { name: 'Caramel',       hex: '#C97B3A' },
  { name: 'Rust',          hex: '#C0440D' },
  { name: 'Burnt Orange',  hex: '#E87040' },
  { name: 'Blush',         hex: '#E8A0A0' },
  { name: 'Rose',          hex: '#D2335C' },
  { name: 'Burgundy',      hex: '#7B1E3A' },
  { name: 'Lavender',      hex: '#C4B5FD' },
  { name: 'Plum',          hex: '#5B2C6F' },
]

const FL = ({ children, orange, dark }) => (
  <label className="block mb-2 text-[10.5px] font-semibold tracking-[0.13em] uppercase"
    style={{ fontFamily: "'Be Vietnam Pro', sans-serif", color: orange ? '#E87040' : dark ? '#888' : '#9A8880' }}>
    {children}
  </label>
)

const Inp = ({ dark, error, className = '', ...props }) => (
  <>
    <input {...props}
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      className={`w-full px-4 py-3 rounded-[3px] text-[14px] outline-none transition-all duration-200
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        ${dark
          ? 'bg-[#2A2A2A] text-[#F0F0F0] placeholder:text-[#555] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]'
          : 'bg-[#EDEAE5] text-[#1A1A1A] placeholder:text-[#C2B9B3] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'
        } ${error ? 'ring-2 ring-red-400/50' : ''} ${className}`} />
    {error && <p className="mt-1 text-[11.5px] text-red-500">{error}</p>}
  </>
)

const Sel = ({ dark, children, ...props }) => (
  <div className="relative">
    <select {...props} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      className={`w-full px-4 py-3 rounded-[3px] text-[14px] outline-none appearance-none cursor-pointer transition-all duration-200
        ${dark
          ? 'bg-[#2A2A2A] text-[#F0F0F0] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]'
          : 'bg-[#EDEAE5] text-[#1A1A1A] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'
        }`}>
      {children}
    </select>
    <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-[#666]' : 'text-[#9A8880]'}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
)

const ColorPicker = ({ dark, selected, onSelect }) => {
  const T = getT(dark)
  const customRef = useRef(null)
  const [customHex, setCustomHex] = useState('#000000')
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const selectedPreset = FASHION_COLORS.find(c => c.hex.toLowerCase() === selected?.toLowerCase())
  const isCustom = selected && !selectedPreset

  const handleCustomPick = (e) => {
    const hex = e.target.value
    setCustomHex(hex)
    onSelect(hex, 'Custom')
  }

  const isDark = (hex) => {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    return (r * 299 + g * 587 + b * 114) / 1000 < 128
  }

  return (
    <div>
      <FL dark={dark} orange>Color</FL>

      {/* Compact flex-wrap swatches — fixed 28px, no scale animation */}
      <div className="flex flex-wrap gap-1.5">
        {FASHION_COLORS.map((c, i) => {
          const isSelected = selected?.toLowerCase() === c.hex.toLowerCase()
          return (
            <div key={c.hex} className="relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}>
              <button
                type="button"
                className="color-swatch rounded-[3px] flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 28, height: 28,
                  background: c.hex,
                  outline: isSelected ? '2px solid #E87040' : '2px solid transparent',
                  outlineOffset: '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }}
                onClick={() => onSelect(c.hex, c.name)}
                aria-label={c.name}>
                {isSelected && (
                  <svg className="w-3 h-3 anim-pop-in" fill="none"
                    stroke={isDark(c.hex) ? 'white' : 'black'}
                    strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              {hoveredIdx === i && (
                <div className="absolute bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2 z-20
                  px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap pointer-events-none anim-fade-slide"
                  style={{ background: dark ? '#3A3A3A' : '#1A1A1A', color: '#fff', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {c.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                    style={{ borderTopColor: dark ? '#3A3A3A' : '#1A1A1A' }} />
                </div>
              )}
            </div>
          )
        })}

        {/* Custom color swatch */}
        <div className="relative">
          <button type="button"
            className="color-swatch rounded-[3px] flex-shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              width: 28, height: 28,
              background: isCustom
                ? selected
                : `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`,
              outline: isCustom ? '2px solid #E87040' : '2px solid transparent',
              outlineOffset: '2px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}
            onClick={() => customRef.current?.click()}
            aria-label="Custom color">
            {!isCustom && (
              <svg className="w-3 h-3 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            )}
            {isCustom && (
              <svg className="w-3 h-3 anim-pop-in" fill="none"
                stroke={isDark(selected) ? 'white' : 'black'}
                strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <input ref={customRef} type="color" className="absolute opacity-0 w-0 h-0"
            value={customHex} onChange={handleCustomPick} aria-hidden="true" />
        </div>
      </div>

      {/* Compact selected-color strip */}
      {selected && (
        <div className="mt-2.5 flex items-center gap-2.5 px-3 py-2 rounded-[3px] anim-fade-slide"
          style={{ background: T.inputBg }}>
          <div className="w-5 h-5 rounded-md flex-shrink-0 border border-white/10"
            style={{ background: selected }} />
          <p className="text-[12px] font-semibold flex-1 min-w-0 truncate"
            style={{ color: T.headText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {selectedPreset?.name || 'Custom'}
            <span className="font-normal ml-1.5 text-[11px]" style={{ color: T.subText }}>
              {selected.toUpperCase()}
            </span>
          </p>
          <button type="button" onClick={() => onSelect(null, null)}
            className="text-[11px] font-semibold flex-shrink-0 transition-opacity hover:opacity-60"
            style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

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
        className={`flex flex-col items-center justify-center gap-2 py-8 px-5 rounded-[3px] cursor-pointer
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
              className={`relative w-[100px] h-[100px] rounded-[3px] overflow-hidden flex-shrink-0
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

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const PRESET_CATEGORIES = ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Shorts', 'Sweaters', 'Hoodies', 'Polos', 'Joggers', 'Suits', 'Track Pants']

/* ── Main Page ────────────────────────────────────── */

export default function CreateProduct() {
  const navigate = useNavigate()
  const { handleCreateProduct } = useProduct()

  const dark = document.documentElement.classList.contains('dark')
  const T = getT(dark)
  
  // Base details
  const [title, setTitle]         = useState('')
  const [desc, setDesc]           = useState('')
  const [category, setCategory]   = useState('')
  const [amount, setAmount]       = useState('')
  const [currency, setCurrency]   = useState('INR')
  const [images, setImages]       = useState([])
  
  // Variant features
  const [selectedColor, setColor]     = useState(null)
  const [colorName, setColorName]     = useState(null)
  
  const [selectedSizes, setSelectedSizes] = useState(new Set())
  const [sizeStocks, setSizeStocks]       = useState({})
  const [customSize, setCustomSize]       = useState('')
  
  const [attrs, setAttrs]             = useState([])
  
  const [loading, setLoading]     = useState(false)
  const [errors, setErrors]       = useState({})
  const [success, setSuccess]     = useState('')

  const MAX = 1000
  const clr = (key) => errors[key] && setErrors(p => ({ ...p, [key]: '' }))

  const addAttr  = () => setAttrs(p => [...p, { key: '', value: '' }])
  const dropAttr = (i) => setAttrs(p => p.filter((_, idx) => idx !== i))
  const setAttr  = (i, f, v) => setAttrs(p => p.map((a, idx) => idx === i ? { ...a, [f]: v } : a))

  const toggleSize = (size) => {
    setSelectedSizes(prev => {
      const next = new Set(prev)
      next.has(size) ? next.delete(size) : next.add(size)
      return next
    })
    if (errors.sizes) clr('sizes')
  }

  const addCustomSize = () => {
    const s = customSize.trim().toUpperCase()
    if (!s) return
    setSelectedSizes(prev => new Set([...prev, s]))
    setCustomSize('')
    if (errors.sizes) clr('sizes')
  }

  const handleColorSelect = (hex, name) => {
    setColor(hex)
    setColorName(name)
    if (errors.color) clr('color')
  }

  const validate = () => {
    const e = {}
    if (!title.trim())                             e.title  = 'Title is required.'
    else if (title.trim().length < 3)              e.title  = 'Title must be at least 3 characters.'
    if (!category.trim())                          e.category = 'Category is required.'
    if (!desc.trim())                              e.desc   = 'Description is required.'
    else if (desc.trim().length < 10)              e.desc   = 'Description must be at least 10 characters.'
    else if (desc.length > MAX)                    e.desc   = `Max ${MAX} characters.`
    if (!amount || isNaN(amount) || +amount <= 0)  e.amount = 'Enter a valid price.'
    if (!images.length)                            e.images = 'Add at least one image.'
    if (!selectedColor)                            e.color  = 'Select a color.'
    if (selectedSizes.size === 0)                  e.sizes  = 'Select at least one size.'
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
      fd.append('category', category.trim())
      fd.append('priceAmount', amount)
      fd.append('priceCurrency', currency)
      
      images.forEach(img => fd.append('images', img.file))
      
      let totalStock = 0
      const sizes = [...selectedSizes].map(s => {
         const st = Number(sizeStocks[s] || 0)
         totalStock += st
         return { label: s, stock: st }
      })
      fd.append('stock', totalStock)
      
      const attributes = {
        color: selectedColor,
        colorName: colorName || selectedColor,
        sizes
      }
      attrs.filter(a => a.key.trim() && a.value.trim()).forEach(a => {
        attributes[a.key.trim().toLowerCase()] = a.value.trim()
      })
      fd.append('attributes', JSON.stringify(attributes))
      
      await handleCreateProduct(fd)
      setSuccess('Product created successfully!')
      setTimeout(() => navigate('/seller/dashboard'), 1500)
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${T.pageBg} px-6 py-8 sm:px-10`}>
      <Fonts />
      

      <div className="max-w-5xl mx-auto mb-5">
        <button type="button" onClick={() => navigate(-1)}
          className={`flex items-center gap-1.5 text-[13px] transition-colors group
            ${dark ? 'text-[#888] hover:text-[#F0F0F0]' : 'text-[#57423B] hover:text-[#1A1A1A]'}`}
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto mb-6">
        <h1 className={`text-[40px] sm:text-[48px] font-extrabold leading-none tracking-tight ${T.headText}`} style={{ fontFamily: 'Epilogue, sans-serif' }}>
          Create Product
        </h1>
        <p className={`mt-2 text-[14px] ${T.subText}`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          Add a new item to your collection.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-5xl mx-auto">
        <div className={`transition-colors duration-300 rounded-[3px] px-8 pt-8 pb-0 sm:px-10 sm:pt-10 ${T.cardShadow}`} style={{ background: T.cardBg }}>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="space-y-6 pb-8">
              
              <div>
                <FL dark={dark}>Product Title</FL>
                <Inp dark={dark} value={title} onChange={e => { setTitle(e.target.value); clr('title') }} error={errors.title} />
              </div>

              <div>
                <FL dark={dark}>Category</FL>
                <Inp dark={dark} list="category-options" placeholder="e.g. Shirts, Jeans, or custom..." value={category} onChange={e => { setCategory(e.target.value); clr('category') }} error={errors.category} />
                <datalist id="category-options">
                  {PRESET_CATEGORIES.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div>
                <FL dark={dark}>Description</FL>
                <div className="relative">
                  <textarea value={desc} onChange={e => { if (e.target.value.length <= MAX) { setDesc(e.target.value); clr('desc') } }} rows={5}
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif", resize: 'vertical' }}
                    className={`w-full px-4 pt-3 pb-7 rounded-[3px] text-[14px] outline-none transition-all duration-200 leading-relaxed
                      ${dark ? 'bg-[#2A2A2A] text-[#F0F0F0] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]' : 'bg-[#EDEAE5] text-[#1A1A1A] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'}
                      ${errors.desc ? 'ring-2 ring-red-400/50' : ''}`} />
                  <span className={`absolute bottom-2.5 right-3.5 text-[11px] pointer-events-none ${desc.length > MAX * 0.9 ? 'text-[#E87040]' : dark ? 'text-[#555]' : 'text-[#C2B9B3]'}`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {desc.length} / {MAX}
                  </span>
                </div>
                {errors.desc && <p className="mt-1 text-[11.5px] text-red-500">{errors.desc}</p>}
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <FL dark={dark}>Price Amount</FL>
                  <Inp dark={dark} type="number" value={amount} onChange={e => { setAmount(e.target.value); clr('amount') }} error={errors.amount} />
                </div>
                <div className="w-32">
                  <FL dark={dark} orange>Currency</FL>
                  <Sel dark={dark} value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Sel>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: T.divider }}>
                <ColorPicker dark={dark} selected={selectedColor} onSelect={handleColorSelect} />
                {errors.color && <p className="mt-1 text-[11.5px] text-red-500">{errors.color}</p>}
              </div>

              <div className="pt-4 border-t" style={{ borderColor: T.divider }}>
                <FL dark={dark} orange>Sizes & Stock</FL>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_SIZES.map(s => {
                    const active = selectedSizes.has(s)
                    return (
                      <button key={s} type="button" onClick={() => toggleSize(s)}
                        className={`px-3.5 py-1.5 rounded-[3px] text-[13px] font-bold tracking-wide transition-all
                          ${active ? 'bg-[#E87040] text-white shadow-md' : dark ? 'bg-[#2A2A2A] text-[#888] hover:bg-[#333]' : 'bg-[#EDEAE5] text-[#57423B] hover:bg-[#E2DDD6]'}`}
                        style={{ fontFamily: 'Epilogue, sans-serif' }}>
                        {s}
                      </button>
                    )
                  })}
                </div>
                
                <div className="flex gap-2 mb-2">
                  <Inp dark={dark} placeholder="Custom Size..." value={customSize} onChange={e => setCustomSize(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize())} className="!py-2" />
                  <button type="button" onClick={addCustomSize}
                    className={`px-4 rounded-[3px] text-[12px] font-bold tracking-wide whitespace-nowrap transition-colors
                      ${dark ? 'bg-[#2A2A2A] text-white hover:bg-[#333]' : 'bg-[#EDEAE5] text-[#1A1A1A] hover:bg-[#E2DDD6]'}`}>
                    ADD
                  </button>
                </div>

                {selectedSizes.size > 0 && (
                  <div className="mt-4 space-y-3">
                    <FL dark={dark}>Stock per selected size</FL>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[...selectedSizes].map(size => (
                        <div key={size} className="flex items-center gap-2">
                          <span className="w-10 text-[12px] font-bold" style={{ color: T.subText }}>{size}</span>
                          <Inp dark={dark} type="number" min={0} value={sizeStocks[size] || ''}
                            onChange={e => setSizeStocks(p => ({ ...p, [size]: Math.max(0, +e.target.value) }))}
                            placeholder="0" className="!py-1.5 flex-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {errors.sizes && <p className="mt-1 text-[11.5px] text-red-500">{errors.sizes}</p>}
              </div>

              <div className="pt-4 border-t" style={{ borderColor: T.divider }}>
                <div className="flex items-center justify-between mb-3">
                  <FL dark={dark} orange>Extra Attributes</FL>
                  <button type="button" onClick={addAttr}
                    className="text-[#E87040] text-[11px] font-bold tracking-wider hover:underline uppercase"
                    style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    + Add Row
                  </button>
                </div>
                {attrs.map((attr, i) => (
                  <div key={i} className="flex gap-2 mb-2 anim-fade-slide">
                    <Inp dark={dark} placeholder="e.g. Material" value={attr.key} onChange={e => setAttr(i, 'key', e.target.value)} className="!py-2" />
                    <Inp dark={dark} placeholder="e.g. 100% Cotton" value={attr.value} onChange={e => setAttr(i, 'value', e.target.value)} className="!py-2" />
                    <button type="button" onClick={() => dropAttr(i)} className="px-2 text-red-400 hover:text-red-500" aria-label="Remove">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

            </div>

            <div className="pb-8">
              <ImageUploader images={images} onAdd={addImages} onRemove={removeImage} error={errors.images} dark={dark} />
            </div>
          </div>

          <div className="border-t transition-colors duration-300" style={{ borderColor: T.divider }} />

          {(errors.submit || success) && (
            <div className="pt-5">
              {errors.submit && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-[3px] px-5 py-3">
                  <p className="text-[13px] text-red-400">{errors.submit}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-[3px] px-5 py-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-[13px] text-green-400 font-medium">{success}</p>
                </div>
              )}
            </div>
          )}

          <div className="py-7">
            <button type="submit" disabled={loading} style={{ fontFamily: 'Epilogue, sans-serif' }}
              className={`px-10 py-4 rounded-[3px] text-[15px] font-bold text-white transition-all duration-200
                ${loading ? 'bg-[#E87040]/60 cursor-not-allowed' : 'bg-[#E87040] hover:bg-[#D0612C] hover:shadow-[0_6px_20px_rgba(232,112,64,0.35)] active:scale-[0.98]'}`}>
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

