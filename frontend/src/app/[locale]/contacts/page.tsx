'use client';

import {useTranslations} from 'next-intl';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function ContactsPage() {
  const t = useTranslations('contactsPage');
  const contacts: Array<{name: string; position: string; phone: string; phoneRaw: string}> = t.raw('contacts');
  const meta = t.raw('meta') as {address: string; email: string; hours: string};

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
  };

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a6aa2] mt-6 ml-0 md:ml-12">{t('title')}</h1>
          <p className="text-[#1a6aa2] ml-0 md:ml-12 mt-2">{t('subtitle')}</p>
        </div>

        <div className="p-4 md:p-10 bg-white">
          {/* Contact cards */}
          {contacts.map((c, i) => (
            <div key={i} className="bg-white rounded-lg p-6 mb-6 shadow-sm border-l-4 border-[#1a6aa2] hover:-translate-y-1 hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold text-[#2a5298] mb-2">{c.name}</h3>
              <div className="text-gray-500 mb-4 text-lg">{c.position}</div>
              <div className="flex items-center gap-2 mb-1 text-lg">
                <i className="fas fa-phone-alt text-[#1a6aa2] w-6 text-center" />
                <span className="font-medium text-gray-800">{c.phone}</span>
              </div>
              <div className="flex gap-3 mt-5">
                <a
                  href={`tel:${c.phoneRaw}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-phone" /> {t('call')}
                </a>
                <button
                  onClick={() => copyPhone(c.phoneRaw)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-copy" /> {t('copy')}
                </button>
              </div>
            </div>
          ))}

          {/* Meta info */}
          <div className="mt-10 pt-5 border-t border-gray-200">
            <p className="flex items-center gap-2 mb-3">
              <i className="fas fa-map-marker-alt text-[#1a6aa2] w-6 text-center" /> {meta.address}
            </p>
            <p className="flex items-center gap-2 mb-3">
              <i className="fas fa-envelope text-[#1a6aa2] w-6 text-center" /> {meta.email}
            </p>
            <p className="flex items-center gap-2 mb-3">
              <i className="fas fa-clock text-[#1a6aa2] w-6 text-center" /> {meta.hours}
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="p-4 md:p-10 mt-4">
          <h2 className="text-2xl font-semibold text-[#2a5298] mb-8 pb-4 border-b-2 border-gray-200 section-title-underline">
            {t('formTitle')}
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-[#2a5298]">{t('formName')}</label>
              <input type="text" className="w-full p-3.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a6aa2] focus:ring-[3px] focus:ring-blue-100 transition" required />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-[#2a5298]">{t('formEmail')}</label>
              <input type="email" className="w-full p-3.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a6aa2] focus:ring-[3px] focus:ring-blue-100 transition" required />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-[#2a5298]">{t('formPhone')}</label>
              <input type="tel" className="w-full p-3.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a6aa2] focus:ring-[3px] focus:ring-blue-100 transition" />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-[#2a5298]">{t('formMessage')}</label>
              <textarea className="w-full p-3.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#1a6aa2] focus:ring-[3px] focus:ring-blue-100 transition min-h-[120px] resize-y" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg transition-all">
              <i className="fas fa-paper-plane mr-2" /> {t('formSubmit')}
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
