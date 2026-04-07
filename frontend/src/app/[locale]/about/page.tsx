import {useTranslations} from 'next-intl';
import Image from 'next/image';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

function Governance() {
  const t = useTranslations('aboutPage');
  const governance: Array<{title: string; subtitle: string; text: string}> = t.raw('governance');
  const icons = ['fa-users', 'fa-user-tie', 'fa-shield-alt'];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg pt-12 pb-4">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#2a5298] mb-8 pb-2 border-b-2 border-gray-200 section-title-underline" id="rule">
          {t('governanceTitle')}
        </h2>
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          {governance.map((g, i) => (
            <div key={i} className="governance-level w-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[500px] text-center hover:-translate-y-2.5 hover:shadow-xl transition-all duration-400 relative z-10">
                <div className="text-4xl text-[#3498db] mb-4">
                  <i className={`fas ${icons[i]}`} />
                </div>
                <h3 className="text-xl font-bold text-[#2c3e50] mb-2">{g.title}</h3>
                <div className="text-sm text-gray-500 mb-4">{g.subtitle}</div>
                <p className="text-gray-600 mt-5">{g.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
          <div className="font-bold text-[#2a5298]">{t('representationNoteTitle')}:</div>
          <p className="mb-5">{t('representationNote')}</p>
        </div>
      </div>
    </section>
  );
}

function Directions() {
  const t = useTranslations('aboutPage');
  const directions: Array<{title: string; description: string}> = t.raw('directions');

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-[#2a5298] mb-4 pb-2 border-b-2 border-gray-200" id="workDirections">
        {t('professionalTitle')}
      </h2>
      {directions.slice(0, 5).map((d, i) => (
        <div key={i} className="direction-item">
          <div className="min-w-[30px] h-[30px] bg-[#2a5298] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-sm">
            {i + 1}
          </div>
          <div className="flex-grow">
            <div className="font-semibold text-[#1a3e6e] mb-1">{d.title}</div>
            <div className="text-gray-500 text-sm">{d.description}</div>
          </div>
        </div>
      ))}

      <h2 className="text-xl font-semibold text-[#2a5298] mb-4 mt-8 pb-2 border-b-2 border-gray-200">
        {t('educationalTitle')}
      </h2>
      {directions.slice(5).map((d, i) => (
        <div key={i} className="direction-item">
          <div className="min-w-[30px] h-[30px] bg-[#2a5298] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-sm">
            {i + 6}
          </div>
          <div className="flex-grow">
            <div className="font-semibold text-[#1a3e6e] mb-1">{d.title}</div>
            <div className="text-gray-500 text-sm">{d.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Vision() {
  const t = useTranslations('aboutPage');
  const points: string[] = t.raw('visionPoints');

  return (
    <div className="mt-8 p-8">
      <h4 className="text-xl font-bold mb-4" id="vision">{t('visionTitle')}</h4>
      <p className="mb-6">{t('visionText')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <i className="fas fa-check-circle text-green-500 mt-1 text-lg" />
            <div>{p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const t = useTranslations('aboutPage');
  const sidebarLinks: string[] = t.raw('sidebarLinks');
  const anchors = ['#history', '#rule', '#workDirections', '#vision'];

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Intro */}
          <div className="mb-8">
            <div className="rounded-lg overflow-hidden shadow-lg mb-8 hover:scale-[1.02] transition-transform duration-500">
              <Image src="/images/onaltumain.jpg" alt="Main" width={1200} height={500} className="w-full" />
            </div>
            <p className="text-lg leading-relaxed my-8">{t('intro')}</p>
          </div>

          {/* President */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="text-xl font-bold text-blue-800 mb-3">{t('presidentTitle')}</h4>
            <hr className="mb-4" />
            <Image src="/images/Azhar_Giniyat.jpg" alt="President" width={600} height={400} className="rounded-lg mb-3 max-w-[600px] w-full" />
            <p className="text-gray-700">{t('presidentName')}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-semibold text-blue-700 mb-5 pb-2 border-b-2 border-blue-400">
                  {t('sidebarTitle')}
                </h3>
                <ul className="space-y-3">
                  {sidebarLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={anchors[i]}
                        className="block px-4 py-2 rounded font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:pl-5 transition-all"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold text-[#2a5298] mb-6 pb-4 border-b-2 border-gray-200 section-title-underline" id="history">
                {t('historyTitle')}
              </h2>
              <div className="pb-6">
                <p className="mb-4">{t('historyText1')}</p>
                <p>{t('historyText2')}</p>
              </div>

              <Governance />
              <Directions />
              <Vision />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
