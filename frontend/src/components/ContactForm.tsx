'use client';

import {useTranslations} from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contactsPage');
  return (
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
  );
}
