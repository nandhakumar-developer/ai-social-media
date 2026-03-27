import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm', 'application/pdf'];
const MAX_SIZE_MB = 10;

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Only JPG, PNG, WebP, GIF images, MP4/WebM videos, and PDF files are supported.');
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be under ${MAX_SIZE_MB}MB. Your file is ${(f.size / 1024 / 1024).toFixed(2)}MB.`);
      return false;
    }
    setError('');
    return true;
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleContinue = () => {
    if (!file) return;
    setIsProcessing(true);
    const fileUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      navigate('/platform', { state: { fileUrl, fileName: file.name, base64, mimeType: file.type } });
    };
    reader.readAsDataURL(file);
  };

  const getFileIcon = () => {
    if (!file) return 'cloud_upload';
    if (file.type.startsWith('video')) return 'movie';
    if (file.type === 'application/pdf') return 'description';
    return 'check_circle';
  };

  const getFileIconColor = () => {
    if (!file) return 'text-[#cc97ff]';
    if (file.type.startsWith('video')) return 'text-[#67e8f9]';
    if (file.type === 'application/pdf') return 'text-[#fda4af]';
    return 'text-[#86efac]';
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 pt-6 pb-24 md:px-6 md:pt-12 md:pb-16 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(204,151,255,0.12) 0%, transparent 70%)' }} />

      <div className="w-full max-w-3xl z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-[#cc97ff] font-bold text-[10px] uppercase tracking-widest mb-3 block">AI Content Generator</span>
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight text-white mb-3 leading-tight font-['Manrope']">
            Welcome to <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)' }}>CaptivAI</span>
          </h2>
          <p className="text-[#acaaad] text-sm md:text-lg max-w-xl mx-auto">
            Upload your media and let AI craft perfectly tailored social media captions for every platform.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative h-[240px] md:h-[320px] rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            ${dragActive ? 'border-[#cc97ff] bg-[#cc97ff]/5 scale-[1.01]' : file ? 'border-[#86efac]/40 bg-[#86efac]/5' : 'border-white/10 bg-white/[0.03] hover:border-[#cc97ff]/40 hover:bg-[#cc97ff]/5'}`}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,application/pdf"
          />

          {/* Preview for images */}
          {file && file.type.startsWith('image') && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-[2rem]"
            />
          )}

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300
              ${file ? 'bg-[#86efac]/10' : 'bg-white/5'}`}>
              <span className={`material-symbols-outlined text-4xl md:text-5xl ${getFileIconColor()}`}
                style={{ fontVariationSettings: "'FILL' 1" }}>
                {getFileIcon()}
              </span>
            </div>

            {file ? (
              <>
                <p className="text-white font-bold text-lg md:text-xl text-center px-6 max-w-sm truncate">{file.name}</p>
                <p className="text-[#acaaad] text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to change</p>
              </>
            ) : (
              <>
                <p className="text-white font-bold text-lg md:text-xl">Drop your file here</p>
                <p className="text-[#acaaad] text-sm mt-1">or click to browse</p>
              </>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 bg-[#fda4af]/10 border border-[#fda4af]/20 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-[#fda4af] text-sm">error</span>
            <p className="text-[#fda4af] text-sm">{error}</p>
          </div>
        )}

        {/* Supported formats */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {[
            { label: 'JPG / PNG', icon: 'image', color: 'text-[#cc97ff]' },
            { label: 'MP4 Video', icon: 'movie', color: 'text-[#67e8f9]' },
            { label: 'PDF', icon: 'description', color: 'text-[#fda4af]' },
            { label: 'Max 10MB', icon: 'storage', color: 'text-[#acaaad]' },
          ].map(({ label, icon, color }) => (
            <div key={label} className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
              <span className={`material-symbols-outlined text-sm ${color}`}>{icon}</span>
              <span className="text-[#acaaad] text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!file || isProcessing || !!error}
            className={`group relative px-10 py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-200 flex items-center gap-3 font-['Manrope']
              ${file && !error
                ? 'text-white active:scale-95 shadow-[0_0_30px_rgba(204,151,255,0.25)]'
                : 'bg-white/5 text-[#acaaad] cursor-not-allowed opacity-40'}`}
            style={file && !error ? { background: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)' } : {}}
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              <>
                Choose Platforms & Generate
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}