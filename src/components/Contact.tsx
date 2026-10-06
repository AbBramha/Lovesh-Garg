'use client';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section className="relative min-h-[50vh] bg-black text-white flex items-end">
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
            <a href="mailto:hello@loveshgarg.com" className="text-xl font-medium hover:text-white transition-colors block mb-2">hello@loveshgarg.com</a>
            <a href="tel:+919876543210" className="text-lg hover:text-white transition-colors block">+91 98765 43210</a>
          </div>

          <div className="text-left md:text-right mt-4">
            <h3 className="text-xs tracking-[0.3em] uppercase text-white font-semibold mb-4">Studio</h3>
            <p className="text-sm leading-relaxed">
              123 Design Avenue, 4th Floor<br/>
              New Delhi, India 110001
            </p>
          </div>

          <div className="flex gap-6 text-xs uppercase tracking-widest mt-8 font-semibold">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
          
          <p className="mt-8 text-xs text-white/50 font-medium">© 2026 Ar. Lovesh Garg. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
