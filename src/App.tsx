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
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'calculators' | 'utilities' | 'labs' | 'workshop' | 'formulas' | 'viva' | 'resources' | 'downloads';

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
];

const resolveTab = (tab: string | null): ActiveTab => {
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
  const [activeBoilerVivaId, setActiveBoilerVivaId] = useState<string>('babcock');

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

    if (initialTool) setActiveCalculatorTool(initialTool);
    if (initialBoiler) setActiveBoilerVivaId(initialBoiler);

    const initialUrl = window.location.search || '?tab=dashboard';
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

      if (event.state && event.state.tab) {
        const targetTab = resolveTab(event.state.tab);
        setCurrentTab(targetTab);
        if (event.state.toolId) {
          if (targetTab === 'calculators') {
            setActiveCalculatorTool(event.state.toolId);
          } else if (targetTab === 'viva') {
            setActiveBoilerVivaId(event.state.toolId);
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
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('mechkit-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('mechkit-theme', 'light');
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

  const handleNavigate = (tab: ActiveTab | string, toolId?: string) => {
    const target = resolveTab(tab);

    if (target === currentTab && !toolId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Push new state to browser history
    const searchParams = new URLSearchParams();
    searchParams.set('tab', target);
    if (toolId) {
      if (target === 'calculators') {
        searchParams.set('tool', toolId);
      } else if (target === 'viva') {
        searchParams.set('boiler', toolId);
      }
    }
    const newUrl = `?${searchParams.toString()}`;
    window.history.pushState({ tab: target, toolId }, '', newUrl);

    setCurrentTab(target);
    if (toolId) {
      if (target === 'calculators') {
        setActiveCalculatorTool(toolId);
      } else if (target === 'viva') {
        setActiveBoilerVivaId(toolId);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getModuleTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'calculators': return 'Module 2: Engineering Calculators';
      case 'utilities': return 'Module 3: Engineering Utilities';
      case 'labs': return 'Module 4: Lab Companion';
      case 'workshop': return 'Module 5: Workshop Reference';
      case 'formulas': return 'Module 6: Formula Library';
      case 'viva': return 'Module 7: Viva Practice Center';
      case 'resources':
      case 'downloads': return 'Module 7: Resources Hub';
      default: return 'Module 1: Dashboard';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-150 antialiased font-sans">
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
      {currentTab !== 'dashboard' && (
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-xs">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-none">
              {getModuleTitle(currentTab)}
            </span>
          </div>
        </div>
      )}

      {/* Independent full-screen view rendering */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <Home
            onNavigate={handleNavigate}
            onOpenCreator={handleOpenCreatorModal}
            onShare={handleShare}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}
        {currentTab === 'calculators' && <Calculators initialToolId={activeCalculatorTool} />}
        {currentTab === 'utilities' && <Utilities />}
        {currentTab === 'labs' && (
          <LabCompanion onNavigate={handleNavigate} onViewPdf={handleOpenPdf} />
        )}
        {currentTab === 'workshop' && <WorkshopReference />}
        {currentTab === 'formulas' && <FormulaLibrary onNavigate={handleNavigate} />}
        {currentTab === 'viva' && <VivaCenter initialMode="experiment" initialBoilerId={activeBoilerVivaId} />}
        {(currentTab === 'resources' || currentTab === 'downloads') && (
          <ResourcesHub onViewPdf={handleOpenPdf} />
        )}
      </main>

      {/* Persistent Floating Feedback Pill Trigger */}
      <button
        type="button"
        onClick={handleOpenFeedbackModal}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-150 active:scale-95 flex items-center gap-1.5 cursor-pointer group text-xs font-bold"
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

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
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
