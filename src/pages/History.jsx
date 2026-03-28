import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PLATFORM_META = {
  linkedin:  { label: 'LinkedIn',  icon: 'work',              color: '#0077b5', bg: 'rgba(0,119,181,0.12)' },
  instagram: { label: 'Instagram', icon: 'camera',            color: '#e4405f', bg: 'rgba(228,64,95,0.12)' },
  facebook:  { label: 'Facebook',  icon: 'social_leaderboard',color: '#1877f2', bg: 'rgba(24,119,242,0.12)' },
  whatsapp:  { label: 'WhatsApp',  icon: 'chat',              color: '#25d366', bg: 'rgba(37,211,102,0.12)' },
  mail:      { label: 'Email',     icon: 'mail',              color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('captivai_history') || '[]');
      setHistory(data);
    } catch { setHistory([]); }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Clear your entire generation history?')) {
      localStorage.removeItem('captivai_history');
      setHistory([]);
    }
  };

  const deleteItem = (id, e) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('captivai_history', JSON.stringify(updated));
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleCopy = async (text, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch { /* ignore */ }
  };

  const handleReuse = (item) => {
    // Navigate to results with saved data to reuse a history entry
    if (item.aiResults) {
      navigate('/results', {
        state: {
          base64: item.base64?.split(',')[1],
          mimeType: item.mimeType,
          fileName: item.imageName,
          tone: item.tone,
          platforms: item.platforms
            ? Object.fromEntries(item.platforms.map(p => [p, true]))
            : { linkedin: true, instagram: true },
          aiResults: item.aiResults,
        }
      });
    }
  };

  const filtered = history.filter(item =>
    item.imageName?.toLowerCase().includes(search.toLowerCase()) ||
    item.contentSnippet?.toLowerCase().includes(search.toLowerCase()) ||
    item.tone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-6 pb-32 px-4 md:px-6 max-w-3xl mx-auto">

      {/* Header */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[#cc97ff] font-bold text-[10px] uppercase tracking-widest mb-1 block">Activity Log</span>
          <h2 className="font-['Manrope'] text-3xl md:text-5xl font-extrabold tracking-tight text-white">History</h2>
          <p className="text-[#acaaad] text-sm md:text-base mt-1">Your previous AI-generated content sessions.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-[#fda4af] text-sm font-bold hover:bg-[#fda4af]/10 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Clear All
          </button>
        )}
      </section>

      {/* Search */}
      {history.length > 0 && (
        <div className="mb-6 flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 focus-within:border-[#cc97ff]/30 transition-all">
          <span className="material-symbols-outlined text-[#acaaad] text-sm">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-sm placeholder:text-[#acaaad]/50 w-full"
            placeholder="Search by filename, tone, or content…"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#acaaad] active:scale-95">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2rem]">
            <span className="material-symbols-outlined text-4xl text-[#acaaad] mb-3 block">history</span>
            <h3 className="font-['Manrope'] font-bold text-lg text-white mb-1">
              {search ? 'No results found' : 'No history yet'}
            </h3>
            <p className="text-[#acaaad] text-sm">
              {search ? 'Try a different search term.' : 'Your generated captions will appear here.'}
            </p>
          </div>
        ) : (
          filtered.map(item => {
            const isExpanded = expandedId === item.id;
            const platformKeys = item.platforms || [];

            return (
              <div
                key={item.id}
                className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden transition-all hover:bg-white/[0.05]"
              >
                {/* Main row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                    {item.base64 && !item.mimeType?.includes('video') && !item.mimeType?.includes('pdf') ? (
                      <img src={item.base64} alt={item.imageName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : item.mimeType?.includes('video') ? (
                      <span className="material-symbols-outlined text-[#67e8f9]" style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
                    ) : (
                      <span className="material-symbols-outlined text-[#fda4af]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                        style={{ background: 'rgba(204,151,255,0.15)', color: '#cc97ff' }}>
                        {item.tone || 'General'}
                      </span>
                      <span className="text-[#acaaad] text-[10px]">{timeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-white font-bold text-sm truncate">{item.imageName}</p>
                    <p className="text-[#acaaad] text-xs truncate mt-0.5">"{item.contentSnippet}"</p>

                    {/* Platform chips */}
                    {platformKeys.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {platformKeys.map(p => {
                          const meta = PLATFORM_META[p];
                          if (!meta) return null;
                          return (
                            <span key={p} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{ background: meta.bg, color: meta.color }}>
                              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                              {meta.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-1 flex-shrink-0">
                    {item.aiResults && (
                      <button
                        onClick={e => { e.stopPropagation(); handleReuse(item); }}
                        className="w-8 h-8 rounded-lg bg-[#cc97ff]/10 hover:bg-[#cc97ff]/20 flex items-center justify-center transition-all active:scale-95"
                        title="View results">
                        <span className="material-symbols-outlined text-[#cc97ff] text-xs">open_in_new</span>
                      </button>
                    )}
                    <button
                      onClick={e => deleteItem(item.id, e)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#fda4af]/10 flex items-center justify-center transition-all active:scale-95"
                      title="Delete">
                      <span className="material-symbols-outlined text-[#acaaad] hover:text-[#fda4af] text-xs">delete</span>
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#acaaad] text-xs transition-transform duration-200"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded: show all generated captions */}
                {isExpanded && item.aiResults && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-3">
                    {Object.entries(item.aiResults).map(([platform, content]) => {
                      const meta = PLATFORM_META[platform] || {};
                      return (
                        <div key={platform} className="rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: meta.bg }}>
                                <span className="material-symbols-outlined text-[10px]" style={{ color: meta.color, fontVariationSettings: "'FILL' 1" }}>{meta.icon}</span>
                              </div>
                              <span className="text-white font-bold text-xs">{meta.label || platform}</span>
                            </div>
                            <button
                              onClick={e => handleCopy(content, e)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#acaaad] text-[10px] transition-all active:scale-95">
                              <span className="material-symbols-outlined text-[10px]">content_copy</span>
                              Copy
                            </button>
                          </div>
                          <pre className="text-[#acaaad] text-xs leading-relaxed whitespace-pre-wrap font-sans break-words px-3 py-2.5 max-h-32 overflow-y-auto hide-scrollbar">
                            {content}
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Expanded but no aiResults — show snippet */}
                {isExpanded && !item.aiResults && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-3">
                    <p className="text-[#acaaad] text-xs leading-relaxed">{item.contentSnippet}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-[#acaaad] text-xs mt-8">
          {filtered.length} generation{filtered.length !== 1 ? 's' : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}
    </main>
  );
}