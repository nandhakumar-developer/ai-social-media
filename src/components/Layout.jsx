import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <header className="fixed top-0 left-0 w-full z-[60] bg-[#0e0e10]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#cc97ff] dark:text-[#cc97ff] text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>auto_awesome</span>
          <h1 className="font-['Manrope'] tracking-tight font-bold text-xl font-black text-[#f6f3f5]">CaptivAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className={`md:flex hidden transition-colors px-4 py-2 rounded-xl text-sm font-medium ${path === '/' ? 'text-[#f6f3f5] bg-[#262528]' : 'text-[#acaaad] hover:bg-[#262528]'}`}>Home</Link>
          <Link to="/history" className={`md:flex hidden transition-colors px-4 py-2 rounded-xl text-sm font-medium ${path === '/history' ? 'text-[#f6f3f5] bg-[#262528]' : 'text-[#acaaad] hover:bg-[#262528]'}`}>History</Link>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden active:scale-95 duration-200 cursor-pointer">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5p7Acl53utCmifqWtegqP39uwaL4nsc9fvxPQGgkeMdK-WS5YRsTvMWVcVzk4pRVvZLzbPGEu7qzO8Vs5eDEONyOG4BccvGaYREHPkqMkoWsgRAXCZoYLjPpalTkhuXlNosKKMBdGocUxP-3o2GBZAp_9DkpV9Om49400cBi4P7RUlpGC38julNwNeLiwmwvmbULhf2e7-QsZtfS5uqcruZ0cBVAPZMCtwR4Xb_Dhc6UK1hgiDoJpRdTAhf5CKs9b1fD-wy9c-NNe" />
          </div>
        </div>
      </header>

      <div className="flex-grow w-full flex flex-col mt-[72px] pb-[96px] md:pb-0 z-10 relative">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-5 pt-3 bg-[#131315]/85 backdrop-blur-2xl z-[70] rounded-t-[1.25rem] border-t border-white/5 md:hidden">
        <Link to="/" className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-95 duration-200 transition-all ${path === '/' ? 'text-[#cc97ff]' : 'text-[#acaaad] hover:text-[#f6f3f5]'}`}>
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: path === '/' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="font-['Inter'] text-[9px] uppercase tracking-widest font-bold mt-0.5">Home</span>
        </Link>
        <Link to="/history" className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-95 duration-200 transition-all ${path === '/history' ? 'text-[#cc97ff]' : 'text-[#acaaad] hover:text-[#f6f3f5]'}`}>
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: path === '/history' ? "'FILL' 1" : "'FILL' 0" }}>history</span>
          <span className="font-['Inter'] text-[9px] uppercase tracking-widest font-bold mt-0.5">History</span>
        </Link>
      </nav>

      <div className="fixed top-0 right-0 z-0 w-[50vw] h-[442px] bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="fixed bottom-0 left-0 z-0 w-[40vw] h-[353px] bg-tertiary/5 blur-[100px] rounded-full"></div>
    </div>
  );
}
