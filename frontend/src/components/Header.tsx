'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation, languages, Language } from '../lib/i18n';

export default function Header() {
  const { language, setLanguage } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);

    // Sync language with URL pathname
    if (pathname) {
      const segments = pathname.split('/').filter(Boolean);
      const urlLang = segments[0] as Language;
      if (Object.keys(languages).includes(urlLang) && urlLang !== language) {
        setLanguage(urlLang);
      }
    }
  }, [pathname]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language].dir as 'ltr' | 'rtl';
    if (languages[language].dir === 'rtl') {
      document.documentElement.classList.add('dir-rtl');
    } else {
      document.documentElement.classList.remove('dir-rtl');
    }
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);

    // Navigate to the new language URL
    const currentPath = pathname || '/en';
    const segments = currentPath.split('/').filter(Boolean);

    // Check if first segment is a language code
    const currentLang = segments[0];
    const isLangSegment = Object.keys(languages).includes(currentLang);

    // Build new path
    let newPath;
    if (isLangSegment) {
      // Replace current language with new language
      segments[0] = lang;
      newPath = '/' + segments.join('/');
    } else {
      // Prepend new language
      newPath = '/' + lang + (currentPath === '/' ? '' : currentPath);
    }

    router.push(newPath);
  };

  const tools = [
    { emoji: '🎨', name: 'Background Remover', desc: 'Remove backgrounds with AI', href: '/', current: true, new: false },
    { emoji: '📝', name: 'Blog', desc: 'Learn about AI and image editing', href: `/${language}/blog`, current: true, new: false },
    { emoji: '✨', name: 'Image Enhancer', desc: 'Enhance image quality instantly', href: '#', current: false, new: true },
    { emoji: '🖼️', name: 'Photo Editor', desc: 'Edit photos like a pro', href: '#', current: false, new: true },
    { emoji: '🎭', name: 'Face Swap', desc: 'Swap faces in seconds', href: '#', current: false, new: false },
    { emoji: '🌈', name: 'Colorize', desc: 'Add color to old photos', href: '#', current: false, new: false },
  ];

  const isBlogPage = pathname?.includes('/blog')
  const homeUrl = language === 'en' ? '/' : `/${language}`

  return (
    <header className="h-16 md:h-18 bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
        {isBlogPage && (
          <a
            href={homeUrl}
            className="absolute left-4 md:left-6 lg:left-[110px] top-24 z-50 p-2 
                   rounded-full bg-white/90 dark:bg-gray-800/90 
                   shadow-md backdrop-blur hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>
        )}

        <div className="flex items-center justify-between flex-1">
          <a href={homeUrl} className="flex items-center">
            <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-400 to-teal-600 bg-clip-text text-transparent">CraftBG</span>
          </a>

          <div className="flex items-center gap-3">
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onMouseEnter={() => window.innerWidth >= 768 && setToolsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <span className="font-medium">Tools</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 max-h-96 overflow-y-auto">
                  {tools.map((tool, idx) => (
                    <a
                      key={idx}
                      href={tool.href}
                      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110 mb-2 last:mb-0 ${!tool.current ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{tool.name}</span>
                          {tool.new && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</p>
                        {!tool.current && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">Coming soon</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <span className="text-base">{languages[language].flag}</span>
                <span className="font-medium hidden md:inline">{languages[language].name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {(Object.keys(languages) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${language === lang ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <span className="text-base">{languages[lang].flag}</span>
                      <span className={`text-sm font-medium ${language === lang ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {languages[lang].name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
