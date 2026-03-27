import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Platform() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = location.state || {};

  const [platforms, setPlatforms] = useState({
    linkedin: true,
    facebook: false,
    instagram: true,
    youtube: false,
    mail: false
  });

  const [tone, setTone] = useState('Professional');

  const handleToggle = (key) => setPlatforms(p => ({ ...p, [key]: !p[key] }));

  const handleGenerate = () => {
    navigate('/analyzing', { state: { ...baseState, platforms, tone } });
  };

  return (
    <main className="px-4 mt-4 md:px-6 md:mt-8 max-w-2xl mx-auto pb-24 md:pb-32">
      <section className="mb-6 md:mb-12">
        <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight mb-2 md:mb-3 text-on-surface">
          Craft your <span className="text-primary italic">vision</span>
        </h2>
        <p className="text-on-surface-variant text-sm md:text-lg leading-relaxed">
          Select target platforms and tone for AI insights.
        </p>
      </section>

      <section className="mb-6 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="font-headline text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-tertiary">Select Platforms</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          
          {/* LinkedIn */}
          <div className="bg-surface-container-low rounded-xl p-3 md:p-5 flex items-center justify-between group hover:bg-surface-container-high transition-all duration-300">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0077b5]/10 flex items-center justify-center text-[#0077b5]">
                <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm md:text-base text-on-surface">LinkedIn</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={platforms.linkedin} onChange={() => handleToggle('linkedin')} />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-primary-fixed after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20"></div>
            </label>
          </div>

          {/* Facebook */}
          <div className="bg-surface-container-low rounded-xl p-3 md:p-5 flex items-center justify-between group hover:bg-surface-container-high transition-all duration-300">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#1877f2]/10 flex items-center justify-center text-[#1877f2]">
                <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>social_leaderboard</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm md:text-base text-on-surface">Facebook</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={platforms.facebook} onChange={() => handleToggle('facebook')} />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-primary-fixed after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20"></div>
            </label>
          </div>

          {/* Instagram */}
          <div className="bg-surface-container-low rounded-xl p-3 md:p-5 flex items-center justify-between group hover:bg-surface-container-high transition-all duration-300">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#e4405f]/10 flex items-center justify-center text-[#e4405f]">
                <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>camera</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm md:text-base text-on-surface">Instagram</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={platforms.instagram} onChange={() => handleToggle('instagram')} />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-primary-fixed after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20"></div>
            </label>
          </div>

          {/* YouTube */}
          <div className="bg-surface-container-low rounded-xl p-3 md:p-5 flex items-center justify-between group hover:bg-surface-container-high transition-all duration-300">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#ff0000]/10 flex items-center justify-center text-[#ff0000]">
                <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
              <div>
                <p className="font-headline font-bold text-sm md:text-base text-on-surface">YouTube</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={platforms.youtube} onChange={() => handleToggle('youtube')} />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-primary-fixed after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20"></div>
            </label>
          </div>

        </div>
      </section>

      <section className="mb-6 md:mb-12 relative">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="font-headline text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-tertiary">AI Tone</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          
          <button 
            onClick={() => setTone('Professional')}
            className={`flex flex-col items-start p-3 md:p-5 rounded-2xl border transition-all active:scale-95 text-left ${tone === 'Professional' ? 'bg-surface-variant text-primary border-primary/20' : 'bg-surface-container-low border-transparent text-on-surface-variant'}`}>
            <span className="font-headline font-bold text-sm md:text-base">Professional</span>
          </button>

          <button 
            onClick={() => setTone('Creative')}
            className={`flex flex-col items-start p-3 md:p-5 rounded-2xl border transition-all active:scale-95 text-left ${tone === 'Creative' ? 'bg-surface-variant text-primary border-primary/20' : 'bg-surface-container-low border-transparent text-on-surface-variant'}`}>
            <span className="font-headline font-bold text-sm md:text-base">Creative</span>
          </button>

          <button 
            onClick={() => setTone('Funny')}
            className={`flex flex-col items-start p-3 md:p-5 rounded-2xl border transition-all active:scale-95 text-left ${tone === 'Funny' ? 'bg-surface-variant text-primary border-primary/20' : 'bg-surface-container-low border-transparent text-on-surface-variant'}`}>
            <span className="font-headline font-bold text-sm md:text-base">Funny</span>
          </button>

          <button 
            onClick={() => setTone('Informative')}
            className={`flex flex-col items-start p-3 md:p-5 rounded-2xl border transition-all active:scale-95 text-left ${tone === 'Informative' ? 'bg-surface-variant text-primary border-primary/20' : 'bg-surface-container-low border-transparent text-on-surface-variant'}`}>
            <span className="font-headline font-bold text-sm md:text-base">Informative</span>
          </button>

        </div>
      </section>

      <div className="fixed bottom-20 md:bottom-24 left-0 w-full px-4 md:px-6 flex justify-center z-[55]">
        <button 
          onClick={handleGenerate}
          className="max-w-lg w-full py-3 md:py-4 gradient-primary rounded-xl md:rounded-2xl font-headline font-bold text-on-primary active:scale-95 duration-200 flex items-center justify-center gap-2">
          Generate Content
          <span className="material-symbols-outlined">bolt</span>
        </button>
      </div>
    </main>
  );
}
