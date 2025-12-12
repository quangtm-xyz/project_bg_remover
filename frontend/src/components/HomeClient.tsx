'use client'

import { useState } from 'react'
import UploadZone from './UploadZone'
import ProcessingSpinner from './ProcessingSpinner'
import BeforeAfterPreview from './BeforeAfterPreview'
import DownloadButton from './DownloadButton'
import { useTranslation } from '../lib/i18n'

export default function HomeClient() {
    const { t } = useTranslation()
    const [originalImage, setOriginalImage] = useState<string | null>(null)
    const [processedImage, setProcessedImage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleReset = () => {
        setOriginalImage(null)
        setProcessedImage(null)
        setError(null)
    }

    const handleSampleImage = async (url: string) => {
        setError(null)
        setIsProcessing(true)

        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const file = new File([blob], 'sample.jpg', { type: blob.type })

            const reader = new FileReader()
            reader.onload = (e) => {
                setOriginalImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            const { removeBackground } = await import('../lib/api')
            const resultBlob = await removeBackground(file)
            const resultUrl = URL.createObjectURL(resultBlob)
            setProcessedImage(resultUrl)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to remove background. Your image may not have a background or is too complex. Please upload an image that is suitable for removing background.')
            setOriginalImage('')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex flex-col items-center">
            {!originalImage && !isProcessing && (
                <>
                    <UploadZone
                        setOriginalImage={setOriginalImage}
                        setProcessedImage={setProcessedImage}
                        setIsProcessing={setIsProcessing}
                        setError={setError}
                    />

                    <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                        💡 {t("upload.help_message")}
                    </p>

                    <p className="mt-10 text-center text-gray-700 dark:text-gray-300 font-medium">{t("sample_text")}</p>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                            alt="Sample portrait"
                            width={200}
                            height={250}
                            className="rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition"
                            onClick={() => handleSampleImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600')}
                        />
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                            alt="Sample product"
                            width={200}
                            height={250}
                            className="rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition"
                            onClick={() => handleSampleImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600')}
                        />
                        <img
                            src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400"
                            alt="Sample car"
                            width={200}
                            height={250}
                            className="rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition"
                            onClick={() => handleSampleImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1600')}
                        />
                        <img
                            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400"
                            alt="Sample object"
                            width={200}
                            height={250}
                            className="rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition"
                            onClick={() => handleSampleImage('https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600')}
                        />
                    </div>

                    <p className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400 max-w-2xl">{t("privacy_text")}</p>
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

                    <DownloadButton processedImage={processedImage} />

                    <button
                        onClick={handleReset}
                        className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 font-semibold"
                    >
                        {t('button.removeAnother')}
                    </button>
                </div>
            )}
        </div>
    )
}
