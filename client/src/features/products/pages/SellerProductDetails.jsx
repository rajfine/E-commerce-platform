import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
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
  pageBg:     dark ? '#111111' : '#EFEDE9',
  cardBg:     dark ? '#1C1C1C' : '#FFFFFF',
  cardBg2:    dark ? '#242424' : '#F8F5F2',
  inputBg:    dark ? '#2A2A2A' : '#EDEAE5',
  divider:    dark ? '#2E2E2E' : '#EDEAE5',
  border:     dark ? '#2E2E2E' : '#EDEAE5',
  headText:   dark ? '#F0F0F0' : '#1A1A1A',
  subText:    dark ? '#888888' : '#57423B',
  mutedText:  dark ? '#555555' : '#A39A96',
  accentDim:  dark ? 'rgba(232,112,64,0.15)' : 'rgba(232,112,64,0.10)',
  shadow:     dark ? '0 4px 40px rgba(0,0,0,0.5)' : '0 4px 24px rgba(139,114,105,0.10)',
  greenBg:    dark ? 'rgba(34,197,94,0.10)'  : 'rgba(34,197,94,0.08)',
  greenText:  dark ? '#4ade80' : '#16a34a',
  redBg:      dark ? 'rgba(239,68,68,0.10)'  : 'rgba(239,68,68,0.08)',
  redText:    dark ? '#f87171' : '#dc2626',
  amberBg:    dark ? 'rgba(245,158,11,0.10)' : 'rgba(245,158,11,0.08)',
  amberText:  dark ? '#fbbf24' : '#d97706',
})

/* ── Fashion Color Palette ─────────────────────────────────────── */
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

/* ── Helpers ────────────────────────────────────────────────────── */
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

const Spinner = ({ sm }) => (
  <svg className={`animate-spin ${sm ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const Toast = ({ toast }) => {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] anim-fade-slide
      flex items-center gap-3 px-5 py-3.5 rounded-[3px] shadow-2xl border backdrop-blur-md
      ${toast.type === 'error'
        ? 'bg-red-500/10 border-red-500/20 text-red-400'
        : 'bg-green-500/10 border-green-500/20 text-green-400'
      }`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {toast.type === 'error'
        ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
      }
      <span className="text-[13.5px] font-medium whitespace-nowrap">{toast.message}</span>
    </div>
  )
}

const StockBadge = ({ stock, dark }) => {
  const T = getT(dark)
  if (stock === 0) return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: T.redBg, color: T.redText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      Out of Stock
    </span>
  )
  if (stock <= 10) return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: T.amberBg, color: T.amberText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      Low · {stock}
    </span>
  )
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: T.greenBg, color: T.greenText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {stock} in stock
    </span>
  )
}

