import {useTranslations} from 'next-intl';
import Image from 'next/image';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import PartnersCarousel from '@/components/PartnersCarousel';
import Link from 'next/link';

function HeroSection() {
  const t = useTranslations('hero');
  return (
    <section className="relative min-h-[70vh] py-[75px] bg-gradient-to-br from-[#e6f7ff] to-white overflow-hidden">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 relative z-10 -mt-16">
            <h1 className="text-5xl font-bold mb-6 text-[#004085] leading-tight">
              {t('title')}
            </h1>
            <p className="text-xl leading-relaxed text-gray-700 max-w-[90%]">
              {t('description')}
            </p>
          </div>
          <div className="lg:w-1/2 relative min-h-[450px] -mt-16">
            <Image src="/images/ovalimg1.jpg" alt="" width={300} height={300}
              className="absolute rounded-full border-[5px] border-white shadow-lg object-cover w-[300px] h-[300px] top-[10%] right-[10%] z-10 hover:scale-105 transition-transform duration-500" />
            <Image src="/images/ovalimg2.jpg" alt="" width={270} height={270}
              className="absolute rounded-full border-[5px] border-white shadow-lg object-cover w-[270px] h-[270px] top-[45%] right-[30%] z-[11] hover:scale-105 transition-transform duration-500" />
            <Image src="/images/ovalimg3.jpg" alt="" width={240} height={240}
              className="absolute rounded-full border-[5px] border-white shadow-lg object-cover w-[240px] h-[240px] top-[20%] right-0 z-[12] hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({locale}: {locale: string}) {
  const t = useTranslations('aboutSection');
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 lg:pr-12">
            <Image src="/images/onaltumain.jpg" alt="Association" width={600} height={400}
              className="rounded-lg shadow-lg w-full" />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">{t('title')}</h2>
            <p className="text-lg leading-relaxed mb-4">{t('lead')}</p>
            <p className="mb-6">{t('body')}</p>
            <div className="flex gap-3">
              <Link href={`/${locale}/about`} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                {t('learnMore')}
              </Link>
              <Link href={`/${locale}/membership`} className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                {t('joinAssociation')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionSection({locale}: {locale: string}) {
  const t = useTranslations('mission');
  const icons = ['fa-lock-open', 'fa-handshake', 'fa-balance-scale', 'fa-chart-line', 'fa-graduation-cap'];
  const values: string[] = t.raw('values');

  return (
    <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden min-h-[90vh]">
      <div className="absolute top-[10%] left-[5%] opacity-5 text-[10rem] rotate-[15deg]">
        <i className="fas fa-bullseye" />
      </div>
      <div className="absolute bottom-[10%] right-[5%] opacity-5 text-[8rem] -rotate-[20deg]">
        <i className="fas fa-hands-helping" />
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#2c3e50] mb-10 -mt-10 section-title-underline centered">
          {t('sectionTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-lg p-10 h-[90%] transition-all duration-400 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden border-b-4 border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[#3498db] before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100 group">
            <h3 className="text-2xl font-bold mb-5 text-[#2c3e50] text-center pb-8">{t('missionTitle')}</h3>
            <div className="text-lg leading-relaxed text-[#34495e]">
              <p>{t('missionText')}</p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl shadow-lg p-10 h-[90%] transition-all duration-400 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden border-b-4 border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[#e74c3c] before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100">
            <h3 className="text-2xl font-bold mb-5 text-[#2c3e50] text-center pb-8">{t('valuesTitle')}</h3>
            <ul className="values-list">
              {values.map((v: string, i: number) => (
                <li key={i}><i className={`fas ${icons[i]} mr-2`} /> {v}</li>
              ))}
            </ul>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-2xl shadow-lg p-10 h-[90%] transition-all duration-400 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden border-b-4 border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[#27ae60] before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100">
            <h3 className="text-2xl font-bold mb-5 text-[#2c3e50] text-center pb-8">{t('goalsTitle')}</h3>
            <div className="text-lg leading-relaxed text-[#34495e]">
              <p>{t('goalsText')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-8 mb-10">
        <Link href={`/${locale}/about`} className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
          {t('learnMore')}
        </Link>
      </div>
    </section>
  );
}

function MembershipSection() {
  const t = useTranslations('membership');
  const benefits: Array<{icon: string; title: string; description: string; highlight: string}> = t.raw('benefits');

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-5 text-[#2c3e50]">{t('sectionTitle')}</h2>
          <p className="text-lg text-gray-500 max-w-[700px] mx-auto">{t('subtitle')}</p>
        </div>
        <div className="flex flex-wrap justify-between gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl flex-1 basis-[calc(33%-30px)] max-w-[calc(33%-30px)] flex flex-col transition-all duration-400 hover:-translate-y-2.5 hover:shadow-xl min-w-[280px]">
              <div className="text-5xl mx-auto mt-8 mb-5">{b.icon}</div>
              <div className="px-8 pb-8 text-center flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-[#2c3e50] min-h-[60px]">{b.title}</h3>
                <p className="text-lg leading-relaxed text-gray-600 mb-5">{b.description}</p>
                <div className="mt-auto py-2.5 px-4 bg-gray-50 rounded-lg font-medium text-blue-600">
                  {b.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const t = useTranslations('faq');
  const items: Array<{question: string; answer: string}> = t.raw('items');

  return (
    <section className="py-12 px-4 md:px-24">
      <h3 className="text-2xl font-bold text-center mb-8">{t('title')}</h3>
      <div className="max-w-4xl mx-auto space-y-4">
        {items.map((item, i) => (
          <details key={i} className="border border-gray-200 rounded-lg" open={i === 0}>
            <summary className="px-6 py-4 cursor-pointer font-medium text-lg hover:bg-gray-50 transition-colors">
              {item.question}
            </summary>
            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return (
    <>
      <TopBar />
      <Navbar />
      <HeroSection />
      <AboutSection locale={locale} />
      <PartnersCarousel />
      <MissionSection locale={locale} />
      <MembershipSection />
      <FAQSection />
      <Footer />
      <ScrollToTop />
    </>
  );
}
