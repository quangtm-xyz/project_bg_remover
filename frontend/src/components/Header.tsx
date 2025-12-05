import { useTranslation } from '../lib/i18n.tsx';
import LanguageSwitcher from './LanguageSwitcher.tsx';

export default function Header() {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <LanguageSwitcher />
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/favicon.png" alt="CleanBG Logo" className="h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {t('header.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('header.subtitle')}
          </p>
        </div>
      </div>
    </header>
  );
}
