import React, { useEffect } from 'react'
import { useCart } from '../hook/useCart.js'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {useRazorpay} from 'react-razorpay'

const Cart = () => {
  const cart = useSelector(state => state.cart) || []
  const {handleAddItem , handleGetCart, handleUpdateSize, handleRemoveFromCart, handleUpdateQuantity, handleCreateOrder , handleVerifyOrder, handleClearLocalCart} = useCart()
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  const { error, isLoading, Razorpay } = useRazorpay()

  useEffect(()=>{
    handleGetCart()
  },[])

  // Calculate totals
  const subtotal = cart?.cart?.totalPrice
  const shipping = 0 // Free
  const total = subtotal + shipping

  const handleCheckout = async () => {
    const response = await handleCreateOrder()
    const order = response.order;
    const options = {
      key: "rzp_test_SyLSBCgzDGjYLk",
      amount: order.amount, // Amount in paise
      currency: order.currency,
      name: "Snitch",
      description: "Test Transaction",
      order_id: order.id, // Generate order_id on server
      handler: async (response) => {
        const isValid = await handleVerifyOrder(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature)
        if(isValid){
          handleClearLocalCart()
          navigate(`/order-success?orderId=${order.id}&paymentId=${response?.razorpay_payment_id}`)
        }
      },
      prefill: {
        name: user?.name || "test user",
        email: user?.email || "test.doe@example.com",
        contact: user?.contact || "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  return (
    <main className="w-full min-h-screen bg-ivory text-charcoal px-4 md:px-8 pt-24 md:pt-32 pb-16 lg:pb-24 font-body animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex">
          <button 
            onClick={() => navigate(-1)} 
            className="text-xs uppercase tracking-widest text-muted hover:text-charcoal transition-colors flex items-center gap-2"
          >
            ← Back to Shopping
          </button>
        </div>
        <header className="mb-8 md:mb-12 flex items-baseline justify-between border-b border-border pb-4">
          <h1 className="font-display text-2xl uppercase tracking-widest">Shopping Cart</h1>
          <span className="text-xs uppercase tracking-widest text-muted">{cart?.items?.length} {cart?.items?.length === 1 ? 'Item' : 'Items'}</span>
        </header>

      {cart?.items?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted text-base tracking-widest uppercase mb-6">Your cart is empty.</p>
          <a href="/" className="bg-charcoal text-ivory px-6 py-3 text-sm tracking-widest uppercase hover:bg-softblack transition-colors">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {cart?.items?.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-border group">
                <div className="w-full md:w-36 aspect-[3/4] bg-surface overflow-hidden">
                  <img 
                    src={item.variant?.images?.[0]?.url || item.product?.images?.[0]?.url} 
                    alt={item.product?.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-xl uppercase mb-1 tracking-wide">{item.product?.title}</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-muted text-[10px] tracking-widest uppercase">Color: {item.variant?.attributes?.colorName || 'Default'}</p>
                          <p className="text-muted text-[10px] tracking-widest uppercase">Category: {item.variant?.category || item.product?.category}</p>
                        </div>
                        
                        {/* Size Selector */}
                        {item.variant?.attributes?.sizes?.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <label htmlFor={`size-${item._id}`} className="text-muted text-[10px] tracking-widest uppercase">Size:</label>
                            <select 
                              id={`size-${item._id}`}
                              value={item.size || item.variant.attributes.sizes[0].label}
                              onChange={(e) => handleUpdateSize(item._id, e.target.value)}
                              className="bg-transparent border border-charcoal/30 text-charcoal text-[10px] uppercase tracking-widest px-2 py-1 focus:outline-none focus:border-charcoal cursor-pointer appearance-none pr-6 relative"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232c2825'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.25rem center',
                                backgroundSize: '0.75rem'
                              }}
                            >
                              {item.variant.attributes.sizes.map((sizeObj) => (
                                <option key={sizeObj.label} value={sizeObj.label}>
                                  {sizeObj.label} {sizeObj.stock === 0 ? '(Out of Stock)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="font-display text-lg">₹ {item.price?.amount}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 md:mt-0">
                    <div className="flex items-center border border-border h-8 px-3 gap-4">
                      <button 
                        onClick={() => {
                          const newQuantity = item.quantity - 1;
                          if (newQuantity <= 0) {
                            handleRemoveFromCart(item._id);
                          } else {
                            handleUpdateQuantity(item._id, newQuantity);
                          }
                        }}
                        className="text-muted hover:text-charcoal transition-colors focus:outline-none">
                        -
                      </button>
                      <span className="text-xs">{item.quantity}</span>
                      <button 
                        onClick={()=> {
                          handleUpdateQuantity(item._id, item.quantity + 1);
                        }}
                        className="text-muted hover:text-charcoal transition-colors focus:outline-none">
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="text-muted hover:text-terracotta transition-colors uppercase text-[10px] tracking-widest font-semibold flex items-center gap-2">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-surface/30 p-6 md:p-8 border border-border">
              <h2 className="font-display text-xl uppercase tracking-tight mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted uppercase text-[10px] tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-medium">₹ {subtotal}</span>
                </div>
                <div className="flex justify-between text-muted uppercase text-[10px] tracking-widest">
                  <span>Shipping</span>
                  <span className="text-terracotta">Free</span>
                </div>
                <div className="flex justify-between text-muted uppercase text-[10px] tracking-widest">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="font-display text-lg uppercase tracking-tight">Total</span>
                  <span className="font-display text-2xl">₹ {total}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-terracotta text-ivory py-4 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-terracotta-dark transition-all duration-300 flex items-center justify-center gap-2 group">
                Proceed to Checkout
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-muted">
                  <span className="text-[10px]">🔒</span>
                  <p className="text-[10px] uppercase tracking-widest">Secure Checkout</p>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <span className="text-[10px]">📦</span>
                  <p className="text-[10px] uppercase tracking-widest">Express Global Shipping</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 px-2 text-center">
              <p className="text-[10px] text-muted leading-relaxed uppercase tracking-widest">
                Need help? Contact our atelier support at<br/> concierge@snitch.com or call +91 000 000 0000.
              </p>
            </div>
          </aside>
        </div>
      )}
      </div>
    </main>
  )
}

export default Cart