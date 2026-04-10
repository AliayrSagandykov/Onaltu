'use client';

interface Props {
  phoneRaw: string;
  callLabel: string;
  copyLabel: string;
}

export default function ContactActionButtons({phoneRaw, callLabel, copyLabel}: Props) {
  return (
    <div className="flex gap-3 mt-5">
      <a
        href={`tel:${phoneRaw}`}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <i className="fas fa-phone" /> {callLabel}
      </a>
      <button
        onClick={() => navigator.clipboard.writeText(phoneRaw)}
        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <i className="fas fa-copy" /> {copyLabel}
      </button>
    </div>
  );
}
