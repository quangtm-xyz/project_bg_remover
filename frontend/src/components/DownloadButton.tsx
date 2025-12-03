interface DownloadButtonProps {
  processedImage: string;
}

export default function DownloadButton({ processedImage }: DownloadButtonProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full py-4 px-8 bg-primary text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download Image
    </button>
  );
}
