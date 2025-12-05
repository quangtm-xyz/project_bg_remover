import { useState, useEffect } from 'react'
import { I18nProvider, useTranslation } from './lib/i18n.tsx'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import UploadZone from './components/UploadZone'
import ProcessingSpinner from './components/ProcessingSpinner'
import BeforeAfterPreview from './components/BeforeAfterPreview'
import DownloadButton from './components/DownloadButton'
import About from './components/About'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function AppContent() {
  const { t } = useTranslation()
  const [isDark, setIsDark] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleReset = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
      <Header />
      
      {/* ADS SLOT 1 - Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          {/* ADS HERE */}
          <p className="text-gray-500 dark:text-gray-400 text-sm">Advertisement Space 728x90</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!originalImage && !isProcessing && (
          <>
            <UploadZone 
              setOriginalImage={setOriginalImage}
              setProcessedImage={setProcessedImage}
              setIsProcessing={setIsProcessing}
              setError={setError}
            />
            
            {/* ADS SLOT 2 - Below Upload */}
            <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              {/* ADS HERE */}
              <p className="text-gray-500 dark:text-gray-400 text-sm">Advertisement Space 728x90</p>
            </div>
          </>
        )}

        {isProcessing && <ProcessingSpinner />}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            <button
              onClick={handleReset}
              className="mt-3 mx-auto block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              {t('button.tryAgain')}
            </button>
          </div>
        )}

        {originalImage && processedImage && !isProcessing && (
          <div className="space-y-6">
            <BeforeAfterPreview 
              originalImage={originalImage}
              processedImage={processedImage}
            />
            
            {/* ADS SLOT 3 - Between Preview and Download */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              {/* ADS HERE */}
              <p className="text-gray-500 dark:text-gray-400 text-sm">Advertisement Space 728x90</p>
            </div>

            <DownloadButton processedImage={processedImage} />
            
            <button
              onClick={handleReset}
              className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              {t('button.removeAnother')}
            </button>
          </div>
        )}

        {/* ADS SLOT 4 - Bottom */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          {/* ADS HERE */}
          <p className="text-gray-500 dark:text-gray-400 text-sm">Advertisement Space 728x90</p>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('features.fast.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('features.fast.desc')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('features.precise.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('features.precise.desc')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('features.free.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('features.free.desc')}</p>
          </div>
        </div>

        <About />
        <FAQ />
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}

export default App
