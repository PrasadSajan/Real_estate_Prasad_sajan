'use client';

import { useLanguage } from '../context/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-gray-50 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-primary font-serif">{t.contactTitle}</h2>
        <p className="text-center text-lg mb-12 text-gray-600 font-light">{t.contactText}</p>

        <form className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">{t.contactName}</label>
              <input type="text" id="name" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent transition duration-300" placeholder={t.contactName} />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">{t.contactEmail}</label>
              <input type="email" id="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent transition duration-300" placeholder={t.contactEmail} />
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2 uppercase tracking-wide">{t.contactMessage}</label>
            <textarea id="message" rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent transition duration-300" placeholder={t.contactMessage}></textarea>
          </div>
          <div className="text-center">
            <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-4 px-12 rounded-full shadow-lg transform hover:-translate-y-1 transition duration-300 uppercase tracking-widest text-sm">
              {t.contactButton}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
