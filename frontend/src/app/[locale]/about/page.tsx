import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import {getContents} from '@/lib/pageContent';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';

export const dynamic = 'force-dynamic';

type C = Record<string, string>;

function Governance({locale, c}: {locale: string; c: C}) {
  const t = useTranslations('aboutPage');
  const governance: Array<{title: string; subtitle: string; text: string}> = t.raw('governance');
  const icons = ['fa-users', 'fa-user-tie', 'fa-shield-alt'];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg pt-12 pb-4">
      <div className="container mx-auto px-4">
        <EditableText contentKey="about.governanceTitle" locale={locale} value={c['about.governanceTitle']} tag="h2" className="text-2xl font-bold text-[#2a5298] mb-8 pb-2 border-b-2 border-gray-200 section-title-underline" id="rule" />
        <div className="max-w-[1200px] mx-auto flex flex-col items-center">
          {governance.map((g, i) => (
            <div key={i} className="governance-level w-full">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[500px] text-center hover:-translate-y-2.5 hover:shadow-xl transition-all duration-400 relative z-10">
                <div className="text-4xl text-[#3498db] mb-4">
                  <i className={`fas ${icons[i]}`} />
                </div>
                <EditableText contentKey={`about.governance.${i}.title`} locale={locale} value={c[`about.governance.${i}.title`] ?? g.title} tag="h3" className="text-xl font-bold text-[#2c3e50] mb-2" />
                <EditableText contentKey={`about.governance.${i}.subtitle`} locale={locale} value={c[`about.governance.${i}.subtitle`] ?? g.subtitle} tag="div" className="text-sm text-gray-500 mb-4" />
                <EditableText contentKey={`about.governance.${i}.text`} locale={locale} value={c[`about.governance.${i}.text`] ?? g.text} multiline tag="p" className="text-gray-600 mt-5" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
          <EditableText contentKey="about.representationNoteTitle" locale={locale} value={c['about.representationNoteTitle']} tag="div" className="font-bold text-[#2a5298]" />
          <EditableText contentKey="about.representationNote" locale={locale} value={c['about.representationNote']} multiline tag="p" className="mb-5" />
        </div>
      </div>
    </section>
  );
}

function Directions({locale, c}: {locale: string; c: C}) {
  const t = useTranslations('aboutPage');
  const directions: Array<{title: string; description: string}> = t.raw('directions');

  return (
    <div className="p-8">
      <EditableText contentKey="about.professionalTitle" locale={locale} value={c['about.professionalTitle']} tag="h2" className="text-xl font-semibold text-[#2a5298] mb-4 pb-2 border-b-2 border-gray-200" id="workDirections" />
      {directions.slice(0, 5).map((d, i) => (
        <div key={i} className="direction-item">
          <div className="min-w-[30px] h-[30px] bg-[#2a5298] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-sm">
            {i + 1}
          </div>
          <div className="flex-grow">
            <EditableText contentKey={`about.direction.${i}.title`} locale={locale} value={c[`about.direction.${i}.title`] ?? d.title} tag="div" className="font-semibold text-[#1a3e6e] mb-1" />
            <EditableText contentKey={`about.direction.${i}.description`} locale={locale} value={c[`about.direction.${i}.description`] ?? d.description} multiline tag="div" className="text-gray-500 text-sm" />
          </div>
        </div>
      ))}

      <EditableText contentKey="about.educationalTitle" locale={locale} value={c['about.educationalTitle']} tag="h2" className="text-xl font-semibold text-[#2a5298] mb-4 mt-8 pb-2 border-b-2 border-gray-200" />
      {directions.slice(5).map((d, i) => (
        <div key={i} className="direction-item">
          <div className="min-w-[30px] h-[30px] bg-[#2a5298] text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-sm">
            {i + 6}
          </div>
          <div className="flex-grow">
            <EditableText contentKey={`about.direction.${i + 5}.title`} locale={locale} value={c[`about.direction.${i + 5}.title`] ?? d.title} tag="div" className="font-semibold text-[#1a3e6e] mb-1" />
            <EditableText contentKey={`about.direction.${i + 5}.description`} locale={locale} value={c[`about.direction.${i + 5}.description`] ?? d.description} multiline tag="div" className="text-gray-500 text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Vision({locale, c}: {locale: string; c: C}) {
  const t = useTranslations('aboutPage');
  const points: string[] = t.raw('visionPoints');

  return (
    <div className="mt-8 p-8">
      <EditableText contentKey="about.visionTitle" locale={locale} value={c['about.visionTitle']} tag="h4" className="text-xl font-bold mb-4" id="vision" />
      <EditableText contentKey="about.visionText" locale={locale} value={c['about.visionText']} multiline tag="p" className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <i className="fas fa-check-circle text-green-500 mt-1 text-lg" />
            <EditableText contentKey={`about.visionPoint.${i}`} locale={locale} value={c[`about.visionPoint.${i}`] ?? p} tag="div" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'aboutPage'});
  const sidebarLinks: string[] = t.raw('sidebarLinks');
  const anchors = ['#history', '#rule', '#workDirections', '#vision'];

  const governance: Array<{title: string; subtitle: string; text: string}> = t.raw('governance');
  const directions: Array<{title: string; description: string}> = t.raw('directions');
  const visionPoints: string[] = t.raw('visionPoints');

  const governanceKeys = governance.flatMap((_, i) => [
    `about.governance.${i}.title`, `about.governance.${i}.subtitle`, `about.governance.${i}.text`,
  ]);
  const governanceFallbacks = governance.reduce<Record<string, string>>((acc, g, i) => {
    acc[`about.governance.${i}.title`] = g.title;
    acc[`about.governance.${i}.subtitle`] = g.subtitle;
    acc[`about.governance.${i}.text`] = g.text;
    return acc;
  }, {});

  const directionKeys = directions.flatMap((_, i) => [`about.direction.${i}.title`, `about.direction.${i}.description`]);
  const directionFallbacks = directions.reduce<Record<string, string>>((acc, d, i) => {
    acc[`about.direction.${i}.title`] = d.title;
    acc[`about.direction.${i}.description`] = d.description;
    return acc;
  }, {});

  const visionPointKeys = visionPoints.map((_, i) => `about.visionPoint.${i}`);
  const visionPointFallbacks = visionPoints.reduce<Record<string, string>>((acc, p, i) => { acc[`about.visionPoint.${i}`] = p; return acc; }, {});

  const c = await getContents(
    [
      'about.intro', 'about.presidentName', 'about.historyText1', 'about.historyText2',
      'about.mainImage', 'about.presidentImage',
      'about.historyTitle',
      'about.governanceTitle', 'about.representationNoteTitle', 'about.representationNote',
      'about.professionalTitle', 'about.educationalTitle',
      'about.visionTitle', 'about.visionText',
      ...governanceKeys,
      ...directionKeys,
      ...visionPointKeys,
    ],
    locale,
    {
      'about.intro': t('intro'),
      'about.presidentName': t('presidentName'),
      'about.historyText1': t('historyText1'),
      'about.historyText2': t('historyText2'),
      'about.mainImage': '/images/onaltumain.jpg',
      'about.presidentImage': '/images/Azhar_Giniyat.jpg',
      'about.historyTitle': t('historyTitle'),
      'about.governanceTitle': t('governanceTitle'),
      'about.representationNoteTitle': t('representationNoteTitle'),
      'about.representationNote': t('representationNote'),
      'about.professionalTitle': t('professionalTitle'),
      'about.educationalTitle': t('educationalTitle'),
      'about.visionTitle': t('visionTitle'),
      'about.visionText': t('visionText'),
      ...governanceFallbacks,
      ...directionFallbacks,
      ...visionPointFallbacks,
    }
  );

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Intro */}
          <div className="mb-8">
            <div className="rounded-lg overflow-hidden shadow-lg mb-8 hover:scale-[1.02] transition-transform duration-500">
              <EditableImage contentKey="about.mainImage" locale={locale} src={c['about.mainImage']} alt="Main" width={1200} height={500} className="w-full" />
            </div>
            <EditableText contentKey="about.intro" locale={locale} value={c['about.intro']} multiline className="text-lg leading-relaxed my-8" tag="p" />
          </div>

          {/* President */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="text-xl font-bold text-blue-800 mb-3">{t('presidentTitle')}</h4>
            <hr className="mb-4" />
            <EditableImage contentKey="about.presidentImage" locale={locale} src={c['about.presidentImage']} alt="President" width={600} height={400} className="rounded-lg mb-3 max-w-[600px] w-full" />
            <EditableText contentKey="about.presidentName" locale={locale} value={c['about.presidentName']} className="text-gray-700" tag="p" />
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
                      <a href={anchors[i]} className="block px-4 py-2 rounded font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:pl-5 transition-all">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-2/3">
              <EditableText contentKey="about.historyTitle" locale={locale} value={c['about.historyTitle']} tag="h2" className="text-2xl font-bold text-[#2a5298] mb-6 pb-4 border-b-2 border-gray-200 section-title-underline" id="history" />
              <div className="pb-6">
                <EditableText contentKey="about.historyText1" locale={locale} value={c['about.historyText1']} multiline className="mb-4" tag="p" />
                <EditableText contentKey="about.historyText2" locale={locale} value={c['about.historyText2']} multiline tag="p" />
              </div>

              <Governance locale={locale} c={c} />
              <Directions locale={locale} c={c} />
              <Vision locale={locale} c={c} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
