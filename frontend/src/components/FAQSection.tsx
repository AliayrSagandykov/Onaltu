'use client';

import {useTranslations} from 'next-intl';
import {useEditMode} from '@/context/EditModeContext';
import EditableText from '@/components/EditableText';

interface Props {
  locale: string;
  c: Record<string, string>;
}

export default function FAQSection({locale, c}: Props) {
  const t = useTranslations('faq');
  const items: Array<{question: string; answer: string}> = t.raw('items');
  const {editMode} = useEditMode();

  return (
    <section className="py-12 px-4 md:px-24">
      <EditableText contentKey="faq.title" locale={locale} value={c['faq.title']} tag="h3" className="text-2xl font-bold text-center mb-8" />
      <div className="max-w-4xl mx-auto space-y-4">
        {editMode ? (
          // In edit mode: show all expanded as plain divs (no accordion conflict)
          items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <EditableText
                contentKey={`faq.item.${i}.question`}
                locale={locale}
                value={c[`faq.item.${i}.question`] ?? item.question}
                tag="p"
                className="font-medium text-lg mb-4 text-gray-800"
              />
              <EditableText
                contentKey={`faq.item.${i}.answer`}
                locale={locale}
                value={c[`faq.item.${i}.answer`] ?? item.answer}
                multiline
                tag="p"
                className="text-gray-600 leading-relaxed"
              />
            </div>
          ))
        ) : (
          items.map((item, i) => (
            <details key={i} className="border border-gray-200 rounded-lg" open={i === 0}>
              <summary className="px-6 py-4 cursor-pointer font-medium text-lg hover:bg-gray-50 transition-colors">
                {c[`faq.item.${i}.question`] ?? item.question}
              </summary>
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {c[`faq.item.${i}.answer`] ?? item.answer}
              </div>
            </details>
          ))
        )}
      </div>
    </section>
  );
}
