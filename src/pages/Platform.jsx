import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PLATFORMS = [
  { key: 'linkedin',  label: 'LinkedIn',  icon: 'work',              color: '#0077b5', bg: 'rgba(0,119,181,0.12)' },
  { key: 'instagram', label: 'Instagram', icon: 'camera',            color: '#e4405f', bg: 'rgba(228,64,95,0.12)' },
  { key: 'facebook',  label: 'Facebook',  icon: 'social_leaderboard',color: '#1877f2', bg: 'rgba(24,119,242,0.12)' },
  { key: 'whatsapp',  label: 'WhatsApp',  icon: 'chat',              color: '#25d366', bg: 'rgba(37,211,102,0.12)' },
  { key: 'mail',      label: 'Email',     icon: 'mail',              color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
];

const TONES = ['Professional', 'Creative', 'Funny', 'Informative', 'Inspirational', 'Casual'];
const LINE_OPTIONS = [5, 10, 15, 20];

export default function Platform() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = location.state || {};

  const [selected, setSelected] = useState({ linkedin: true, instagram: true });
  const [tone, setTone] = useState('Professional');
  const [lines, setLines] = useState(10);

  const togglePlatform = (key) =>
    setSelected(p => ({ ...p, [key]: !p[key] }));

  const anySelected = Object.values(selected).some(Boolean);

  const handleGenerate = () => {
    navigate('/analyzing', { state: { ...baseState, platforms: selected, tone, lines } });
  };

  return (
    <main className="px-4 mt-4 md:px-6 md:mt-8 max-w-2xl mx-auto pb-40">

      {/* Header */}
      <section className="mb-8 md:mb-10">
        <span className="text-[#cc97ff] font-bold text-[10px] uppercase tracking-widest mb-2 block">Step 2 of 3</span>
        <h2 className="font-['Manrope'] text-2xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">
          Configure your <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #cc97ff, #c284ff)' }}>content</span>
        </h2>
        <p className="text-[#acaaad] text-sm md:text-base">
          Pick the platforms, tone, and length for your AI-generated captions.
        </p>
      </section>

      {/* Platforms */}
      <section className="mb-8">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#cc97ff] mb-4">
          Select Platforms
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {PLATFORMS.map(({ key, label, icon, color, bg }) => {
            const active = !!selected[key];
            return (
              <button
                key={key}
                onClick={() => togglePlatform(key)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all duration-200 active:scale-[0.98]
                  ${active
                    ? 'border-[rgba(204,151,255,0.25)] bg-[rgba(204,151,255,0.07)]'
                    : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                    <span className="material-symbols-outlined text-xl" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <span className="font-['Manrope'] font-bold text-white text-sm md:text-base">{label}</span>
                </div>
                {/* Toggle */}
                <div className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0
                  ${active ? 'bg-[#cc97ff]/30' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow
                    ${active ? 'left-6 bg-[#cc97ff]' : 'left-0.5 bg-[#acaaad]'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tone */}
      <section className="mb-8">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#cc97ff] mb-4">
          Tone of Voice
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TONES.map(t => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-4 py-3 rounded-xl font-bold text-sm font-['Manrope'] transition-all active:scale-95 text-left border
                ${tone === t
                  ? 'border-[#cc97ff]/30 bg-[#cc97ff]/10 text-[#cc97ff]'
                  : 'border-white/5 bg-white/[0.03] text-[#acaaad] hover:bg-white/[0.06]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Lines */}
      <section className="mb-8">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#cc97ff] mb-4">
          Caption Length (lines)
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {LINE_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setLines(n)}
              className={`py-3 rounded-xl font-bold text-sm font-['Manrope'] transition-all active:scale-95 border
                ${lines === n
                  ? 'border-[#cc97ff]/30 bg-[#cc97ff]/10 text-[#cc97ff]'
                  : 'border-white/5 bg-white/[0.03] text-[#acaaad] hover:bg-white/[0.06]'}`}
            >
              {n} lines
            </button>
          ))}
        </div>
      </section>

      {/* Generate Button - sticky */}
      <div className="fixed bottom-20 md:bottom-6 left-0 w-full px-4 z-[55]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleGenerate}
            disabled={!anySelected}
            className={`w-full py-4 rounded-2xl font-bold text-base font-['Manrope'] transition-all duration-200 flex items-center justify-center gap-2
              ${anySelected
                ? 'text-white active:scale-[0.98] shadow-[0_8px_30px_rgba(204,151,255,0.2)]'
                : 'bg-white/5 text-[#acaaad] cursor-not-allowed opacity-40'}`}
            style={anySelected ? { background: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)' } : {}}
          >
            Generate Content
            <span className="material-symbols-outlined">bolt</span>
          </button>
        </div>
      </div>
    </main>
  );
}