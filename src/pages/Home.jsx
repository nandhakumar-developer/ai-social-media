import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (!file) {
      alert("Please select or drop a file first.");
      return;
    }
    
    setIsProcessing(true);
    const fileUrl = URL.createObjectURL(file);
    
    // Convert to Base64 for real AI API
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      navigate('/platform', { state: { fileUrl, fileName: file.name, base64, mimeType: file.type } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 pt-6 pb-24 md:px-6 md:pt-12 md:pb-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] ai-pulse-bg rounded-full pointer-events-none opacity-40"></div>
      <div className="w-full max-w-4xl z-10">
        
        <div className="text-center mb-6 md:mb-12">
          <span className="text-tertiary font-label text-[10px] uppercase tracking-widest font-bold mb-2 md:mb-4 block">New Processing Core</span>
          <h2 className="text-3xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface mb-3 md:mb-6 leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">CaptivAI</span>
          </h2>
          <p className="text-on-surface-variant text-sm md:text-lg max-w-xl mx-auto hidden md:block">
            Upload your media to let CaptivAI analyze, optimize, and transform your content with ethereal precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="md:col-span-2 relative group">
            <div 
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`h-[220px] md:h-[400px] bg-glass rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed transition-all duration-500 cursor-pointer group ${file ? 'border-primary' : 'border-outline-variant/20 hover:border-primary/40'}`}>
              
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*,application/pdf" />
              
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className={`material-symbols-outlined text-3xl md:text-5xl ${file ? 'text-green-400' : 'text-primary'}`}>
                  {file ? 'check_circle' : 'cloud_upload'}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-headline font-bold mb-1 md:mb-2 text-center px-4">
                {file ? file.name : 'Drag & drop files'}
              </h3>
              <p className="text-on-surface-variant text-xs md:text-sm font-medium text-center px-4 md:px-8">
                {file 
                  ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB.` 
                  : 'Upload your media for AI analysis.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl md:rounded-[2rem] flex flex-col justify-between h-full">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-3 md:mb-4 hidden md:block">
                Supported Media Formats
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 md:gap-2 bg-surface-container-highest px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-sm md:text-base text-primary-fixed">image</span>
                  <span className="text-xs md:text-sm font-bold">RAW</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-surface-container-highest px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-sm md:text-base text-tertiary">movie</span>
                  <span className="text-xs md:text-sm font-bold">MP4</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 bg-surface-container-highest px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-sm md:text-base text-secondary">description</span>
                  <span className="text-xs md:text-sm font-bold">PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 flex flex-col items-center">
          <button 
            onClick={handleContinue}
            disabled={!file || isProcessing}
            className={`group relative px-8 py-4 md:px-12 md:py-5 rounded-2xl md:rounded-[1.5rem] font-headline font-bold text-base md:text-lg duration-200 transition-all flex items-center gap-3 ${file ? 'bg-gradient-to-br from-[#cc97ff] to-[#c284ff] text-on-primary-fixed active:scale-95 shadow-[0_0_24px_rgba(204,151,255,0.3)]' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed opacity-50'}`}>
            {isProcessing ? 'Processing Image...' : 'Upload & Continue'}
            {!isProcessing && <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>}
          </button>
        </div>

      </div>
    </main>
  );
}
