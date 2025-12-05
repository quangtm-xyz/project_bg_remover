import { useState } from 'react';
import { useTranslation } from '../lib/i18n.tsx';

interface BeforeAfterPreviewProps {
  originalImage: string;
  processedImage: string;
}

export default function BeforeAfterPreview({ originalImage, processedImage }: BeforeAfterPreviewProps) {
  const { t } = useTranslation();
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowOriginal(false)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            !showOriginal
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('preview.after')}
        </button>
        <button
          onClick={() => setShowOriginal(true)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            showOriginal
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('preview.before')}
        </button>
      </div>

      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div 
          className="relative bg-white dark:bg-gray-900 p-8"
          style={{
            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        >
          <img
            src={showOriginal ? originalImage : processedImage}
            alt={showOriginal ? 'Original' : 'Processed'}
            className="max-w-full h-auto mx-auto rounded-lg shadow-lg transition-all duration-300"
            style={{ maxHeight: '600px' }}
          />
        </div>
      </div>
    </div>
  );
}
