'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import siteContent from '@/data/siteContent.json';

export default function Contact() {
  const { contact } = siteContent;
  return (
    <section id="contact" className="relative min-h-[50vh] bg-black text-white flex items-end">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Desktop Footer Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="w-full h-full bg-cover bg-center hidden md:block"
          style={{ backgroundImage: "url('/Footer.png')" }}
        ></motion.div>
        {/* Mobile Footer Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="w-full h-full bg-cover bg-center md:hidden"
          style={{ backgroundImage: "url('/mobile footer.png')" }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-10 pt-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-5xl md:text-8xl font-light mb-8">Let's Talk.</h2>
          <form className="flex flex-col gap-6 max-w-md">
            <input type="text" placeholder="Name" className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-white placeholder-white/50 transition-colors" />
            <input type="email" placeholder="Email" className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-white placeholder-white/50 transition-colors" />
            <textarea placeholder="Tell us about your project" rows={3} className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-white placeholder-white/50 transition-colors resize-none"></textarea>
            <button type="submit" className="self-start mt-4 border border-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white hover:text-black transition-colors">Submit</button>
          </form>
        </div>

        <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-6 text-white/80 font-light">
          <div className="text-left md:text-right">
            <h3 className="text-xs tracking-[0.3em] uppercase text-white font-semibold mb-4">Inquiries</h3>
            <a href={`mailto:${contact.inquiryEmail || "loveshgarg@gmail.com"}`} className="text-xl font-medium hover:text-white transition-colors block mb-2">
              {contact.inquiryEmail || "loveshgarg@gmail.com"}
            </a>
            <a href={`tel:${(contact.inquiryPhone || "+91 9999710103").replace(/\s/g, '')}`} className="text-lg hover:text-white transition-colors block">
              {contact.inquiryPhone || "+91 9999710103"}
            </a>
          </div>

          <div className="text-left md:text-right mt-4">
            <h3 className="text-xs tracking-[0.3em] uppercase text-white font-semibold mb-4">Studio</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {contact.studioAddress || "123 Design Avenue, 4th Floor\nNew Delhi, India 110001"}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest mt-8 font-semibold">
            {Array.isArray((contact as any).socialLinks) && (contact as any).socialLinks.length > 0 ? (
              (contact as any).socialLinks.map((item: any) => {
                if (!item.url || item.url === '#') return null;
                return (
                  <a
                    key={item.id || item.platform}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors"
                  >
                    {item.platform}
                  </a>
                );
              })
            ) : (
              <>
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Instagram</a>
                )}
                {contact.linkedin && contact.linkedin !== '#' && (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">LinkedIn</a>
                )}
                {contact.whatsapp && (
                  <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">WhatsApp</a>
                )}
              </>
            )}
          </div>
          
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50 font-medium">
            <p>{contact.copyright || "© 2026 Ar. Lovesh Garg. All rights reserved."}</p>
            <Link href="/admin" className="text-white/20 hover:text-white/60 transition-colors tracking-widest uppercase text-[10px]">
              Studio Portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
