import React from 'react'

const Footer = () => {
  const columns = [
    { title: 'Shop', links: ['Men', 'Women', 'New Arrivals', 'Best Sellers', 'Sale'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Sustainability', 'Stores'] },
    { title: 'Support', links: ['Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'FAQs'] },
  ]

  const socials = [
    { name: 'Instagram', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /> },
    { name: 'Twitter', icon: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /> },
    { name: 'Pinterest', icon: <path d="M8 12a4 4 0 1 1 8 0c0 2.5-1.5 5-4 5s-2-1-2-1l-1 4H7l1.5-5.5" /> },
  ]

  return (
    <footer id="site-footer" className="bg-charcoal text-white/80">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Main Footer */}
        <div className="py-16 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-display text-2xl tracking-[0.15em] text-white font-medium">
              SNITCH
            </a>
            <p className="mt-5 text-sm leading-relaxed text-white/50 max-w-[260px]">
              Premium fashion crafted for modern confidence. Designed to elevate your everyday.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-7">
              {socials.map(s => (
                <a key={s.name} href="#" aria-label={s.name} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:border-terracotta hover:text-terracotta transition-all duration-300">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="font-body text-[12px] tracking-[0.12em] uppercase text-white/40 font-semibold mb-6">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-[14px] text-white/60 hover:text-terracotta-light transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30 tracking-wide">
            © 2025 SNITCH. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" className="text-[12px] text-white/30 hover:text-white/60 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
