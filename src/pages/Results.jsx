import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';

const PLATFORM_META = {
  linkedin:  { label: 'LinkedIn',  icon: 'work',              color: '#0077b5', bg: 'rgba(0,119,181,0.12)' },
  instagram: { label: 'Instagram', icon: 'camera',            color: '#e4405f', bg: 'rgba(228,64,95,0.12)' },
  facebook:  { label: 'Facebook',  icon: 'social_leaderboard',color: '#1877f2', bg: 'rgba(24,119,242,0.12)' },
  whatsapp:  { label: 'WhatsApp',  icon: 'chat',              color: '#25d366', bg: 'rgba(37,211,102,0.12)' },
  mail:      { label: 'Email',     icon: 'mail',              color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

// Deep-link share URLs for each platform (text only; native share handles files)
const PLATFORM_SHARE_URLS = {
  linkedin:  (text) => `https://www.linkedin.com/sharing/share-offsite/?summary=${encodeURIComponent(text)}`,
  facebook:  (text) => `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=https://captivai.app`,
  whatsapp:  (text) => `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
  mail:      (text) => {
    const lines = text.split('\n');
    const subject = lines[0].startsWith('Subject:') ? lines[0].replace('Subject:', '').trim() : 'Check this out';
    const body = lines.slice(1).join('\n').trim();
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  },
  instagram: null, // Instagram has no web share URL; use native share
};

function mockCaption(platform, tone, lines) {
  const n = lines || 10;
  const t = (tone || 'professional').toLowerCase();
  const lineText = {
    linkedin: `💼 Sharing something exciting today.\n\nThis is a moment that represents growth, innovation, and the relentless pursuit of excellence.\n\nHere's what I've learned:\n• Every challenge is a stepping stone.\n• Consistency beats motivation every time.\n• Your network is your net worth.\n\nKeep pushing forward. The best is yet to come.\n\n#Leadership #Innovation #Growth #Professional #Mindset`,
    instagram: `✨ Vibes only ✨\n\nSometimes a single moment captures everything. 📸\n\nThis right here? Pure magic.\n\nLet it sink in. Let it inspire.\nLet it remind you why you started. 💜\n\n#aesthetic #vibes #inspo #content #lifestyle`,
    facebook: `Hey everyone! 👋\n\nJust wanted to share this with you all because it really speaks to me.\n\nLife is full of moments worth celebrating, and this is one of them.\n\nFeel free to share your thoughts in the comments below!\n\n#Share #Community #Moments`,
    whatsapp: `Hey! 👋\n\nJust wanted to share this with you.\n\nIsn't this incredible? 🔥\n\nLet me know what you think! 😊`,
    mail: `Subject: An Update I Wanted to Share With You\n\nHi there,\n\nI hope this message finds you well. I'm reaching out because I have something exciting to share.\n\nThis piece of content encapsulates exactly the message we've been working towards.\n\nLooking forward to hearing your thoughts.\n\nBest regards,\n[Your Name]`,
  };
  return lineText[platform] || `Generated ${t} content for ${platform}. ✨\n\n#content #social #media`;
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const { fileUrl, fileName, platforms, tone, aiResults, base64, mimeType = 'image/jpeg', geminiError, lines } = state;
  const activePlatforms = platforms ? Object.keys(platforms).filter(k => platforms[k]) : ['linkedin', 'instagram'];
  const activeTone = tone || 'Professional';

  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState(activePlatforms[0]);
  const [shareStatus, setShareStatus] = useState('');

  const generatedContent = useMemo(() =>
    activePlatforms.map(p => ({
      platform: p,
      content: aiResults?.[p] || mockCaption(p, activeTone, lines)
    })),
    [activePlatforms, aiResults, activeTone, lines]
  );

  // Save to history (localStorage)
  useEffect(() => {
    if (!generatedContent.length) return;
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      tone: activeTone,
      imageName: fileName || 'Untitled',
      base64: base64 ? `data:${mimeType};base64,${base64}` : null,
      mimeType,
      platforms: activePlatforms,
      aiResults: aiResults || null,
      contentSnippet: generatedContent[0]?.content.substring(0, 90) + '...'
    };
    try {
      const existing = JSON.parse(localStorage.getItem('captivai_history') || '[]');
      const isDuplicate = existing[0] && existing[0].imageName === historyItem.imageName
        && Date.now() - parseInt(existing[0].id) < 5000;
      if (!isDuplicate) {
        existing.unshift(historyItem);
        localStorage.setItem('captivai_history', JSON.stringify(existing.slice(0, 30)));
      }
    } catch (e) { /* ignore */ }
  }, []);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      alert('Could not copy. Please copy manually.');
    }
  };

  // Build a File object from the uploaded media for native share
  const buildMediaFile = async () => {
    if (!fileUrl) return null;
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName || 'media', { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) return file;
    } catch { /* ignore */ }
    return null;
  };

  const handleShare = async (text, platform) => {
    setShareStatus('sharing');
    try {
      // Try native Web Share API first (supports files on mobile)
      if (navigator.share) {
        const mediaFile = await buildMediaFile();
        const shareData = {
          title: `CaptivAI – ${PLATFORM_META[platform]?.label || platform}`,
          text,
          ...(mediaFile ? { files: [mediaFile] } : {}),
        };
        await navigator.share(shareData);
        setShareStatus('');
        return;
      }

      // Desktop fallback: use platform deep-link or mailto
      const urlBuilder = PLATFORM_SHARE_URLS[platform];
      if (urlBuilder) {
        const url = urlBuilder(text);
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Instagram or unknown — copy + notify
        await navigator.clipboard.writeText(text);
        alert('Caption copied! Open Instagram and paste it into your post.');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(text);
          setCopiedKey(platform + '_share');
          setTimeout(() => setCopiedKey(null), 2000);
        } catch { /* ignore */ }
      }
    }
    setShareStatus('');
  };

  const handleShareAll = async () => {
    const allText = generatedContent
      .map(({ platform, content }) => `— ${PLATFORM_META[platform]?.label || platform} —\n${content}`)
      .join('\n\n');
    await handleShare(allText, 'all');
  };

  const activeItem = generatedContent.find(g => g.platform === activeTab);
  const activeMeta = PLATFORM_META[activeTab] || {};

  return (
    <main className="px-4 pt-4 pb-32 md:px-6 md:pt-8 md:pb-16 max-w-3xl mx-auto">

      {/* Header */}
      <section className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-[#cc97ff] font-bold text-[10px] uppercase tracking-widest mb-1 block">Your Results</span>
            <h2 className="font-['Manrope'] text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {activeTone} Captions
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#acaaad] text-sm font-medium hover:bg-white/10 transition-all active:scale-95">
              <span className="material-symbols-outlined text-sm">add</span>
              New
            </button>
            <button
              onClick={handleShareAll}
              disabled={shareStatus === 'sharing'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)', color: 'white' }}>
              {shareStatus === 'sharing' ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-sm">share</span>
              )}
              Share All
            </button>
          </div>
        </div>

        {geminiError && (
          <div className="mt-3 flex items-start gap-2 bg-[#fda4af]/10 border border-[#fda4af]/20 rounded-xl px-4 py-3">
            <span className="material-symbols-outlined text-[#fda4af] text-sm mt-0.5">warning</span>
            <p className="text-[#fda4af] text-xs">AI generation encountered an issue — showing sample captions. Error: {geminiError}</p>
          </div>
        )}
      </section>

      {/* Uploaded media preview */}
      {fileUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5">
          {mimeType?.startsWith('image') ? (
            <img src={fileUrl} alt={fileName} className="w-full max-h-[280px] object-cover" />
          ) : mimeType?.startsWith('video') ? (
            <video src={fileUrl} controls className="w-full max-h-[280px] rounded-2xl" />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <span className="material-symbols-outlined text-[#fda4af] text-3xl">description</span>
              <div>
                <p className="text-white font-bold text-sm">{fileName}</p>
                <p className="text-[#acaaad] text-xs">PDF Document</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Platform Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
        {generatedContent.map(({ platform }) => {
          const meta = PLATFORM_META[platform] || {};
          const isActive = activeTab === platform;
          return (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 border
                ${isActive ? 'border-white/10' : 'border-transparent bg-white/[0.03] text-[#acaaad] hover:bg-white/[0.06]'}`}
              style={isActive ? { background: meta.bg, color: meta.color, borderColor: `${meta.color}30` } : {}}
            >
              <span className="material-symbols-outlined text-sm" style={isActive ? { color: meta.color, fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 1" }}>{meta.icon || 'hub'}</span>
              {meta.label || platform}
            </button>
          );
        })}
      </div>

      {/* Active Caption Card */}
      {activeItem && (
        <div className="rounded-2xl border border-white/5 overflow-hidden"
          style={{ background: 'rgba(38,37,40,0.4)', backdropFilter: 'blur(24px)' }}>

          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: activeMeta.bg }}>
                <span className="material-symbols-outlined text-sm" style={{ color: activeMeta.color, fontVariationSettings: "'FILL' 1" }}>{activeMeta.icon}</span>
              </div>
              <span className="text-white font-bold text-sm">{activeMeta.label}</span>
            </div>
            <span className="text-[#acaaad] text-xs">{activeTone} · {lines || 10} lines</span>
          </div>

          {/* Content */}
          <div className="px-4 py-5">
            <pre className="text-[#e5e5e5] text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
              {activeItem.content}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4">
            <button
              onClick={() => handleCopy(activeItem.content, activeTab)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <span className="material-symbols-outlined text-sm">
                {copiedKey === activeTab ? 'check' : 'content_copy'}
              </span>
              {copiedKey === activeTab ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => handleShare(activeItem.content, activeTab)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)', color: 'white' }}>
              <span className="material-symbols-outlined text-sm">share</span>
              Share {activeMeta.label}
            </button>
          </div>
        </div>
      )}

      {/* All platforms quick copy list */}
      <div className="mt-6">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#acaaad] mb-3">All Platforms</h3>
        <div className="space-y-2">
          {generatedContent.map(({ platform, content }) => {
            const meta = PLATFORM_META[platform] || {};
            return (
              <div key={platform}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.05] transition-all cursor-pointer"
                onClick={() => setActiveTab(platform)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg }}>
                    <span className="material-symbols-outlined text-sm" style={{ color: meta.color, fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold">{meta.label}</p>
                    <p className="text-[#acaaad] text-xs truncate max-w-[200px] md:max-w-[400px]">{content.substring(0, 60)}…</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0 ml-2">
                  <button
                    onClick={e => { e.stopPropagation(); handleCopy(content, platform + '_quick'); }}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[#acaaad] text-xs">
                      {copiedKey === platform + '_quick' ? 'check' : 'content_copy'}
                    </span>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleShare(content, platform); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #cc97ff 0%, #c284ff 100%)' }}>
                    <span className="material-symbols-outlined text-white text-xs">share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}