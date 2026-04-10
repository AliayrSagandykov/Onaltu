import {getTranslations} from 'next-intl/server';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import {getContents} from '@/lib/pageContent';
import EditableText from '@/components/EditableText';

export const dynamic = 'force-dynamic';

export default async function MembershipPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'membershipPage'});

  const benefits: Array<{title: string; description: string}> = t.raw('benefits');
  const steps: Array<{title: string; description: string; details?: string[]}> = t.raw('steps');
  const files: Array<{name: string; file: string}> = t.raw('files');
  const borderColors = ['border-blue-600', 'border-green-600', 'border-cyan-500'];
  const hoverColors = ['hover:bg-blue-600', 'hover:bg-green-600', 'hover:bg-cyan-500'];
  const textColors = ['text-blue-600', 'text-green-600', 'text-cyan-500'];
  const benefitIcons = ['fa-chalkboard-teacher', 'fa-comments', 'fa-chart-line'];

  const c = await getContents(
    [
      'membershipPage.associationName', 'membershipPage.title', 'membershipPage.subtitle',
      'membershipPage.howToJoinTitle', 'membershipPage.howToJoinSubtitle',
      'membershipPage.benefit.0.title', 'membershipPage.benefit.0.description',
      'membershipPage.benefit.1.title', 'membershipPage.benefit.1.description',
      'membershipPage.benefit.2.title', 'membershipPage.benefit.2.description',
    ],
    locale,
    {
      'membershipPage.associationName': t('associationName'),
      'membershipPage.title': t('title'),
      'membershipPage.subtitle': t('subtitle'),
      'membershipPage.howToJoinTitle': t('howToJoinTitle'),
      'membershipPage.howToJoinSubtitle': t('howToJoinSubtitle'),
      'membershipPage.benefit.0.title': benefits[0]?.title ?? '',
      'membershipPage.benefit.0.description': benefits[0]?.description ?? '',
      'membershipPage.benefit.1.title': benefits[1]?.title ?? '',
      'membershipPage.benefit.1.description': benefits[1]?.description ?? '',
      'membershipPage.benefit.2.title': benefits[2]?.title ?? '',
      'membershipPage.benefit.2.description': benefits[2]?.description ?? '',
    }
  );

  return (
    <>
      <TopBar />
      <Navbar />

      {/* Hero Slide */}
      <div className="mt-4 mx-4 w-full max-w-[200vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-[#1a6aa2] to-[#2a5298] p-10 text-center">
          <EditableText contentKey="membershipPage.associationName" locale={locale} value={c['membershipPage.associationName']} tag="div" className="text-2xl font-bold text-white mb-2 tracking-wide" />
          <EditableText contentKey="membershipPage.title" locale={locale} value={c['membershipPage.title']} tag="h1" className="text-4xl font-extrabold text-white mb-4 [text-shadow:0_2px_10px_rgba(0,0,0,0.2)]" />
          <EditableText contentKey="membershipPage.subtitle" locale={locale} value={c['membershipPage.subtitle']} multiline tag="p" className="text-lg text-white/90 max-w-[700px] mx-auto leading-relaxed" />
        </div>
        <div className="flex flex-col p-10 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-gray-200 last:border-0 last:pb-0">
              <div className="min-w-[70px] h-[70px] bg-[#e6f0fa] rounded-full flex items-center justify-center flex-shrink-0">
                <i className={`fas ${benefitIcons[i] ?? 'fa-star'} text-2xl text-[#1a6aa2]`} />
              </div>
              <div>
                <EditableText
                  contentKey={`membershipPage.benefit.${i}.title`}
                  locale={locale}
                  value={c[`membershipPage.benefit.${i}.title`] ?? b.title}
                  tag="h3"
                  className="text-xl font-semibold text-[#2a5298] mb-3"
                />
                <EditableText
                  contentKey={`membershipPage.benefit.${i}.description`}
                  locale={locale}
                  value={c[`membershipPage.benefit.${i}.description`] ?? b.description}
                  multiline
                  tag="p"
                  className="text-gray-600 leading-relaxed text-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to join */}
      <div className="container mx-auto px-4 mt-24 mb-12">
        <div className="text-center mb-8">
          <EditableText contentKey="membershipPage.howToJoinTitle" locale={locale} value={c['membershipPage.howToJoinTitle']} tag="h1" className="text-3xl font-bold text-gray-800" />
          <EditableText contentKey="membershipPage.howToJoinSubtitle" locale={locale} value={c['membershipPage.howToJoinSubtitle']} tag="p" className="text-gray-500 mt-2" />
        </div>

        <div className="space-y-10">
          {steps.map((step, i) => (
            <div key={i} className="flex relative mb-10">
              <div className="min-w-[60px] h-[60px] bg-[#1a6aa2] text-white rounded-full flex items-center justify-center text-2xl font-bold mr-6 flex-shrink-0 z-[2]">
                {i + 1}
              </div>
              <div className="pt-3 flex-grow">
                <h2 className="text-xl font-semibold text-[#2a5298] mb-4">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
                {step.details && (
                  <div className="step-details bg-gray-50 rounded-lg p-5 mt-4 border-l-[3px] border-[#1a6aa2]">
                    {step.details.map((d, j) => (
                      <p key={j}>{d}</p>
                    ))}
                  </div>
                )}
              </div>
              {i < steps.length - 1 && <div className="step-divider" />}
            </div>
          ))}
        </div>

        {/* Files */}
        <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h5 className="text-lg font-semibold">{t('filesTitle')}</h5>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {files.map((f, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6 text-center">
                  <h6 className="font-medium mb-3">{f.name}</h6>
                  <a
                    href={f.file}
                    download
                    className={`inline-block border ${borderColors[i]} ${textColors[i]} ${hoverColors[i]} hover:text-white px-4 py-2 rounded text-sm transition-colors`}
                  >
                    {t('download')}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
