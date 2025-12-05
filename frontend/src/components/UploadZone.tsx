import { useState, useRef } from 'react';
import { removeBackground } from '../lib/api';
import { useTranslation } from '../lib/i18n.tsx';

interface UploadZoneProps {
  setOriginalImage: (image: string) => void;
  setProcessedImage: (image: string) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
}

export default function UploadZone({ 
  setOriginalImage, 
  setProcessedImage, 
  setIsProcessing,
  setError 
}: UploadZoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsProcessing(true);

    try {
      const resultBlob = await removeBackground(file);
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove background. Your image may not have a background or is too complex. Please upload an image that is suitable for removing background.');
      setOriginalImage('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-4 border-dashed rounded-2xl p-12 md:p-20 text-center cursor-pointer
        transition-all duration-300 transform hover:scale-105
        ${isDragging 
          ? 'border-primary bg-blue-50 dark:bg-blue-900/20 scale-105' 
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-primary'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <svg className="w-20 h-20 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('upload.drop')}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {t('upload.browse')}
          </p>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-500">
          Supports: JPG, PNG, WebP (Max 10MB)
        </div>
      </div>
    </div>
  );
}
