import { useEffect, useState } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('captivai_history') || '[]');
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire generation history?")) {
      localStorage.removeItem('captivai_history');
      setHistory([]);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  return (
    <main className="min-h-screen pt-24 pb-32 px-6 max-w-4xl mx-auto">
      
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <span className="font-label text-xs uppercase tracking-widest text-tertiary font-semibold">Activity Log</span>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">History</h2>
          <p className="text-on-surface-variant max-w-md text-lg">Review and manage your previous AI visual explorations.</p>
        </div>
        <button onClick={clearHistory} className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-highest hover:bg-error-container transition-all active:scale-95 duration-200">
          <span className="material-symbols-outlined text-error group-hover:text-on-error">delete_sweep</span>
          <span className="font-label text-sm font-bold text-error group-hover:text-on-error uppercase tracking-wider">Clear History</span>
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-surface-container-low p-4 rounded-2xl flex items-center gap-3 focus-within:shadow-[0_0_12px_rgba(204,151,255,0.1)] transition-shadow">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-body placeholder:text-on-surface-variant/50 outline-none" placeholder="Search prompts or tags..." type="text"/>
        </div>
        <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
          <span className="font-label text-sm text-on-surface-variant">Sort by: <span className="text-primary">Recent</span></span>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">expand_more</span>
        </div>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center p-12 bg-surface-container-low outline-dashed outline-2 outline-outline-variant/20 rounded-[2rem]">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">history</span>
            <h3 className="font-headline font-bold text-xl mb-2">No history yet</h3>
            <p className="text-on-surface-variant text-sm">Your generated posts will appear here after you upload and analyze media.</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="group bg-surface-container-low p-4 rounded-[1.5rem] flex flex-col md:flex-row md:items-center gap-5 hover:bg-surface-container-high transition-all cursor-pointer">
              <div className="relative w-full h-32 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center">
                {item.base64 ? (
                  item.mimeType?.includes('video') ? (
                    <span className="material-symbols-outlined text-primary text-4xl">movie</span>
                  ) : item.mimeType?.includes('pdf') ? (
                    <span className="material-symbols-outlined text-secondary text-4xl">description</span>
                  ) : (
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.base64} alt={item.imageName} />
                  )
                ) : (
                  <span className="material-symbols-outlined text-primary text-3xl">image</span>
                )}
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-[10px] text-on-secondary-container font-bold uppercase tracking-tighter">{item.tone || 'General'}</span>
                  <span className="text-[11px] text-on-surface-variant font-medium">{timeAgo(item.timestamp)}</span>
                </div>
                <h3 className="font-headline font-bold text-lg truncate group-hover:text-primary transition-colors">{item.imageName}</h3>
                <p className="text-sm text-on-surface-variant truncate font-body">"{item.contentSnippet}"</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {history.length > 0 && (
        <div className="mt-12 flex justify-center">
          <p className="text-sm text-on-surface-variant">Showing {history.length} recent generation{history.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </main>
  );
}
