'use client';

import dynamic from 'next/dynamic';
import { useLanguage } from '../context/LanguageContext';
import ContactForm from './ContactForm';

const ContactMapBackground = dynamic(() => import('./ContactMapBackground'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse"></div>
});

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative min-h-[700px] flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <ContactMapBackground />
        {/* Overlay to mute the map slightly */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all hover:scale-[1.005]">
          {/* Contact Info Side */}
          <div className="w-full md:w-2/5 bg-primary/90 text-white p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold font-serif mb-2">{t.contactTitle}</h3>
              <div className="w-12 h-1 bg-accent mb-6 rounded-full"></div>
              <p className="text-gray-200 mb-8 leading-relaxed">
                {t.contactText}
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center flex-shrink-0 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">+91 98765 43210</p>
                    <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">Available Mon-Sat, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white/10 group-hover:bg-accent/20 transition-colors flex items-center justify-center flex-shrink-0 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">info@realestate.com</p>
                    <p className="text-xs text-gray-300 uppercase tracking-wider mt-1">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12">
              <div className="flex gap-4">
                {/* WhatsApp - Only keeping this one */}
                <a href="https://wa.me/918668214431" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white group">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 14C16.31 13.86 15.09 13.26 14.87 13.18C14.63 13.1 14.47 13.06 14.3 13.31C14.14 13.57 13.67 14.11 13.53 14.27C13.38 14.44 13.24 14.46 13 14.34C12.74 14.21 11.94 13.95 10.98 13.1C10.23 12.43 9.73 11.61 9.58 11.35C9.43 11.09 9.57 10.95 9.7 10.82C9.8 10.7 9.92 10.53 10.05 10.38C10.18 10.23 10.23 10.12 10.31 9.96C10.39 9.8 10.35 9.66 10.28 9.54C10.21 9.4 9.71 8.17 9.5 7.67C9.3 7.18 9.09 7.25 8.94 7.24L8.53 7.33Z" />
                  </svg>
                  <span className="font-semibold group-hover:underline decoration-white/50 underline-offset-4">Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-3/5 p-8 md:p-12 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            <h4 className="text-3xl font-bold text-gray-800 mb-6 font-serif">Send us a Message</h4>
            {/* Pass transparent class to make the form blend in */}
            <ContactForm className="!bg-transparent !p-0 !shadow-none !border-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
