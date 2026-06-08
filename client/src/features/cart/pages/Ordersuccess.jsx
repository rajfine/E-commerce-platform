import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Ordersuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get("paymentId")
    const orderId = queryParams.get("orderId")

  return (
    <main className="min-h-screen bg-ivory text-charcoal pt-32 pb-24 px-4 md:px-8 flex flex-col items-center justify-center font-body animate-fade-in">
      <div className="max-w-4xl w-full text-center space-y-8 mt-10">
        
        {/* Animated Success Mark */}
        <div className="flex justify-center mb-12">
          <div className="relative h-24 w-24 flex items-center justify-center rounded-full border border-border">
            <span className="text-5xl text-terracotta">✓</span>
            <div className="absolute inset-0 border border-terracotta/40 rounded-full animate-ping opacity-25"></div>
          </div>
        </div>

        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest text-charcoal mb-4">
            Order Placed Successfully!
        </h1>
        <p className="text-muted max-w-2xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
            Your sartorial selection has been secured. We are currently preparing your pieces with the utmost care at our central atelier.
        </p>

        {/* Order Details Bento Card */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-2xl mx-auto overflow-hidden">
          <div className="bg-surface p-8 text-left">
            <span className="text-[10px] uppercase tracking-widest text-muted block mb-2">Order Identification</span>
            <span className="text-lg font-medium text-charcoal tracking-tight">#{orderId}</span>
          </div>
          <div className="bg-surface p-8 text-left">
            <span className="text-[10px] uppercase tracking-widest text-muted block mb-2">Payment Reference</span>
            <span className="text-lg font-medium text-charcoal tracking-tight">{paymentId}</span>
          </div>
        </div>

        {/* Transaction Image Placeholder */}
        <div className="mt-12 h-64 w-full max-w-3xl mx-auto overflow-hidden relative group">
          <img alt="Order Confirmed" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJOwxa-wnhhc-ltyRMFtuFtZ8ESWObEwqHO7IQeVc8Tu-CImx2UEqcu9YccorYNMdWmVPeWFvL5b4SnMW1Iy1mcdG7siEBH4MLuO0L0khlebaHDWOvDfvmk6mC4MsnCORIsfSxzePeiZ0yDGTeDvPkKawsRMR7M-xtrRyAMdajl48iuwh2jjO1IUoTrlUOkFu9nKc_p7R15yGRpqEfSQSGfZR8qrto3PqMUXXo3245Fgx_mEDyZPCuaSoCz4DesQ9qf7BBuN2VyvU"/>
          <div className="absolute inset-0 bg-charcoal/5"></div>
        </div>

        {/* CTA Section */}
        <div className="pt-12 flex flex-col items-center gap-6">
          <button onClick={() => navigate("/")} className="w-full md:w-auto px-12 py-5 bg-terracotta text-ivory text-[10px] uppercase tracking-[0.2em] hover:bg-terracotta-dark transition-all duration-300 font-semibold flex items-center justify-center gap-2 group">
              Continue Shopping
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button className="text-[10px] uppercase tracking-widest text-muted hover:text-charcoal transition-colors flex items-center gap-2">
              ✉ Review Order Receipt
          </button>
        </div>
      </div>
    </main>
  )
}

export default Ordersuccess