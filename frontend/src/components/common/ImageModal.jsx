export default function ImageModal({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full glass-card overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image holder */}
        <div className="flex items-center justify-center bg-slate-900/10">
          <img
            src={imageUrl}
            alt="Issue full view"
            className="max-h-[85vh] w-auto object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="bg-white px-6 py-4 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Attached Media Preview</p>
        </div>
      </div>
    </div>
  );
}
