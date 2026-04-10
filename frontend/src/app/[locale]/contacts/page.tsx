import {getTranslations} from 'next-intl/server';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import {getContents} from '@/lib/pageContent';
import EditableText from '@/components/EditableText';
import ContactActionButtons from '@/components/ContactActionButtons';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'contactsPage'});
  const contacts: Array<{name: string; position: string; phone: string; phoneRaw: string}> = t.raw('contacts');
  const meta = t.raw('meta') as {address: string; email: string; hours: string};

  const c = await getContents(
    [
      'contactsPage.title', 'contactsPage.subtitle',
      'contactsPage.contact.0.name', 'contactsPage.contact.0.position', 'contactsPage.contact.0.phone',
      'contactsPage.contact.1.name', 'contactsPage.contact.1.position', 'contactsPage.contact.1.phone',
      'contactsPage.contact.2.name', 'contactsPage.contact.2.position', 'contactsPage.contact.2.phone',
      'contactsPage.meta.address', 'contactsPage.meta.email', 'contactsPage.meta.hours',
      'contactsPage.formTitle',
    ],
    locale,
    {
      'contactsPage.title': t('title'),
      'contactsPage.subtitle': t('subtitle'),
      'contactsPage.contact.0.name': contacts[0]?.name ?? '',
      'contactsPage.contact.0.position': contacts[0]?.position ?? '',
      'contactsPage.contact.0.phone': contacts[0]?.phone ?? '',
      'contactsPage.contact.1.name': contacts[1]?.name ?? '',
      'contactsPage.contact.1.position': contacts[1]?.position ?? '',
      'contactsPage.contact.1.phone': contacts[1]?.phone ?? '',
      'contactsPage.contact.2.name': contacts[2]?.name ?? '',
      'contactsPage.contact.2.position': contacts[2]?.position ?? '',
      'contactsPage.contact.2.phone': contacts[2]?.phone ?? '',
      'contactsPage.meta.address': meta.address,
      'contactsPage.meta.email': meta.email,
      'contactsPage.meta.hours': meta.hours,
      'contactsPage.formTitle': t('formTitle'),
    }
  );

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <EditableText contentKey="contactsPage.title" locale={locale} value={c['contactsPage.title']} tag="h1" className="text-4xl font-bold text-[#1a6aa2] mt-6 ml-0 md:ml-12" />
          <EditableText contentKey="contactsPage.subtitle" locale={locale} value={c['contactsPage.subtitle']} tag="p" className="text-[#1a6aa2] ml-0 md:ml-12 mt-2" />
        </div>

        <div className="p-4 md:p-10 bg-white">
          {contacts.map((contact, i) => (
            <div key={i} className="bg-white rounded-lg p-6 mb-6 shadow-sm border-l-4 border-[#1a6aa2] hover:-translate-y-1 hover:shadow-md transition-all">
              <EditableText
                contentKey={`contactsPage.contact.${i}.name`}
                locale={locale}
                value={c[`contactsPage.contact.${i}.name`] ?? contact.name}
                tag="h3"
                className="text-xl font-semibold text-[#2a5298] mb-2"
              />
              <EditableText
                contentKey={`contactsPage.contact.${i}.position`}
                locale={locale}
                value={c[`contactsPage.contact.${i}.position`] ?? contact.position}
                tag="div"
                className="text-gray-500 mb-4 text-lg"
              />
              <div className="flex items-center gap-2 mb-1 text-lg">
                <i className="fas fa-phone-alt text-[#1a6aa2] w-6 text-center" />
                <EditableText
                  contentKey={`contactsPage.contact.${i}.phone`}
                  locale={locale}
                  value={c[`contactsPage.contact.${i}.phone`] ?? contact.phone}
                  tag="span"
                  className="font-medium text-gray-800"
                />
              </div>
              <ContactActionButtons
                phoneRaw={contact.phoneRaw}
                callLabel={t('call')}
                copyLabel={t('copy')}
              />
            </div>
          ))}

          {/* Meta info */}
          <div className="mt-10 pt-5 border-t border-gray-200">
            <p className="flex items-center gap-2 mb-3">
              <i className="fas fa-map-marker-alt text-[#1a6aa2] w-6 text-center" />
              <EditableText contentKey="contactsPage.meta.address" locale={locale} value={c['contactsPage.meta.address']} tag="span" />
            </p>
            <p className="flex items-center gap-2 mb-3">
              <i className="fas fa-envelope text-[#1a6aa2] w-6 text-center" />
              <EditableText contentKey="contactsPage.meta.email" locale={locale} value={c['contactsPage.meta.email']} tag="span" />
            </p>
            <p className="flex items-center gap-2 mb-3">
              <i className="fas fa-clock text-[#1a6aa2] w-6 text-center" />
              <EditableText contentKey="contactsPage.meta.hours" locale={locale} value={c['contactsPage.meta.hours']} tag="span" />
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="p-4 md:p-10 mt-4">
          <EditableText contentKey="contactsPage.formTitle" locale={locale} value={c['contactsPage.formTitle']} tag="h2" className="text-2xl font-semibold text-[#2a5298] mb-8 pb-4 border-b-2 border-gray-200 section-title-underline" />
          <ContactForm />
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </>
  );
}
