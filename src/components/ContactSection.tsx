'use client';

import { useLanguage } from '../context/LanguageContext';
import ContactForm from './ContactForm';

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="bg-gray-50 py-20 px-4">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Contact Info Side */}
          <div className="w-full md:w-2/5 bg-primary p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold font-serif mb-6">{t.contactTitle}</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {t.contactText}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg">+91 98765 43210</p>
                    <p className="text-sm text-gray-400">Available Mon-Sat, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg">info@realestate.com</p>
                    <p className="text-sm text-gray-400">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-sm text-gray-400 opacity-60">
                Note: Your details are kept confidential.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <h4 className="text-2xl font-bold text-gray-800 mb-6 font-serif">Send us a Message</h4>
            <ContactForm className="!p-0 !shadow-none !border-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
