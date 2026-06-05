import re

with open('/Users/raj/Desktop/webD/Snitch/server/src/controllers/product.controller.js', 'r') as f:
    content = f.read()

# Update createProductController
new_controller = """
export const createProductController = async (req, res)=>{
  const {title, description, priceAmount, priceCurrency, imageAlts, stock, attributes} = req.body

  const seller = req.user
  const alts = Array.isArray(imageAlts) ? imageAlts : [imageAlts]

  let parsedAttributes = {}
  try {
    if (attributes) {
      parsedAttributes = JSON.parse(attributes)
    }
  } catch (error) {
    console.error("Error parsing attributes", error)
  }

  const images = await Promise.all(req.files.map( async (file, index)=>{
    const uploadedImage = await uploadFile({
      buffer: file.buffer,
      filename: file.originalname
    })

    return {
      url: uploadedImage.url,
      alt: alts[index] || title
    }
  }))

  const product = await productModel.create({
    title,
    description,
    price: {
      amount : priceAmount,
      currency : priceCurrency || "INR"
    },
    images,
    stock: stock ? Number(stock) : 0,
    attributes: parsedAttributes,
    seller: seller._id
  })

  return res.status(201).json({
    message: "product created successfully",
    sucess: true,
    product,
  })
}
"""

content = re.sub(
    r'export const createProductController = async \(req, res\)=>\{.*?return res.status\(201\).json\(\{.*?\}\)\n\}',
    new_controller.strip(),
    content,
    flags=re.DOTALL
)

with open('/Users/raj/Desktop/webD/Snitch/server/src/controllers/product.controller.js', 'w') as f:
    f.write(content)
