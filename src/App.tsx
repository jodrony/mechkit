import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { CreatorModal } from './components/CreatorModal';
import { FeedbackModal } from './components/FeedbackModal';
import { PdfViewerModal, type ActivePdf } from './components/PdfViewerModal';
import { ToastProvider, useToast } from './components/Toast';
import { isPdfAvailable, shareMechKit } from './utils/pdfRegistry';
import { Home } from './pages/Home';
import { Calculators } from './pages/Calculators';
import { Utilities } from './pages/Utilities';
import { LabCompanion } from './pages/LabCompanion';
import { WorkshopReference } from './pages/WorkshopReference';
import { FormulaLibrary } from './pages/FormulaLibrary';
import { VivaCenter } from './pages/VivaCenter';
import { ResourcesHub } from './pages/ResourcesHub';
import { DesignTest } from './pages/DesignTest';
import {
  ArrowLeft,
  MessageSquarePlus,
  Calculator,
  FlaskConical,
  Search,
  BookOpen,
  FolderArchive
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'calculators' | 'utilities' | 'labs' | 'workshop' | 'formulas' | 'viva' | 'resources' | 'downloads' | 'test';

const VALID_TABS: ActiveTab[] = [
  'dashboard',
  'calculators',
  'utilities',
  'labs',
  'workshop',
  'formulas',
  'viva',
  'resources',
  'downloads',
  'test',
];

const resolveTab = (tab: string | null): ActiveTab => {
  if (typeof window !== 'undefined') {
    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    if (cleanPath === '/test') {
      return 'test';
    }
  }
  if (!tab) return 'dashboard';
  const resolved = tab === 'downloads' ? 'resources' : tab;
  return VALID_TABS.includes(resolved as ActiveTab) ? (resolved as ActiveTab) : 'dashboard';
};

function AppContent() {
  const { showToast } = useToast();

  // Initial active tab resolution from URL query parameters
  const [currentTab, setCurrentTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return resolveTab(params.get('tab'));
    }
    return 'dashboard';
  });

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState<boolean>(false);
  const isCreatorModalOpenRef = useRef<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const isFeedbackModalOpenRef = useRef<boolean>(false);
  const [activePdf, setActivePdf] = useState<ActivePdf | null>(null);
  const activePdfRef = useRef<ActivePdf | null>(null);
  const [activeCalculatorTool, setActiveCalculatorTool] = useState<string>('rpm');
  const [activeUtilityTool, setActiveUtilityTool] = useState<string>('density');
  const [activeBoilerVivaId, setActiveBoilerVivaId] = useState<string>('babcock');
  const [activeVivaMode, setActiveVivaMode] = useState<'experiment' | 'semester'>('experiment');

  // Keep refs synchronized for popstate callback without re-attaching listeners
  useEffect(() => {
    isCreatorModalOpenRef.current = isCreatorModalOpen;
  }, [isCreatorModalOpen]);

  useEffect(() => {
    isFeedbackModalOpenRef.current = isFeedbackModalOpen;
  }, [isFeedbackModalOpen]);

  useEffect(() => {
    activePdfRef.current = activePdf;
  }, [activePdf]);

  // Creator Modal Handlers with history back synchronization
  const handleOpenCreatorModal = () => {
    setIsCreatorModalOpen(true);
    isCreatorModalOpenRef.current = true;
    window.history.pushState({ modal: 'creator', tab: currentTab }, '', window.location.search);
  };

  const handleCloseCreatorModal = () => {
    if (isCreatorModalOpenRef.current) {
      setIsCreatorModalOpen(false);
      isCreatorModalOpenRef.current = false;
      if (window.history.state && window.history.state.modal === 'creator') {
        window.history.back();
      }
    }
  };

  // Feedback Modal Handlers with history back synchronization
  const handleOpenFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    isFeedbackModalOpenRef.current = true;
    window.history.pushState({ modal: 'feedback', tab: currentTab }, '', window.location.search);
  };

  const handleCloseFeedbackModal = () => {
    if (isFeedbackModalOpenRef.current) {
      setIsFeedbackModalOpen(false);
      isFeedbackModalOpenRef.current = false;
      if (window.history.state && window.history.state.modal === 'feedback') {
        window.history.back();
      }
    }
  };

  // PDF Viewer Modal Handlers with 404 Guard & History back sync
  const handleOpenPdf = (url: string, title: string) => {
    if (!isPdfAvailable(url)) {
      showToast('📄 Archive in progress — This paper will be available shortly.', 'warning');
      return;
    }
    setActivePdf({ url, title });
    activePdfRef.current = { url, title };
    window.history.pushState({ modal: 'pdf', tab: currentTab }, '', window.location.search);
  };

  const handleClosePdf = () => {
    if (activePdfRef.current) {
      setActivePdf(null);
      activePdfRef.current = null;
      if (window.history.state && window.history.state.modal === 'pdf') {
        window.history.back();
      }
    }
  };

  const handleShare = () => {
    shareMechKit((msg) => showToast(msg, 'success'));
  };

  // Initial mount check: register baseline history state and query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawTab = params.get('tab');
    const initialTab = resolveTab(rawTab);
    const initialTool = params.get('tool');
    const initialBoiler = params.get('boiler');

    if (initialTool) {
      if (initialTab === 'calculators') setActiveCalculatorTool(initialTool);
      if (initialTab === 'utilities') setActiveUtilityTool(initialTool);
    }
    if (initialBoiler) {
      if (initialBoiler === 'theory' || initialBoiler === 'semester') {
        setActiveVivaMode('semester');
      } else {
        setActiveVivaMode('experiment');
        setActiveBoilerVivaId(initialBoiler);
      }
    }

    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    const isTest = cleanPath === '/test';
    const initialUrl = isTest ? '/test' : (window.location.search || '?tab=dashboard');
    window.history.replaceState(
      { tab: initialTab, toolId: initialTool || initialBoiler },
      '',
      initialUrl
    );
  }, []);

  // Popstate event listener: Synchronize mobile back/forward buttons with tab state and modal state
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Intercept mobile back gesture/button: If PDF Viewer Modal is open, dismiss it first
      if (activePdfRef.current) {
        setActivePdf(null);
        activePdfRef.current = null;
        return;
      }

      // Intercept mobile back gesture/button: If Creator Modal is open, dismiss it first without leaving the view
      if (isCreatorModalOpenRef.current) {
        setIsCreatorModalOpen(false);
        isCreatorModalOpenRef.current = false;
        return;
      }

      // Intercept mobile back gesture/button: If Feedback Modal is open, dismiss it first without leaving the view
      if (isFeedbackModalOpenRef.current) {
        setIsFeedbackModalOpen(false);
        isFeedbackModalOpenRef.current = false;
        return;
      }

      // Restore modal if user navigated forward to a modal history state
      if (event.state && event.state.modal === 'creator') {
        setIsCreatorModalOpen(true);
        isCreatorModalOpenRef.current = true;
        return;
      }

      if (event.state && event.state.modal === 'feedback') {
        setIsFeedbackModalOpen(true);
        isFeedbackModalOpenRef.current = true;
        return;
      }

      const cleanPath = window.location.pathname.replace(/\/+$/, '');
      if (cleanPath === '/test') {
        setCurrentTab('test');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (event.state && event.state.tab) {
        const targetTab = resolveTab(event.state.tab);
        setCurrentTab(targetTab);
        if (event.state.toolId) {
          if (targetTab === 'calculators') {
            setActiveCalculatorTool(event.state.toolId);
          } else if (targetTab === 'utilities') {
            setActiveUtilityTool(event.state.toolId);
          } else if (targetTab === 'viva') {
            if (event.state.toolId === 'theory' || event.state.toolId === 'semester') {
              setActiveVivaMode('semester');
            } else {
              setActiveVivaMode('experiment');
              setActiveBoilerVivaId(event.state.toolId);
            }
          }
        }
      } else {
        // Default fallback when back stack reaches root
        const params = new URLSearchParams(window.location.search);
        const fallbackTab = resolveTab(params.get('tab'));
        setCurrentTab(fallbackTab);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Functional Light/Dark theme switching persisted across DOM and localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('mechkit-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('mechkit-theme', 'dark');
      if (metaTheme) metaTheme.setAttribute('content', '#06090e');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('mechkit-theme', 'light');
      if (metaTheme) metaTheme.setAttribute('content', '#f8fafc');
    }
  }, [isDark]);

  // Global search keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: ActiveTab | string, toolId?: string, elementId?: string) => {
    const target = resolveTab(tab);

    const cleanElementId = elementId ? elementId.replace(/^#/, '') : '';

    if (target === currentTab && !toolId && !cleanElementId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Push new state to browser history
    const searchParams = new URLSearchParams();
    searchParams.set('tab', target);
    if (toolId) {
      if (target === 'calculators' || target === 'utilities') {
        searchParams.set('tool', toolId);
      } else if (target === 'viva') {
        searchParams.set('boiler', toolId);
      }
    }
    const hash = cleanElementId ? `#${cleanElementId}` : window.location.hash;
    const newUrl = target === 'test' ? '/test' : `?${searchParams.toString()}${hash || ''}`;
    window.history.pushState({ tab: target, toolId, elementId: cleanElementId }, '', newUrl);
    if (cleanElementId) {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }

    setCurrentTab(target);
    if (toolId) {
      if (target === 'calculators') {
        setActiveCalculatorTool(toolId);
      } else if (target === 'utilities') {
        setActiveUtilityTool(toolId);
      } else if (target === 'viva') {
        if (toolId === 'theory' || toolId === 'semester') {
          setActiveVivaMode('semester');
        } else {
          setActiveVivaMode('experiment');
          setActiveBoilerVivaId(toolId);
        }
      }
    }
    if (!elementId && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getModuleTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'calculators': return 'Engineering Calculators';
      case 'utilities': return 'Engineering Utilities';
      case 'labs': return 'Lab Companion';
      case 'workshop': return 'Workshop Reference';
      case 'formulas': return 'Formula Library';
      case 'viva': return 'Viva Practice Center';
      case 'resources':
      case 'downloads': return 'Resources Hub';
      case 'test': return 'Design System Prototype';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#06090e] text-slate-900 dark:text-slate-100 transition-colors duration-150 antialiased font-sans selection:bg-[#05DF8E]/30 selection:text-white">
      {/* Sticky Compact Header */}
      <Navbar
        currentTab={currentTab === 'downloads' ? 'resources' : currentTab}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFeedback={handleOpenFeedbackModal}
      />

      {/* Sub-Header with "← Back to Dashboard" when inside any module */}
      {currentTab !== 'dashboard' && currentTab !== 'test' && (
        <div className="border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md sticky top-14 z-30">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 hover:border-[#05DF8E]/40 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-xs font-sans font-medium text-slate-600 dark:text-emerald-400 truncate max-w-[200px] sm:max-w-none">
              {getModuleTitle(currentTab)}
            </span>
          </div>
        </div>
      )}

      {/* Independent full-screen view rendering */}
      <main className="flex-1 pb-28">
        {currentTab === 'dashboard' && (
          <Home
            onNavigate={handleNavigate}
            onOpenCreator={handleOpenCreatorModal}
            onShare={handleShare}
            onOpenSearch={() => setIsSearchOpen(true)}
            onViewPdf={handleOpenPdf}
          />
        )}
        {currentTab === 'test' && (
          <DesignTest
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCreator={handleOpenCreatorModal}
            onShare={handleShare}
            onViewPdf={handleOpenPdf}
          />
        )}
        {currentTab === 'calculators' && <Calculators initialToolId={activeCalculatorTool} />}
        {currentTab === 'utilities' && <Utilities initialToolId={activeUtilityTool} />}
        {currentTab === 'labs' && (
          <LabCompanion onNavigate={handleNavigate} onViewPdf={handleOpenPdf} />
        )}
        {currentTab === 'workshop' && <WorkshopReference />}
        {currentTab === 'formulas' && <FormulaLibrary onNavigate={handleNavigate} />}
        {currentTab === 'viva' && <VivaCenter initialMode={activeVivaMode} initialBoilerId={activeBoilerVivaId} />}
        {(currentTab === 'resources' || currentTab === 'downloads') && (
          <ResourcesHub onViewPdf={handleOpenPdf} />
        )}
      </main>

      {/* Persistent Floating Feedback Pill Trigger */}
      <button
        type="button"
        onClick={handleOpenFeedbackModal}
        className="fixed bottom-24 right-5 md:bottom-6 md:right-6 z-40 px-3.5 py-2 rounded-full bg-[#05DF8E] text-[#021B13] font-semibold shadow-emerald-glow hover:bg-[#10F09C] transition-all duration-150 active:scale-95 hidden md:flex items-center gap-1.5 cursor-pointer group text-xs ring-1 ring-[#05DF8E]/50"
        title="Feedback & Resource Requests"
        aria-label="Feedback and Resource Requests"
      >
        <MessageSquarePlus className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span>Feedback</span>
      </button>

      {/* Compact Minimal Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCreator={handleOpenCreatorModal}
        onOpenFeedback={handleOpenFeedbackModal}
      />

      {/* Universal Floating Glassmorphic Bottom Navigation Dock (5 Items: Calcs, Labs, Search, Formulas, Resources) */}
      <nav
        aria-label="Bottom Navigation Dock"
        className="fixed bottom-0 inset-x-0 z-50 bg-white/90 dark:bg-zinc-950/85 backdrop-blur-xl border-t md:border-x border-slate-200 dark:border-white/10 px-4 sm:px-6 py-2 pb-5 sm:pb-3 flex justify-around items-center max-w-lg mx-auto md:rounded-t-2xl shadow-2xl"
      >
        {/* 1. Calculator */}
        <button
          type="button"
          onClick={() => handleNavigate('calculators')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 relative z-10 ${
            currentTab === 'calculators'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Calculator"
          title="Calculators"
        >
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Calculator</span>
          {currentTab === 'calculators' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 2. Lab */}
        <button
          type="button"
          onClick={() => handleNavigate('labs')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 relative z-10 ${
            currentTab === 'labs'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Lab"
          title="Lab Companion"
        >
          <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Lab</span>
          {currentTab === 'labs' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 3. Search (Central Prominent Button: Triggers Live SearchModal Palette) */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="w-12 h-12 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-600 dark:text-emerald-300 ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center active:scale-90 transition-all cursor-pointer shrink-0 mx-2 group relative z-10"
          aria-label="Action Search"
          title="Open Search Palette (⌘K)"
        >
          <Search className="w-5 h-5 transition-transform group-hover:scale-110 text-emerald-600 dark:text-emerald-300" />
          <span className="sr-only">Search</span>
        </button>

        {/* 4. Formula */}
        <button
          type="button"
          onClick={() => handleNavigate('formulas')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 relative z-10 ${
            currentTab === 'formulas'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Formula"
          title="Formulas"
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Formula</span>
          {currentTab === 'formulas' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>

        {/* 5. Resource */}
        <button
          type="button"
          onClick={() => handleNavigate('resources')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center transition-all cursor-pointer group relative active:scale-95 relative z-10 ${
            currentTab === 'resources' || currentTab === 'downloads'
              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Resource"
          title="Resources & PYQs"
        >
          <FolderArchive className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          <span className="text-[10px] mt-1 font-sans tracking-tight">Resource</span>
          <span className={`absolute top-2 right-2 sm:right-4 w-1.5 h-1.5 rounded-full ${
            currentTab === 'resources' || currentTab === 'downloads'
              ? 'bg-emerald-500 dark:bg-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-emerald-500/80 dark:bg-emerald-400/80'
          }`} />
          {(currentTab === 'resources' || currentTab === 'downloads') && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </button>
      </nav>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onViewPdf={handleOpenPdf}
      />

      {/* Creator Profile Bottom Sheet / Modal */}
      <CreatorModal
        isOpen={isCreatorModalOpen}
        onClose={handleCloseCreatorModal}
        onShare={handleShare}
      />

      {/* Direct Feedback & Contact Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
      />

      {/* In-App PDF Previewer Modal */}
      <PdfViewerModal
        activePdf={activePdf}
        onClose={handleClosePdf}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
      <Analytics />
    </ToastProvider>
  );
}

export default App;
