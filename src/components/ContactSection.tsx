'use client';

import { useLanguage } from '../context/LanguageContext';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold text-center mb-8">{t.contactTitle}</h2>
      <p className="text-center text-lg mb-8">{t.contactText}</p>
      <form className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">{t.contactName}</label>
          <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder={t.contactName} />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">{t.contactEmail}</label>
          <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder={t.contactEmail} />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">{t.contactMessage}</label>
          <textarea id="message" rows={5} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder={t.contactMessage}></textarea>
        </div>
        <div className="flex items-center justify-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300">
            {t.contactButton}
          </button>
        </div>
      </form>
    </section>
  );
}
