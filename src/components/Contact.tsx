'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import siteContent from '@/data/siteContent.json';

export default function Contact() {
  const { contact } = siteContent;
  const footer = (siteContent as any).footer || {};
  const formConfig = footer.form || {};

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const getCleanBgUrl = (bgPath: string, fallback: string) => {
    const raw = bgPath || fallback;
    return encodeURI(decodeURI(raw));
  };

  const desktopBg = getCleanBgUrl(footer.desktopBackground, '/Footer.png');
  const mobileBg = getCleanBgUrl(footer.mobileBackground, '/mobile footer.png');
  const headingText = footer.heading || "Let's Talk.";
  const submitText = formConfig.submitButtonText || footer.submitButtonText || "Submit";
  const copyrightText = footer.copyright || (contact as any).copyright || "© 2026 Ar. Lovesh Garg. All rights reserved.";

  const namePlaceholder = formConfig.namePlaceholder || "Name";
  const emailPlaceholder = formConfig.emailPlaceholder || "Email";
  const phonePlaceholder = formConfig.phonePlaceholder || "Phone Number (Optional)";
  const showPhone = formConfig.showPhone !== false;
  const messagePlaceholder = formConfig.messagePlaceholder || "Tell us about your project";
  const formSubtitle = formConfig.subtitle || "";
  const successMessage = formConfig.successMessage || "Thank you for reaching out. Our studio team will get back to you shortly.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Network error submitting inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          style={{ backgroundImage: `url("${desktopBg}")` }}
        ></motion.div>
        {/* Mobile Footer Background */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="w-full h-full bg-cover bg-center md:hidden"
          style={{ backgroundImage: `url("${mobileBg}")` }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-10 pt-16 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-5xl md:text-8xl font-light mb-8">{headingText}</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.04] border border-amber-400/30 rounded-2xl p-6 sm:p-8 max-w-md space-y-4 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-lg font-bold">
                ✓
              </div>
              <h3 className="text-xl font-serif text-white">Inquiry Received</h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {successMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="text-xs uppercase tracking-widest text-amber-400 hover:text-amber-300 font-semibold pt-2 block transition-colors cursor-pointer"
              >
                ← Send another inquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
              {formSubtitle && (
                <p className="text-xs text-white/50 tracking-wider font-light -mt-2">
                  {formSubtitle}
                </p>
              )}
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={namePlaceholder} 
                className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-amber-400 placeholder-white/50 text-white text-sm transition-colors" 
              />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder} 
                className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-amber-400 placeholder-white/50 text-white text-sm transition-colors" 
              />
              {showPhone && (
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={phonePlaceholder} 
                  className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-amber-400 placeholder-white/50 text-white text-sm transition-colors" 
                />
              )}
              <textarea 
                required
                rows={3} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={messagePlaceholder} 
                className="bg-transparent border-b border-white/20 py-4 outline-none focus:border-amber-400 placeholder-white/50 text-white text-sm transition-colors resize-none"
              ></textarea>
              {errorMessage && (
                <p className="text-xs text-red-400 font-medium -mt-2">{errorMessage}</p>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="self-start mt-4 border border-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-white hover:text-black transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : submitText}
              </button>
            </form>
          )}
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
            <p>{copyrightText}</p>
            <Link href="/admin" className="text-white/20 hover:text-white/60 transition-colors tracking-widest uppercase text-[10px]">
              Studio Portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
