import re

with open('/Users/raj/Desktop/webD/Snitch/client/src/features/products/pages/SellerProductDetails.jsx', 'r') as f:
    content = f.read()

# Update VariantCard props and button
content = content.replace(
    "const VariantCard = ({ variant, dark, onStockClick, onDeleteClick }) => {",
    "const VariantCard = ({ variant, dark, onEditClick, onDeleteClick }) => {"
)
content = content.replace(
    "<button type=\"button\" onClick={() => onStockClick(variant)}",
    "<button type=\"button\" onClick={() => onEditClick(variant)}"
)
content = content.replace(
    "Current Stock",
    "Edit Variant"
)
content = content.replace(
    "title=\"Manage Stock\">",
    "title=\"Edit Variant\">"
)
content = content.replace(
    "<button onClick={() => onStockClick(variant)} title=\"Manage Stock\"",
    "<button onClick={() => onEditClick(variant)} title=\"Edit Variant\""
)

# Update SellerProductDetails state
content = content.replace(
    "const [showAdd, setShowAdd]       = useState(false)",
    "const [showVariantModal, setShowVariantModal] = useState(false)\n  const [editingVariant, setEditingVariant] = useState(null)"
)
# We don't need setShowAdd anymore. So we replace usages of setShowAdd with setShowVariantModal

content = content.replace(
    "onClick={() => setShowAdd(true)}",
    "onClick={() => { setEditingVariant(null); setShowVariantModal(true) }}"
)

# Update handleSaveVariant in SellerProductDetails
new_handleSave = """
  const handleSaveVariant = async (fd) => {
    setActionLoading(true)
    try {
      if (editingVariant) {
         // handle update
         const res = await updateVariant(productId, editingVariant._id, fd)
         setProduct(res.product)
         toast.success('Variant updated')
      } else {
         const res = await addProductVariant(productId, fd)
         setProduct(res.product)
         toast.success('Variant added')
      }
      setShowVariantModal(false)
      setEditingVariant(null)
    } catch (error) {
      toast.error(error.message || 'Failed to save variant')
    } finally {
      setActionLoading(false)
    }
  }
"""

content = re.sub(
    r'const handleSaveVariant = async \(fd\) => \{.*?\n  \}',
    new_handleSave.strip(),
    content,
    flags=re.DOTALL
)

# Update modals section
old_modals = """
      {/* ── Modals ── */}
      {showAdd    && <VariantModal dark={dark} loading={actionLoading} onClose={() => setShowAdd(false)} onSave={handleSaveVariant} />}
      {showStock  && selVariant && <StockModal dark={dark} variant={selVariant} loading={actionLoading}
        onClose={() => { setShowStock(false); setSelVariant(null) }} onSave={handleStockSave} />}
      {/* Stock modal reused for the base product — passes a virtual variant-shaped object */}
"""

new_modals = """
      {/* ── Modals ── */}
      {showVariantModal && <VariantModal dark={dark} variant={editingVariant} loading={actionLoading} onClose={() => { setShowVariantModal(false); setEditingVariant(null) }} onSave={handleSaveVariant} />}
      {/* Stock modal reused for the base product — passes a virtual variant-shaped object */}
"""

content = content.replace(old_modals.strip(), new_modals.strip())
content = content.replace("{showAdd    && <AddVariantModal", "{showVariantModal && <VariantModal")
# Wait, the python script earlier might have renamed it to VariantModal, let's just do a regex replace for the VariantModal rendering

content = re.sub(
    r'\{showAdd\s+&& <VariantModal.*?\/\>',
    '{showVariantModal && <VariantModal dark={dark} variant={editingVariant} loading={actionLoading} onClose={() => { setShowVariantModal(false); setEditingVariant(null) }} onSave={handleSaveVariant} />}',
    content
)

content = re.sub(
    r'\{showStock\s+&&\s+selVariant\s+&&\s+<StockModal\s+dark=\{dark\}\s+variant=\{selVariant\}\s+loading=\{actionLoading\}\s+onClose=\{\(\)\s+=>\s+\{\s+setShowStock\(false\);\s+setSelVariant\(null\)\s+\}\}\s+onSave=\{handleStockSave\}\s+\/>\}',
    '',
    content
)

# Update VariantCard rendering
content = content.replace(
    "onStockClick={(vr) => { setSelVariant(vr); setShowStock(true) }}",
    "onEditClick={(vr) => { setEditingVariant(vr); setShowVariantModal(true) }}"
)

with open('/Users/raj/Desktop/webD/Snitch/client/src/features/products/pages/SellerProductDetails.jsx', 'w') as f:
    f.write(content)
