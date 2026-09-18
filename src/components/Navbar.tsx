import {
  Wrench,
  Sun,
  Moon,
  Search,
  Calculator,
  FlaskConical,
  Hammer,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  Scale,
  FolderArchive,
  MessageSquarePlus
} from 'lucide-react';
import type { ActiveTab } from '../App';

interface NavbarProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenFeedback?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenSearch,
  onOpenFeedback,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'utilities', label: 'Utilities', icon: Scale },
    { id: 'labs', label: 'Labs', icon: FlaskConical },
    { id: 'workshop', label: 'Workshop', icon: Hammer },
    { id: 'formulas', label: 'Formulas', icon: BookOpen },
    { id: 'viva', label: 'Viva', icon: HelpCircle },
    { id: 'resources', label: 'Resources Hub', icon: FolderArchive },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#06090e]/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Logo & Sem 3 Badge */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group shrink-0 active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 rounded-full bg-[#05DF8E] flex items-center justify-center text-[#021B13] font-bold text-xs ring-1 ring-[#05DF8E]/40 shadow-emerald-glow">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Mech<span className="text-[#05DF8E]">Kit</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-200/70 dark:bg-white/[0.06] text-slate-700 dark:text-emerald-400 border border-slate-300/60 dark:border-white/10 uppercase tracking-wider">
                Sem 3
              </span>
            </div>
          </button>

          {/* Desktop Nav Items (Floating Pill Container) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-200/60 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm ring-1 ring-emerald-400/30 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Search Trigger (Pill Shaped) */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-emerald-500/40 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
              title="Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-mono opacity-60 px-1 rounded bg-black/5 dark:bg-white/10">⌘K</kbd>
            </button>

            {/* Feedback / Request Action */}
            {onOpenFeedback && (
              <button
                id="btn-nav-feedback"
                type="button"
                onClick={onOpenFeedback}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                title="Feedback / Request PYQ"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Feedback</span>
              </button>
            )}

            {/* Design Test Prototype Pill Switcher */}
            <button
              id="btn-nav-test"
              type="button"
              onClick={() => onNavigate('test')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                currentTab === 'test'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 ring-1 ring-emerald-400/30 shadow-sm'
                  : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60'
              }`}
              title="Preview /test Prototype"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>/test</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet quick scroll navigation bar - pill ribbon */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-200/70 dark:border-white/[0.08] scrollbar-none snap-x">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 snap-start cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm ring-1 ring-emerald-400/30 font-bold'
                    : 'text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