const AttrChip = ({ label, value, hex, dark }) => {
  const T = getT(dark)
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-[12px] font-medium"
      style={{ background: T.inputBg, color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      {hex && (
        <span className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
          style={{ background: hex }} />
      )}
      <span className="opacity-60">{label}:</span>
      <span className="font-semibold">{value}</span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
  PREMIUM COLOR PICKER
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
  VARIANT IMAGE UPLOADER (compact, drag-drop)
═══════════════════════════════════════════════════════════════ */
const VariantImageUploader = ({ dark, images, onAdd, onRemove }) => {
  const T = getT(dark)
  const ref = useRef(null)
  const [drag, setDrag] = useState(false)
  const MAX = 4

  const addFiles = useCallback((files) => {
    const slots = MAX - images.length
    if (slots <= 0) return
    const valid = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, slots)
    onAdd(valid.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`
    })))
  }, [images.length, onAdd])

  return (
    <div>
      <FL dark={dark}>Variant Images <span style={{ color: T.mutedText, fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>(up to {MAX})</span></FL>

      {/* Drop zone — compact */}
      <div
        onClick={() => images.length < MAX && ref.current?.click()}
        onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        className="flex items-center gap-4 px-5 py-4 rounded-[3px] cursor-pointer border-2 border-dashed transition-all duration-200"
        style={{
          borderColor: drag ? '#E87040' : dark ? 'rgba(232,112,64,0.35)' : 'rgba(232,112,64,0.50)',
          background: drag
            ? 'rgba(232,112,64,0.08)'
            : images.length >= MAX
              ? (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')
              : (dark ? '#1A1A1A' : '#FDFAF8'),
          cursor: images.length >= MAX ? 'not-allowed' : 'pointer',
          opacity: images.length >= MAX ? 0.5 : 1,
        }}>
        {/* Icon */}
        <div className="w-10 h-10 rounded-[3px] flex items-center justify-center flex-shrink-0"
          style={{ background: dark ? 'rgba(232,112,64,0.15)' : 'rgba(232,112,64,0.10)' }}>
          <svg className="w-5 h-5 text-[#E87040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12v4m-1.5-2l1.5 2 1.5-2" />
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-medium" style={{ color: T.headText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {drag ? 'Release to upload' : images.length >= MAX ? 'Max images reached' : 'Drag & drop or click to browse'}
          </p>
          <p className="text-[11px]" style={{ color: T.mutedText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            JPEG, PNG, WEBP · {images.length}/{MAX} added
          </p>
        </div>
        <input ref={ref} type="file" accept="image/*" multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-3 flex gap-2.5 flex-wrap">
          {images.map((img, i) => (
            <div key={img.id}
              className="relative w-[72px] h-[72px] rounded-[3px] overflow-hidden flex-shrink-0 group"
              style={{ border: `1.5px solid ${dark ? '#3A3A3A' : '#E0DAD4'}` }}>
              {/* first image = primary badge */}
              {i === 0 && (
                <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-md text-[9px] font-bold"
                  style={{ background: '#E87040', color: 'white', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  MAIN
                </div>
              )}
              <img src={img.preview} alt="variant" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
                flex items-center justify-center">
                <button type="button"
                  onClick={e => { e.stopPropagation(); onRemove(img.id) }}
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-3 h-3 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
  ADD VARIANT MODAL  (image upload + color picker + multi-size + attrs)
═══════════════════════════════════════════════════════════════ */
const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

const VariantModal = ({ dark, onClose, onSave, loading, variant }) => {
  const T = getT(dark)
  const [stock, setStock]             = useState(0)
  const [priceAmount, setPriceAmount] = useState('')
  const [priceCurrency, setCurrency]  = useState('INR')
  const [selectedColor, setColor]     = useState(null)
  const [colorName, setColorName]     = useState(null)
  const [images, setImages]           = useState([])
  /* Multi-size state */
  const [selectedSizes, setSelectedSizes] = useState(new Set())
  const [customSize, setCustomSize]       = useState('')
  /* Extra (non-size) attributes */
  const [attrs, setAttrs]             = useState([])
  const [errors, setErrors]           = useState({})
  const [sizeStocks, setSizeStocks]   = useState({})

  useEffect(() => {
    if (variant) {
      if (variant.price) {
        setPriceAmount(variant.price.amount || '')
        if (variant.price.currency) setCurrency(variant.price.currency)
      }
      if (variant.attributes?.color) setColor(variant.attributes.color)
      if (variant.attributes?.colorName) setColorName(variant.attributes.colorName)
      
      const sizesObj = {}
      if (variant.attributes?.sizes) {
        variant.attributes.sizes.forEach(s => {
          sizesObj[s.label] = s.stock || 0
        })
      } else if (variant.attributes?.size) {
         sizesObj[variant.attributes.size] = variant.stock || 0
      }
      setSelectedSizes(new Set(Object.keys(sizesObj)))
      setSizeStocks(sizesObj)
      
      const extraAttrs = []
      if (variant.attributes) {
         Object.entries(variant.attributes).forEach(([k, v]) => {
            if (k !== 'color' && k !== 'colorName' && k !== 'sizes' && k !== 'size') {
               extraAttrs.push({ key: k, value: v })
            }
         })
      }
      setAttrs(extraAttrs)
      
      if (variant.images) {
         setImages(variant.images.map(img => ({ id: img._id || Math.random().toString(), url: img.url, preview: img.url, isExisting: true })))
      }
    }
  }, [variant])


  const addAttr  = () => setAttrs(p => [...p, { key: '', value: '' }])
  const dropAttr = (i) => setAttrs(p => p.filter((_, idx) => idx !== i))
  const setAttr  = (i, f, v) => setAttrs(p => p.map((a, idx) => idx === i ? { ...a, [f]: v } : a))
  const addImgs  = (newImgs) => setImages(p => [...p, ...newImgs])
  const removeImg = (id) => setImages(p => {
    const found = p.find(i => i.id === id)
    if (found) URL.revokeObjectURL(found.preview)
    return p.filter(i => i.id !== id)
  })

  const toggleSize = (size) => {
    setSelectedSizes(prev => {
      const next = new Set(prev)
      next.has(size) ? next.delete(size) : next.add(size)
      return next
    })
    if (errors.sizes) setErrors(p => ({ ...p, sizes: '' }))
  }

  const addCustomSize = () => {
    const s = customSize.trim().toUpperCase()
    if (!s) return
    setSelectedSizes(prev => new Set([...prev, s]))
    setCustomSize('')
    if (errors.sizes) setErrors(p => ({ ...p, sizes: '' }))
  }

  const handleColorSelect = (hex, name) => {
    setColor(hex)
    setColorName(name)
    if (errors.color) setErrors(p => ({ ...p, color: '' }))
  }

  const validate = () => {
    const e = {}
    if (!priceAmount || isNaN(priceAmount) || +priceAmount <= 0)
      e.price = 'Enter a valid price.'
    
    if (!selectedColor)
      e.color = 'Please select a color for this variant.'
    if (selectedSizes.size === 0)
      e.sizes = 'Select at least one size.'
    return e
  }

  /* Build single FormData */
  const buildFd = () => {
    const fd = new FormData()
    let totalStock = 0
    const sizes = [...selectedSizes].map(s => {
       const st = Number(sizeStocks[s] || 0)
       totalStock += st
       return { label: s, stock: st }
    })
    
    fd.append('stock', totalStock)
    fd.append('priceAmount', priceAmount)
    fd.append('priceCurrency', priceCurrency)

    const attributes = {
      color: selectedColor,
      colorName: colorName || selectedColor,
      sizes
    }
    attrs.filter(a => a.key.trim() && a.value.trim()).forEach(a => {
      attributes[a.key.trim().toLowerCase()] = a.value.trim()
    })
    fd.append('attributes', JSON.stringify(attributes))
    images.forEach(img => {
      if (img.file) fd.append('images', img.file)
      else if (img.isExisting) fd.append('existingImages', JSON.stringify(img))
    })
    return fd
  }


  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(buildFd())
  }

  const totalVariants = selectedSizes.size

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <div className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-[3px] overflow-hidden flex flex-col anim-fade-slide"
        style={{ background: T.cardBg, maxHeight: '92vh' }}>

        {/* Sticky header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <h3 className="text-[20px] font-bold" style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
              {variant ? 'Edit Variant' : 'Add Variant'}
            </h3>
            <p className="text-[12px] mt-0.5" style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Images · Color · Sizes · Stock · Price
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
            style={{ background: T.inputBg, color: T.subText }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* ① Variant Images */}
          <section>
            <VariantImageUploader dark={dark} images={images} onAdd={addImgs} onRemove={removeImg} />
          </section>

          <div className="border-t" style={{ borderColor: T.border }} />

          {/* ② Color Picker */}
          <section>
            <ColorPicker dark={dark} selected={selectedColor} onSelect={handleColorSelect} />
            {errors.color && (
              <p className="mt-2 text-[11.5px] text-red-500" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {errors.color}
              </p>
            )}
          </section>

          <div className="border-t" style={{ borderColor: T.border }} />

          {/* ③ SIZE MULTI-SELECT */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <FL dark={dark} orange>Sizes
                <span style={{ color: T.mutedText, fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>
                  {' '}— select all that apply
                </span>
              </FL>
              {selectedSizes.size > 0 && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(232,112,64,0.15)', color: '#E87040', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {selectedSizes.size} size{selectedSizes.size > 1 ? 's' : ''} selected
                </span>
              )}
            </div>

            {/* Preset size chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_SIZES.map(size => {
                const active = selectedSizes.has(size)
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className="min-w-[48px] px-3 py-2 rounded-[3px] text-[13px] font-bold transition-all duration-200 active:scale-95"
                    style={{
                      fontFamily: 'Epilogue, sans-serif',
                      background: active ? '#E87040' : T.inputBg,
                      color: active ? 'white' : T.subText,
                      border: active ? '2px solid #E87040' : `2px solid transparent`,
                      boxShadow: active ? '0 3px 12px rgba(232,112,64,0.30)' : 'none',
                    }}
                  >
                    {size}
                  </button>
                )
              })}
            </div>

            {/* Custom size input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Inp dark={dark} value={customSize}
                  onChange={e => setCustomSize(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                  placeholder="Custom size (e.g. 32, 44, Free Size…)" />
              </div>
              <button type="button" onClick={addCustomSize}
                className="px-4 py-3 rounded-[3px] text-[13px] font-bold flex-shrink-0 transition-all hover:opacity-80"
                style={{ background: T.inputBg, color: T.subText, fontFamily: 'Epilogue, sans-serif' }}>
                + Add
              </button>
            </div>

            {/* Custom sizes already added (not presets) */}
            {[...selectedSizes].filter(s => !PRESET_SIZES.includes(s)).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[...selectedSizes].filter(s => !PRESET_SIZES.includes(s)).map(s => (
                  <span key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
                    style={{ background: 'rgba(232,112,64,0.12)', color: '#E87040', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {s}
                    <button type="button" onClick={() => toggleSize(s)}
                      className="hover:opacity-60 transition-opacity">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            
            {/* Per-size stock inputs */}
            {selectedSizes.size > 0 && (
              <div className="mt-4 space-y-3">
                <FL dark={dark}>Stock per selected size</FL>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...selectedSizes].map(size => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="w-10 text-[12px] font-bold" style={{ color: T.subText }}>{size}</span>
                      <Inp dark={dark} type="number" min={0} value={sizeStocks[size] || ''}
                        onChange={e => setSizeStocks(p => ({ ...p, [size]: Math.max(0, +e.target.value) }))}
                        placeholder="0" className="flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.sizes && (
              <p className="mt-2 text-[11.5px] text-red-500" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {errors.sizes}
              </p>
            )}
          </section>

          <div className="border-t" style={{ borderColor: T.border }} />

          {/* ④ Extra Attributes (material, fit, etc. — NOT size) */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <FL dark={dark}>Extra Attributes <span style={{ color: T.mutedText, fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>(optional — material, fit…)</span></FL>
              <button type="button" onClick={addAttr}
                className="flex items-center gap-1 text-[#E87040] text-[12px] font-semibold hover:opacity-75 transition-opacity"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Row
              </button>
            </div>
            <div className="space-y-2">
              {attrs.map((a, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Inp dark={dark} value={a.key}
                    onChange={e => setAttr(i, 'key', e.target.value)}
                    placeholder="material, fit…" className="flex-1" />
                  <Inp dark={dark} value={a.value}
                    onChange={e => setAttr(i, 'value', e.target.value)}
                    placeholder="Cotton, Slim…" className="flex-1" />
                  <button type="button" onClick={() => dropAttr(i)}
                    className="w-9 h-9 flex-shrink-0 rounded-[3px] flex items-center justify-center hover:opacity-70 transition-opacity"
                    style={{ background: T.inputBg, color: T.subText }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {attrs.length === 0 && (
                <p className="text-[12px] py-2" style={{ color: T.mutedText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  No extra attributes. Click “Add Row” to add material, fit, etc.
                </p>
              )}
            </div>
          </section>

          <div className="border-t" style={{ borderColor: T.border }} />

          {/* ⑤ Price + Stock */}
          <section>
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div className="col-span-2 sm:col-span-1">
                <FL dark={dark}>Variant Price</FL>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Inp dark={dark} type="number" value={priceAmount}
                      onChange={e => { setPriceAmount(e.target.value); setErrors(p => ({...p, price: ''})) }}
                      placeholder="0" error={errors.price} min={0} />
                  </div>
                  <div className="w-28 flex-shrink-0">
                    <Sel dark={dark} value={priceCurrency} onChange={e => setCurrency(e.target.value)}>
                      <option value="INR">INR ₹</option>
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                      <option value="JPY">JPY ¥</option>
                    </Sel>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Summary */}
            {!variant && totalVariants > 1 && (
              <div className="mt-4 px-4 py-3 rounded-[3px] flex items-center gap-3"
                style={{ background: 'rgba(232,112,64,0.08)', border: '1px solid rgba(232,112,64,0.20)' }}>
                <svg className="w-4 h-4 flex-shrink-0 text-[#E87040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[12px] font-medium" style={{ color: '#E87040', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  This will create <strong>{totalVariants} variants</strong> — one for each size ({[...selectedSizes].join(', ')}), each with {stock} units in stock.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sticky footer */}
        <div className="flex gap-3 px-6 py-5 flex-shrink-0" style={{ borderTop: `1px solid ${T.border}` }}>
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-3.5 rounded-[3px] text-[14px] font-semibold transition-all hover:opacity-80"
            style={{ background: T.inputBg, color: T.subText, fontFamily: 'Epilogue, sans-serif' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-[2] py-3.5 rounded-[3px] text-[14px] font-bold text-white
              flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: '#E87040',
              fontFamily: 'Epilogue, sans-serif',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(232,112,64,0.40)',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading
              ? <><Spinner sm />Saving…</>
              : variant
              ? 'Update Variant'
              : totalVariants > 1
              ? `+ Add ${totalVariants} Variants`
              : '+ Add Variant'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STOCK MODAL
═══════════════════════════════════════════════════════════════ */
const StockModal = ({ dark, variant, onClose, onSave, loading }) => {
  const T = getT(dark)
  const [val, setVal]   = useState(0)
  const [mode, setMode] = useState('set')

  const getPreview = () => {
    const n = +val
    if (mode === 'add') return Math.max(0, (variant?.stock ?? 0) + n)
    if (mode === 'remove') return Math.max(0, (variant?.stock ?? 0) - n)
    return Math.max(0, n)
  }

  const attrEntries = variant?.attributes ? Object.entries(variant.attributes) : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-[3px] p-7 shadow-2xl anim-fade-slide"
        style={{ background: T.cardBg }}>

        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-[18px] font-bold" style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
              Manage Stock
            </h3>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {attrEntries
                .filter(([k]) => k !== 'colorName')
                .map(([k, v]) => (
                  <AttrChip key={k} label={k} value={k === 'color' ? (variant.attributes.colorName || v) : v}
                    hex={k === 'color' ? v : null} dark={dark} />
                ))}
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ background: T.inputBg, color: T.subText }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Edit Variant */}
        <div className="rounded-[3px] p-4 mb-5 flex items-center gap-4"
          style={{ background: T.cardBg2 }}>
          <div className="w-12 h-12 rounded-[3px] flex items-center justify-center"
            style={{ background: dark ? 'rgba(232,112,64,0.15)' : 'rgba(232,112,64,0.10)' }}>
            <svg className="w-6 h-6 text-[#E87040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.1em] mb-0.5 font-semibold"
              style={{ color: T.mutedText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Edit Variant</p>
            <p className="text-[28px] font-bold" style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
              {variant?.stock ?? 0}
            </p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex rounded-[3px] overflow-hidden mb-4" style={{ background: T.inputBg }}>
          {[['set', 'Set to'], ['add', 'Add'], ['remove', 'Remove']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)}
              className="flex-1 py-2.5 text-[13px] font-semibold transition-all duration-200"
              style={{
                background: mode === v ? '#E87040' : 'transparent',
                color: mode === v ? 'white' : T.subText,
                borderRadius: '0.75rem',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}>
              {l}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mb-4">
          <Inp dark={dark} type="number" value={val}
            onChange={e => setVal(Math.max(0, +e.target.value))} min={0} placeholder="0" />
        </div>

        {/* Preview */}
        <div className="rounded-[3px] px-4 py-3 mb-6 flex justify-between items-center"
          style={{ background: dark ? 'rgba(232,112,64,0.12)' : 'rgba(232,112,64,0.08)' }}>
          <span className="text-[13px] font-semibold" style={{ color: T.headText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            New stock will be:
          </span>
          <span className="text-[24px] font-extrabold text-[#E87040]"
            style={{ fontFamily: 'Epilogue, sans-serif' }}>
            {getPreview()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-3 rounded-[3px] text-[14px] font-semibold"
            style={{ background: T.inputBg, color: T.subText, fontFamily: 'Epilogue, sans-serif' }}>
            Cancel
          </button>
          <button onClick={() => onSave(getPreview())} disabled={loading}
            className="flex-[2] py-3 rounded-[3px] text-[14px] font-bold text-white flex items-center justify-center gap-2"
            style={{
              background: '#E87040', fontFamily: 'Epilogue, sans-serif',
              boxShadow: '0 4px 16px rgba(232,112,64,0.35)', opacity: loading ? 0.7 : 1
            }}>
            {loading ? <><Spinner sm />Saving…</> : 'Update Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EDIT INFO MODAL
═══════════════════════════════════════════════════════════════ */
const EditInfoModal = ({ dark, product, onClose, onSave, loading }) => {
  const T = getT(dark)
  const [title, setTitle]       = useState(product?.title || '')
  const [desc, setDesc]         = useState(product?.description || '')
  const [amount, setAmount]     = useState(product?.price?.amount || '')
  const [currency, setCurrency] = useState(product?.price?.currency || 'INR')
  const [errors, setErrors]     = useState({})
  const MAX = 1000

  const validate = () => {
    const e = {}
    if (!title.trim() || title.trim().length < 3) e.title = 'Title must be at least 3 characters.'
    if (!desc.trim() || desc.trim().length < 10) e.desc = 'Description must be at least 10 characters.'
    if (!amount || isNaN(amount) || +amount <= 0) e.amount = 'Enter a valid price.'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ title: title.trim(), description: desc.trim(), price: { amount: +amount, currency } })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-[3px] p-7 shadow-2xl anim-fade-slide"
        style={{ background: T.cardBg }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[20px] font-bold" style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
            Edit Product Info
          </h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70"
            style={{ background: T.inputBg, color: T.subText }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <FL dark={dark}>Product Title</FL>
            <Inp dark={dark} value={title}
              onChange={e => { setTitle(e.target.value); setErrors(p => ({...p, title: ''})) }}
              placeholder="Product name" error={errors.title} />
          </div>
          <div>
            <FL dark={dark}>Description</FL>
            <div className="relative">
              <textarea value={desc}
                onChange={e => { if (e.target.value.length <= MAX) { setDesc(e.target.value); setErrors(p => ({...p, desc: ''})) } }}
                rows={5} placeholder="Describe your product…"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif", resize: 'vertical' }}
                className={`w-full px-4 pt-3 pb-7 rounded-[3px] text-[14px] outline-none transition-all leading-relaxed
                  ${dark ? 'bg-[#2A2A2A] text-[#F0F0F0] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#313131]'
                    : 'bg-[#EDEAE5] text-[#1A1A1A] focus:ring-2 focus:ring-[#E87040]/40 focus:bg-[#E8E3DC]'}
                  ${errors.desc ? 'ring-2 ring-red-400/50' : ''}`} />
              <span className={`absolute bottom-2.5 right-3.5 text-[11px] pointer-events-none
                ${desc.length > MAX * 0.9 ? 'text-[#E87040]' : dark ? 'text-[#555]' : 'text-[#C2B9B3]'}`}
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {desc.length} / {MAX}
              </span>
            </div>
            {errors.desc && <p className="mt-1 text-[11.5px] text-red-500">{errors.desc}</p>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <FL dark={dark}>Base Price</FL>
              <Inp dark={dark} type="number" value={amount}
                onChange={e => { setAmount(e.target.value); setErrors(p => ({...p, amount: ''})) }}
                placeholder="0" error={errors.amount} />
            </div>
            <div className="w-36">
              <FL dark={dark} orange>Currency</FL>
              <Sel dark={dark} value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="JPY">JPY ¥</option>
              </Sel>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-3 rounded-[3px] text-[14px] font-semibold"
            style={{ background: T.inputBg, color: T.subText, fontFamily: 'Epilogue, sans-serif' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-[2] py-3 rounded-[3px] text-[14px] font-bold text-white flex items-center justify-center gap-2"
            style={{ background: '#E87040', fontFamily: 'Epilogue, sans-serif',
              boxShadow: '0 4px 16px rgba(232,112,64,0.35)', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Spinner sm />Saving…</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
  DELETE CONFIRM MODAL
═══════════════════════════════════════════════════════════════ */
const DeleteModal = ({ dark, onClose, onConfirm, loading, label }) => {
  const T = getT(dark)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-[3px] p-7 shadow-2xl text-center anim-fade-slide"
        style={{ background: T.cardBg }}>
        <div className="w-14 h-14 rounded-[3px] flex items-center justify-center mx-auto mb-5"
          style={{ background: T.redBg }}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            style={{ color: T.redText }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-[18px] font-bold mb-2" style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
          Delete Variant?
        </h3>
        <p className="text-[13px] mb-6" style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {label ? `"${label}"` : 'This variant'} will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-3 rounded-[3px] text-[14px] font-semibold"
            style={{ background: T.inputBg, color: T.subText, fontFamily: 'Epilogue, sans-serif' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-3 rounded-[3px] text-[14px] font-bold text-white flex items-center justify-center gap-2"
            style={{ background: '#ef4444', fontFamily: 'Epilogue, sans-serif', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Spinner sm />Deleting…</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   VARIANT CARD
═══════════════════════════════════════════════════════════════ */
const VariantCard = ({ variant, dark, onEditClick, onDeleteClick }) => {
  const T = getT(dark)
  const attrEntries = variant.attributes
    ? Object.entries(variant.attributes).filter(([k]) => k !== 'colorName' && k !== 'sizes')
    : []
  const colorHex  = variant.attributes?.color
  const colorName = variant.attributes?.colorName || colorHex

  const fmtPrice = (amount, currency) =>
    `${Number(amount || 0).toLocaleString('en-IN')} ${currency || 'INR'}`

  const previewImage = variant.images?.[0]?.url

  return (
    <div className="group relative min-h-[210px] px-2 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-[4px]" onClick={() => onEditClick(variant)}>
      <div className="flex items-start gap-8">
        <div className="h-28 w-20 flex-shrink-0 overflow-hidden bg-[#EFEAE4]">
          {previewImage ? (
            <img src={previewImage} alt={colorName || 'Variant'} className="h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg className="h-8 w-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: T.headText }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="min-w-0 pt-3">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: T.mutedText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Color
            </span>
            {colorHex && (
              <span className="h-3 w-3 rounded-full border"
                style={{ background: colorHex, borderColor: T.border }} />
            )}
            <span className="text-[13px] font-extrabold uppercase tracking-[0.08em]"
              style={{ color: T.headText, fontFamily: 'Epilogue, sans-serif' }}>
              {colorName || 'Default'}
            </span>
          </div>

          <p className="text-[16px] font-extrabold"
            style={{ color: T.headText, fontFamily: 'Epilogue, sans-serif' }}>
            {fmtPrice(variant.price?.amount, variant.price?.currency)}
          </p>

          {attrEntries.filter(([k]) => k !== 'color').length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {attrEntries
                .filter(([k]) => k !== 'color')
                .map(([k, v]) => (
                  <span key={k} className="text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {k} <strong style={{ color: T.headText }}>{v}</strong>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {variant.attributes?.sizes?.length > 0 ? (
        <div className="mt-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] block mb-3"
            style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Sizes & Stock
          </span>
          <div className="flex flex-wrap gap-2">
            {variant.attributes.sizes.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center border rounded-[3px] p-2 min-w-[50px]"
                style={{ borderColor: T.border, background: T.inputBg }}>
                <span className="text-[12px] font-extrabold" style={{ color: T.headText }}>{s.label}</span>
                <span className="text-[10px] font-medium" style={{ color: T.subText }}>{s.stock ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => onEditClick(variant)}
          className="mt-14 grid w-full grid-cols-[1fr_96px] items-end text-left group/stock"
          title="Edit Variant">
          <span className="text-[13px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            Edit Variant
          </span>
          <span className="border-b pb-2 text-center text-[22px] font-extrabold transition-colors group-hover/stock:text-[#E87040]"
            style={{ borderColor: T.border, color: T.headText, fontFamily: 'Epilogue, sans-serif' }}>
            {variant.stock ?? 0}
          </span>
        </button>
      )}

      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={(e) => { e.stopPropagation(); onEditClick(variant); }} title="Edit Variant"
          className="h-7 w-7 border text-[0] transition-colors hover:bg-[#4A3222] hover:text-white"
          style={{ borderColor: T.border, color: T.subText }}>
          <svg className="m-auto h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDeleteClick(variant); }} title="Delete"
          className="h-7 w-7 border text-[0] transition-colors hover:bg-red-500 hover:text-white"
          style={{ borderColor: T.border, color: T.subText }}>
          <svg className="m-auto h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}


/* ── Skeleton ───────────────────────────────────────────────────── */
const Skel = ({ dark, h = 'h-4', w = 'w-full', r = 'rounded-[3px]' }) => (
  <div className={`${h} ${w} ${r} animate-pulse`}
    style={{ background: dark ? '#2A2A2A' : '#DCD8D3' }} />
)

/* ── Image Gallery ─────────────────────────────────────────────── */
const ImageGallery = ({ images, dark }) => {
  const T = getT(dark)
  const [active, setActive] = useState(0)
  if (!images?.length) return (
    <div className="aspect-square rounded-[3px] flex items-center justify-center"
      style={{ background: T.inputBg }}>
      <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        style={{ color: T.headText }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  )
  return (
    <div className="space-y-2.5">
      <div className="relative aspect-[4/5] rounded-[3px] overflow-hidden group"
        style={{ background: T.inputBg }}>
        <img src={images[active]?.url} alt={images[active]?.alt || 'Product'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white
            text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            {active + 1} / {images.length}
          </div>
        )}
        {images.length > 1 && <>
          <button onClick={() => setActive(p => (p - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm
              rounded-full flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => setActive(p => (p + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm
              rounded-full flex items-center justify-center text-white
              opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button key={img._id || i} onClick={() => setActive(i)}
              className="w-12 h-12 rounded-[3px] overflow-hidden flex-shrink-0 transition-all duration-200"
              style={{
                background: T.inputBg,
                opacity: i === active ? 1 : 0.55,
                ring: i === active ? '2px solid #E87040' : 'none',
                transform: i === active ? 'scale(1.07)' : 'scale(1)',
                outline: i === active ? '2px solid #E87040' : 'none',
                outlineOffset: '2px',
              }}>
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
  MAIN PAGE
═══════════════════════════════════════════════════════════════ */
const SellerProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const {
    handleGetProductById,
    handleUpdateProduct,
    handleAddVariant,
    handleUpdateVariant,
    handleDeleteVariant,
    handleGetAllProducts,
  } = useProduct()

  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const dark = document.documentElement.classList.contains('dark')
  const [actionLoading, setAL]      = useState(false)

  const [showVariantModal, setShowVariantModal] = useState(false)
  const [editingVariant, setEditingVariant] = useState(null)
  const [showStock, setShowStock]       = useState(false)

  const [showEdit, setShowEdit]         = useState(false)
  const [showDelete, setShowDelete]     = useState(false)
  const [selVariant, setSelVariant]     = useState(null)

  const [toast, setToast]   = useState(null)
  const toastRef            = useRef(null)
  const T = getT(dark)

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastRef.current)
    setToast({ message, type })
    toastRef.current = setTimeout(() => setToast(null), 3500)
  }, [])

  /* ── Fetch ── */
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try { setProduct(await handleGetProductById(productId)) }
      catch { showToast('Failed to load product.', 'error') }
      finally { setLoading(false) }
    }
    fetch()
  }, [productId]) // eslint-disable-line

  /* ── Handlers ── */
  const handleSaveInfo = async (data) => {
    setAL(true)
    try {
      await handleUpdateProduct(productId, data)
      setProduct(p => ({ ...p, ...data }))
      setShowEdit(false)
      handleGetAllProducts()
      showToast('Product updated!')
    } catch { showToast('Failed to update product.', 'error') }
    finally { setAL(false) }
  }

  // console.log(selVariant)

  const handleSaveVariant = async (formData) => {
    setAL(true)
    try {
      if (editingVariant) {
        await handleUpdateVariant(productId, editingVariant._id, formData)
        showToast('Variant updated!')
      } else {
        await handleAddVariant(productId, formData)
        showToast('Variant added!')
      }
      const updated = await handleGetProductById(productId)
      setProduct(updated)
      setShowVariantModal(false)
      setEditingVariant(null)
      handleGetAllProducts()
    } catch { showToast('Failed to save variant.', 'error') }
    finally { setAL(false) }
  }



  const handleStockSave = async (newStock) => {
    if (!selVariant) return
    setAL(true)
    try {
      await handleUpdateVariant(productId, selVariant._id, { stock: newStock })
      setProduct(p => ({
        ...p,
        variant: p.variant.map(v => v._id === selVariant._id ? { ...v, stock: newStock } : v)
      }))
      setShowStock(false); setSelVariant(null)
      handleGetAllProducts()
      showToast('Stock updated!')
    } catch { showToast('Failed to update stock.', 'error') }
    finally { setAL(false) }
  }

  const handleDeleteConfirm = async () => {
    if (!selVariant) return
    setAL(true)
    try {
      await handleDeleteVariant(productId, selVariant._id)
      setProduct(p => ({ ...p, variant: p.variant.filter(v => v._id !== selVariant._id) }))
      setShowDelete(false); setSelVariant(null)
      handleGetAllProducts()
      showToast('Variant deleted.')
    } catch { showToast('Failed to delete variant.', 'error') }
    finally { setAL(false) }
  }

  /* ── Derived ── */
  const totalVariants = product?.variant?.length || 0
  const totalStock    = product?.variant?.reduce((s, v) => s + (v.stock || 0), 0) || 0
  const outOfStock    = product?.variant?.filter(v => v.stock === 0).length || 0
  const fmtPrice      = (a, c) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: c || 'INR', maximumFractionDigits: 0 }).format(a)
  const fmtDate       = (ds) =>
    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(ds))

  
  const getDeleteLabel = () => {
    if (!selVariant?.attributes) return null
    const colorName = selVariant.attributes.colorName || selVariant.attributes.color
    const others = Object.entries(selVariant.attributes)
      .filter(([k]) => k !== 'color' && k !== 'colorName')
      .map(([, v]) => v)
    return [colorName, ...others].filter(Boolean).join(' / ')
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: T.pageBg }}>
      <Fonts />
      
      <Toast toast={toast} />

      {/* ── Modals ── */}
      {showVariantModal && <VariantModal dark={dark} variant={editingVariant} loading={actionLoading} onClose={() => { setShowVariantModal(false); setEditingVariant(null); }} onSave={handleSaveVariant} />}
      
      {/* Stock modal reused for the base product — passes a virtual variant-shaped object */}

      {showEdit   && product && <EditInfoModal dark={dark} product={product} loading={actionLoading}
        onClose={() => setShowEdit(false)} onSave={handleSaveInfo} />}
      {showDelete && selVariant && <DeleteModal dark={dark} loading={actionLoading} label={getDeleteLabel()}
        onClose={() => { setShowDelete(false); setSelVariant(null) }} onConfirm={handleDeleteConfirm} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Back */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] transition-colors group"
            style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Skel dark={dark} h="h-80" r="rounded-[3px]" />
              <div className="flex gap-2">{[0,1,2].map(i=><Skel key={i} dark={dark} h="h-16" w="w-16" r="rounded-[3px]"/>)}</div>
            </div>
            <div className="space-y-4">
              <Skel dark={dark} h="h-10" w="w-2/3" />
              <Skel dark={dark} h="h-5" w="w-1/3" />
              <Skel dark={dark} h="h-24" />
              <div className="grid grid-cols-3 gap-4">{[0,1,2].map(i=><Skel key={i} dark={dark} h="h-28" r="rounded-[3px]"/>)}</div>
            </div>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: T.inputBg }}>
              <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: T.headText }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-[22px] font-bold mb-2" style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>Product not found</h2>
            <button onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-[3px] text-[14px] font-bold text-white mt-4"
              style={{ background: '#E87040', fontFamily: 'Epilogue, sans-serif' }}>Go Back</button>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[30px] sm:text-[38px] font-extrabold leading-none tracking-tight mb-2"
                  style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[12px]" style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    Created {product.createdAt ? fmtDate(product.createdAt) : '—'}
                  </span>
                  <span style={{ color: T.divider }}>·</span>
                  <span className="text-[12px] font-semibold text-[#E87040]" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {fmtPrice(product?.variant?.[0]?.price?.amount ?? product.price?.amount, product?.variant?.[0]?.price?.currency || product.price?.currency)} base
                  </span>
                </div>
              </div>
              <button onClick={() => setShowEdit(true)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-[3px] text-[13px] font-bold text-white
                  transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ background: '#E87040', fontFamily: 'Epilogue, sans-serif', boxShadow: '0 4px 16px rgba(232,112,64,0.30)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Info
              </button>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 mb-6">
              <ImageGallery images={product.images} dark={dark} />

              <div className="flex flex-col gap-4">
                {/* Description */}
                <div className="rounded-[3px] p-5" style={{ background: T.cardBg, boxShadow: T.shadow }}>
                  <FL dark={dark}>Description</FL>
                  <p className="text-[13px] leading-relaxed"
                    style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {product.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Variants',     value: totalVariants, warn: false, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /> },
                    { label: 'Total Stock',  value: totalStock,    warn: false, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
                    { label: 'Out of Stock', value: outOfStock,    warn: outOfStock > 0, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
                  ].map(({ label, value, warn, icon }) => (
                    <div key={label} className="rounded-[3px] p-3 flex flex-col gap-1.5 transition-all hover:scale-[1.02]"
                      style={{ background: T.cardBg, boxShadow: T.shadow }}>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center"
                        style={{ background: warn ? T.redBg : T.accentDim }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          style={{ color: warn ? T.redText : '#E87040' }}>
                          {icon}
                        </svg>
                      </div>
                      <p className="text-[22px] font-extrabold leading-none"
                        style={{ fontFamily: 'Epilogue, sans-serif', color: warn ? T.redText : T.headText }}>
                        {value}
                      </p>
                      <p className="text-[9.5px] uppercase tracking-[0.08em]"
                        style={{ color: T.mutedText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Product ID */}
                <div className="rounded-[3px] px-4 py-3 flex items-center justify-between gap-4"
                  style={{ background: T.cardBg2, border: `1px solid ${T.border}` }}>
                  <div className="min-w-0">
                    <p className="text-[10.5px] uppercase tracking-[0.1em] mb-1 font-semibold"
                      style={{ color: T.mutedText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Product ID</p>
                    <p className="text-[12px] font-medium truncate"
                      style={{ color: T.subText, fontFamily: 'monospace' }}>{product._id}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(product._id); showToast('ID copied!') }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-[3px] text-[12px] font-semibold hover:opacity-75 transition-opacity"
                    style={{ background: T.accentDim, color: '#E87040', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* ══ VARIANTS SECTION ══ */}
            <div className="mt-12">
              <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[32px] font-extrabold uppercase tracking-[0.01em] sm:text-[42px]"
                  style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>
                  Variants & Inventory
                </h2>
                <button onClick={() => { setEditingVariant(null); setShowVariantModal(true) }}
                  className="inline-flex w-fit items-center gap-2.5 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white
                    flex-shrink-0 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: '#4A3222', fontFamily: 'Epilogue, sans-serif' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Variant
                </button>
              </div>

              <div>
                {product?.variant?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-20 gap-y-12 lg:grid-cols-2">
                    {product.variant?.map((v, i) => (
                      <VariantCard key={v._id || i} variant={v} dark={dark}
                        onEditClick={(vr) => { setEditingVariant(vr); setShowVariantModal(true) }}
                        onDeleteClick={(vr) => { setSelVariant(vr); setShowDelete(true) }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-[3px] flex items-center justify-center mb-5"
                      style={{ background: T.accentDim }}>
                      <svg className="w-10 h-10 text-[#E87040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-[18px] font-bold mb-2"
                      style={{ fontFamily: 'Epilogue, sans-serif', color: T.headText }}>No variants yet</h3>
                    <p className="text-[13px] max-w-sm mb-6"
                      style={{ color: T.subText, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      Add color variants with images, stock levels, and pricing.
                    </p>
                    <button onClick={() => { setEditingVariant(null); setShowVariantModal(true) }}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-[3px] text-[14px] font-bold text-white"
                      style={{ background: '#E87040', fontFamily: 'Epilogue, sans-serif',
                        boxShadow: '0 4px 16px rgba(232,112,64,0.30)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create First Variant
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="h-12" />
          </>
        )}
      </div>
    </div>
  )
}

export default SellerProductDetails
