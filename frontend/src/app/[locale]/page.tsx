import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import PartnersCarousel, {type PartnerItem} from '@/components/PartnersCarousel';
import FAQSection from '@/components/FAQSection';
import Link from 'next/link';
import {getContents} from '@/lib/pageContent';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';

export const dynamic = 'force-dynamic';

type C = Record<string, string>;

const DEFAULT_PARTNERS: PartnerItem[] = [
  {src: 'https://www.nccr.kz/images/banners/logo.png', alt: 'NCCR'},
  {src: '/images/AqbulakNCCR.jpg', alt: 'Aqbulak'},
  {src: 'https://altynshipager.kz/rehabilitation-conference/assets/img/favicon.png', alt: 'Altyn Shipager'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+4', alt: 'Partner 4'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+5', alt: 'Partner 5'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+6', alt: 'Partner 6'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+7', alt: 'Partner 7'},
  {src: 'https://via.placeholder.com/200x100?text=Partner+8', alt: 'Partner 8'},
];

function HeroSection({locale, c}: {locale: string; c: C}) {
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
            <EditableText contentKey="hero.title" locale={locale} value={c['hero.title']} tag="h1" className="text-5xl font-bold mb-6 text-[#004085] leading-tight" />
            <EditableText contentKey="hero.description" locale={locale} value={c['hero.description']} multiline tag="p" className="text-xl leading-relaxed text-gray-700 max-w-[90%]" />
          </div>
          <div className="lg:w-1/2 relative min-h-[450px] -mt-16">
            <div className="absolute top-[10%] right-[10%] z-10">
              <EditableImage contentKey="hero.img1" locale={locale} src={c['hero.img1']} alt="" width={300} height={300}
                className="rounded-full border-[5px] border-white shadow-lg object-cover w-[300px] h-[300px] hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute top-[45%] right-[30%] z-[11]">
              <EditableImage contentKey="hero.img2" locale={locale} src={c['hero.img2']} alt="" width={270} height={270}
                className="rounded-full border-[5px] border-white shadow-lg object-cover w-[270px] h-[270px] hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="absolute top-[20%] right-0 z-[12]">
              <EditableImage contentKey="hero.img3" locale={locale} src={c['hero.img3']} alt="" width={240} height={240}
                className="rounded-full border-[5px] border-white shadow-lg object-cover w-[240px] h-[240px] hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({locale, c}: {locale: string; c: C}) {
  const t = useTranslations('aboutSection');
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 lg:pr-12">
            <EditableImage contentKey="aboutSection.img" locale={locale} src={c['aboutSection.img']} alt="Association" width={600} height={400}
              className="rounded-lg shadow-lg w-full" />
          </div>
          <div className="lg:w-1/2">
            <EditableText contentKey="aboutSection.title" locale={locale} value={c['aboutSection.title']} tag="h2" className="text-3xl font-bold mb-6" />
            <EditableText contentKey="aboutSection.lead" locale={locale} value={c['aboutSection.lead']} multiline tag="p" className="text-lg leading-relaxed mb-4" />
            <EditableText contentKey="aboutSection.body" locale={locale} value={c['aboutSection.body']} multiline tag="p" className="mb-6" />
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

function MissionSection({locale, c}: {locale: string; c: C}) {
  const t = useTranslations('mission');
  const icons = ['fa-lock-open', 'fa-handshake', 'fa-balance-scale', 'fa-chart-line', 'fa-graduation-cap'];
  const values: string[] = t.raw('values');

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-200 relative overflow-hidden min-h-[90vh]">
      <div className="absolute top-[10%] left-[5%] opacity-5 text-[10rem] rotate-[15deg]">
        <i className="fas fa-bullseye" />
      </div>
      <div className="absolute bottom-[10%] right-[5%] opacity-5 text-[8rem] -rotate-[20deg]">
        <i className="fas fa-hands-helping" />
      </div>

      <div className="container mx-auto px-4">
        <EditableText contentKey="mission.sectionTitle" locale={locale} value={c['mission.sectionTitle']} tag="h2" className="text-4xl font-bold text-center text-[#2c3e50] mb-10 section-title-underline centered" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-lg p-10 h-[90%] transition-all duration-400 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden border-b-4 border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[#3498db] before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100">
            <EditableText contentKey="mission.missionTitle" locale={locale} value={c['mission.missionTitle']} tag="h3" className="text-2xl font-bold mb-5 text-[#2c3e50] text-center pb-8" />
            <EditableText contentKey="mission.missionText" locale={locale} value={c['mission.missionText']} multiline tag="p" className="text-lg leading-relaxed text-[#34495e]" />
          </div>

          {/* Values */}
          <div className="bg-white rounded-2xl shadow-lg p-10 h-[90%] transition-all duration-400 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden border-b-4 border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[#e74c3c] before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100">
            <EditableText contentKey="mission.valuesTitle" locale={locale} value={c['mission.valuesTitle']} tag="h3" className="text-2xl font-bold mb-5 text-[#2c3e50] text-center pb-8" />
            <ul className="values-list">
              {values.map((v: string, i: number) => (
                <li key={i}>
                  <i className={`fas ${icons[i]} mr-2`} />
                  <EditableText
                    contentKey={`mission.value.${i}`}
                    locale={locale}
                    value={c[`mission.value.${i}`] ?? v}
                    tag="span"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-2xl shadow-lg p-10 h-[90%] transition-all duration-400 hover:-translate-y-4 hover:shadow-xl relative overflow-hidden border-b-4 border-transparent before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-[#27ae60] before:scale-x-0 before:origin-left before:transition-transform before:duration-400 hover:before:scale-x-100">
            <EditableText contentKey="mission.goalsTitle" locale={locale} value={c['mission.goalsTitle']} tag="h3" className="text-2xl font-bold mb-5 text-[#2c3e50] text-center pb-8" />
            <EditableText contentKey="mission.goalsText" locale={locale} value={c['mission.goalsText']} multiline tag="p" className="text-lg leading-relaxed text-[#34495e]" />
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

function MembershipSection({locale, c}: {locale: string; c: C}) {
  const t = useTranslations('membership');
  const benefits: Array<{icon: string; title: string; description: string; highlight: string}> = t.raw('benefits');

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <EditableText contentKey="membership.sectionTitle" locale={locale} value={c['membership.sectionTitle']} tag="h2" className="text-4xl font-bold mb-5 text-[#2c3e50]" />
          <EditableText contentKey="membership.subtitle" locale={locale} value={c['membership.subtitle']} multiline tag="p" className="text-lg text-gray-500 max-w-[700px] mx-auto" />
        </div>
        <div className="flex flex-wrap justify-between gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl flex-1 basis-[calc(33%-30px)] max-w-[calc(33%-30px)] flex flex-col transition-all duration-400 hover:-translate-y-2.5 hover:shadow-xl min-w-[280px]">
              <div className="text-5xl mx-auto mt-8 mb-5">{b.icon}</div>
              <div className="px-8 pb-8 text-center flex-grow flex flex-col">
                <EditableText
                  contentKey={`membership.benefit.${i}.title`}
                  locale={locale}
                  value={c[`membership.benefit.${i}.title`] ?? b.title}
                  tag="h3"
                  className="text-xl font-bold mb-4 text-[#2c3e50] min-h-[60px]"
                />
                <EditableText
                  contentKey={`membership.benefit.${i}.description`}
                  locale={locale}
                  value={c[`membership.benefit.${i}.description`] ?? b.description}
                  multiline
                  tag="p"
                  className="text-lg leading-relaxed text-gray-600 mb-5"
                />
                <EditableText
                  contentKey={`membership.benefit.${i}.highlight`}
                  locale={locale}
                  value={c[`membership.benefit.${i}.highlight`] ?? b.highlight}
                  tag="div"
                  className="mt-auto py-2.5 px-4 bg-gray-50 rounded-lg font-medium text-blue-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  const [heroT, aboutT, missionT, membershipT, faqT, partnersT] = await Promise.all([
    getTranslations({locale, namespace: 'hero'}),
    getTranslations({locale, namespace: 'aboutSection'}),
    getTranslations({locale, namespace: 'mission'}),
    getTranslations({locale, namespace: 'membership'}),
    getTranslations({locale, namespace: 'faq'}),
    getTranslations({locale, namespace: 'partners'}),
  ]);

  const missionValues: string[] = missionT.raw('values');
  const membershipBenefits: Array<{title: string; description: string; highlight: string}> = membershipT.raw('benefits');
  const faqItems: Array<{question: string; answer: string}> = faqT.raw('items');

  const partnerKeys = DEFAULT_PARTNERS.flatMap((_, i) => [`partners.${i}.src`, `partners.${i}.alt`]);
  const partnerFallbacks = DEFAULT_PARTNERS.reduce<Record<string, string>>((acc, p, i) => {
    acc[`partners.${i}.src`] = p.src;
    acc[`partners.${i}.alt`] = p.alt;
    return acc;
  }, {});

  const valueKeys = missionValues.map((_, i) => `mission.value.${i}`);
  const valueFallbacks = missionValues.reduce<Record<string, string>>((acc, v, i) => { acc[`mission.value.${i}`] = v; return acc; }, {});

  const benefitKeys = membershipBenefits.flatMap((_, i) => [
    `membership.benefit.${i}.title`,
    `membership.benefit.${i}.description`,
    `membership.benefit.${i}.highlight`,
  ]);
  const benefitFallbacks = membershipBenefits.reduce<Record<string, string>>((acc, b, i) => {
    acc[`membership.benefit.${i}.title`] = b.title;
    acc[`membership.benefit.${i}.description`] = b.description;
    acc[`membership.benefit.${i}.highlight`] = b.highlight;
    return acc;
  }, {});

  const faqKeys = faqItems.flatMap((_, i) => [`faq.item.${i}.question`, `faq.item.${i}.answer`]);
  const faqFallbacks = faqItems.reduce<Record<string, string>>((acc, item, i) => {
    acc[`faq.item.${i}.question`] = item.question;
    acc[`faq.item.${i}.answer`] = item.answer;
    return acc;
  }, {});

  const c = await getContents(
    [
      'hero.title', 'hero.description',
      'hero.img1', 'hero.img2', 'hero.img3',
      'aboutSection.title', 'aboutSection.lead', 'aboutSection.body', 'aboutSection.img',
      'mission.sectionTitle', 'mission.missionTitle', 'mission.missionText',
      'mission.valuesTitle', 'mission.goalsTitle', 'mission.goalsText',
      'membership.sectionTitle', 'membership.subtitle',
      'faq.title',
      'partners.title',
      ...partnerKeys,
      ...valueKeys,
      ...benefitKeys,
      ...faqKeys,
    ],
    locale,
    {
      'hero.title': heroT('title'),
      'hero.description': heroT('description'),
      'hero.img1': '/images/ovalimg1.jpg',
      'hero.img2': '/images/ovalimg2.jpg',
      'hero.img3': '/images/ovalimg3.jpg',
      'aboutSection.title': aboutT('title'),
      'aboutSection.lead': aboutT('lead'),
      'aboutSection.body': aboutT('body'),
      'aboutSection.img': '/images/onaltumain.jpg',
      'mission.sectionTitle': missionT('sectionTitle'),
      'mission.missionTitle': missionT('missionTitle'),
      'mission.missionText': missionT('missionText'),
      'mission.valuesTitle': missionT('valuesTitle'),
      'mission.goalsTitle': missionT('goalsTitle'),
      'mission.goalsText': missionT('goalsText'),
      'membership.sectionTitle': membershipT('sectionTitle'),
      'membership.subtitle': membershipT('subtitle'),
      'faq.title': faqT('title'),
      'partners.title': partnersT('title'),
      ...partnerFallbacks,
      ...valueFallbacks,
      ...benefitFallbacks,
      ...faqFallbacks,
    }
  );

  const partners: PartnerItem[] = DEFAULT_PARTNERS.map((p, i) => ({
    src: c[`partners.${i}.src`] ?? p.src,
    alt: c[`partners.${i}.alt`] ?? p.alt,
  }));

  return (
    <>
      <TopBar />
      <Navbar />
      <HeroSection locale={locale} c={c} />
      <AboutSection locale={locale} c={c} />
      <PartnersCarousel locale={locale} titleValue={c['partners.title']} partners={partners} />
      <MissionSection locale={locale} c={c} />
      <MembershipSection locale={locale} c={c} />
      <FAQSection locale={locale} c={c} />
      <Footer />
      <ScrollToTop />
    </>
  );
}
