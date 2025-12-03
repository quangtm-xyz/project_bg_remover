export default function ProcessingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-8 border-gray-100 dark:border-gray-800 border-t-blue-300 rounded-full animate-spin-slow"></div>
        </div>
      </div>
      
      <p className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        Removing background...
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        This may take a few seconds
      </p>
    </div>
  );
}
