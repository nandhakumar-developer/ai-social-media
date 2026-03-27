import { useEffect, useState } from 'react';

const PLATFORM_META = {
  linkedin:  { label: 'LinkedIn',  color: '#0077b5' },
  instagram: { label: 'Instagram', color: '#e4405f' },
  facebook:  { label: 'Facebook',  color: '#1877f2' },
  whatsapp:  { label: 'WhatsApp',  color: '#25d366' },
  mail:      { label: 'Email',     color: '#f59e0b' },
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

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

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
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
          filtered.map(item => (
            <div
              key={item.id}
              className="group flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:bg-white/[0.06] transition-all cursor-pointer"
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
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide"
                    style={{ background: 'rgba(204,151,255,0.15)', color: '#cc97ff' }}>
                    {item.tone || 'General'}
                  </span>
                  <span className="text-[#acaaad] text-[10px]">{timeAgo(item.timestamp)}</span>
                </div>
                <p className="text-white font-bold text-sm truncate">{item.imageName}</p>
                <p className="text-[#acaaad] text-xs truncate mt-0.5">"{item.contentSnippet}"</p>
              </div>
            </div>
          ))
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