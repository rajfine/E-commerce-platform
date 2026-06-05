import re

with open('/Users/raj/Desktop/webD/Snitch/client/src/features/products/pages/SellerProductDetails.jsx', 'r') as f:
    content = f.read()

# Replace AddVariantModal definition
content = content.replace(
    "const AddVariantModal = ({ dark, onClose, onSave, loading }) => {",
    "const VariantModal = ({ dark, onClose, onSave, loading, variant }) => {"
)

# Insert useEffect to prefill data
prefill_code = """
  useEffect(() => {
    if (variant) {
      if (variant.price) setPriceAmount(variant.price)
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
"""

content = content.replace(
    "const [errors, setErrors]           = useState({})",
    "const [errors, setErrors]           = useState({})\n  const [sizeStocks, setSizeStocks]   = useState({})\n" + prefill_code
)

# Update buildFd
new_buildFd = """
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
"""

content = re.sub(
    r'/\* Build single FormData \*/.*?return fd\n  }',
    '/* Build single FormData */' + new_buildFd,
    content,
    flags=re.DOTALL
)

# Update title
content = content.replace(
    "Add Variant\n            </h3>",
    "{variant ? 'Edit Variant' : 'Add Variant'}\n            </h3>"
)

# Update validation
content = content.replace(
    "if (+stock < 0)\n      e.stock = 'Stock cannot be negative.'",
    ""
)

# Remove global stock input
content = re.sub(
    r'\{\/\* Stock per size \*\/\}.*?min=\{0\} \/\>\n              \<\/div\>',
    '',
    content,
    flags=re.DOTALL
)

# Add per-size stock inputs below size chips
per_size_ui = """
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
"""

content = content.replace(
    "{errors.sizes && (",
    per_size_ui + "\n            {errors.sizes && ("
)

with open('/Users/raj/Desktop/webD/Snitch/client/src/features/products/pages/SellerProductDetails.jsx', 'w') as f:
    f.write(content)
