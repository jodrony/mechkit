import React from 'react';
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
  FolderArchive
} from 'lucide-react';
import type { ActiveTab } from '../App';

interface NavbarProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenSearch,
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Logo & Sem 3 Badge */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-mech-blue flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                Mech<span className="text-mech-orange">Kit</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Sem 3
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-mech-blue text-white shadow-md ring-2 ring-mech-blue/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-[#1e293b] text-sm text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-mono opacity-60">⌘K</kbd>
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet quick scroll navigation bar - enlarged & prominent */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none snap-x">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 py-3 px-4 rounded-xl text-base font-bold whitespace-nowrap shrink-0 transition-all active:scale-95 snap-start cursor-pointer ${
                  isActive
                    ? 'bg-mech-blue text-white shadow-lg ring-2 ring-mech-blue/40 font-extrabold'
                    : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
