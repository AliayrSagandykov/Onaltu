'use client';

import {useTranslations} from 'next-intl';
import YandexMap from './YandexMap';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#2c3e50] text-[#ecf0f1] pt-16 pb-6 text-[0.95rem]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map */}
          <div>
            <div className="footer-map-container">
              <div id="footer-map" />
            </div>
            <YandexMap />
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[50px] after:h-[2px] after:bg-[#3498db]">
              {t('addressTitle')}
            </h4>
            <div className="flex items-start gap-3 mb-4">
              <i className="fas fa-map-marker-alt text-[#3498db] mt-1 w-5 text-center" />
              <div>
                {t('addressLine1')}<br />
                {t('addressLine2')}
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[50px] after:h-[2px] after:bg-[#3498db]">
              {t('contactsTitle')}
            </h4>
            <div className="flex items-start gap-3 mb-4">
              <i className="fas fa-phone-alt text-[#3498db] mt-1 w-5 text-center" />
              <div>
                <strong>{t('phoneLabel')}</strong><br />
                {t('phone1')}<br />
                {t('phone2')}
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <i className="fas fa-envelope text-[#3498db] mt-1 w-5 text-center" />
              <div>
                <strong>{t('emailLabel')}</strong><br />
                {t('email')}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              {['facebook-f', 'instagram', 'youtube', 'telegram-plane'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#3498db] hover:-translate-y-1 transition-all"
                >
                  <i className={`fab fa-${icon}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-5 mt-10 text-[0.9rem] text-[#95a5a6]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>{t('copyright')}</div>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:onaltu.kory@gmail.com" className="text-[#3498db] hover:underline">{t('email')}</a>
              <a href="https://www.nccr.kz/" className="text-[#3498db] hover:underline">www.nccr.kz</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
