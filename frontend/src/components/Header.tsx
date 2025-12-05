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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {t('header.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('header.subtitle')}
          </p>
        </div>
      </div>
    </header>
  );
}
