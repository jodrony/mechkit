import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  FileText,
  Download,
  X,
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { isPdfAvailable } from '../utils/pdfRegistry';

export interface ActivePdf {
  url: string;
  title: string;
  filename?: string;
}

interface PdfViewerModalProps {
  activePdf: ActivePdf | null;
  onClose: () => void;
}

/**
 * Robust loader for PDF.js library
 * 1. Uses window.pdfjsLib preloaded from /pdf.min.js
 * 2. Falls back to dynamic CDN script injection if needed
 */
const getPdfJsLib = async (): Promise<any> => {
  if (typeof window !== 'undefined' && (window as any).pdfjsLib) {
    const lib = (window as any).pdfjsLib;
    if (!lib.GlobalWorkerOptions.workerSrc) {
      lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
    return lib;
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window unavailable'));

    const existingScript = document.querySelector('script[data-pdfjs-cdn="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(lib);
        } else {
          reject(new Error('PDF.js library failed to initialize'));
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.setAttribute('data-pdfjs-cdn', 'true');
    script.async = true;
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      } else {
        reject(new Error('PDF.js failed to initialize from CDN'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
    document.head.appendChild(script);
  });
};

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ activePdf, onClose }) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [decodedPages, setDecodedPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRenderTasksRef = useRef<any[]>([]);
  const activeLoadingTaskRef = useRef<any>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePdf) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePdf, onClose]);

  // Cancel any active decoding/rendering tasks
  const cancelAllTasks = useCallback(() => {
    activeRenderTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch {
        // ignore cancellation exceptions
      }
    });
    activeRenderTasksRef.current = [];

    if (activeLoadingTaskRef.current) {
      try {
        activeLoadingTaskRef.current.destroy();
      } catch {
        // ignore destroy exceptions
      }
      activeLoadingTaskRef.current = null;
    }
  }, []);

  // Track active visible page while scrolling
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop + 80;

    for (let i = 0; i < pageRefs.current.length; i++) {
      const el = pageRefs.current[i];
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
          setCurrentPage(i + 1);
          break;
        }
      }
    }
  }, []);

  // Main client-side HTML5 canvas PDF rendering workflow
  const renderPdfDocument = useCallback(async () => {
    if (!activePdf) return;

    cancelAllTasks();
    setLoading(true);
    setError(null);
    setDecodedPages(0);
    setCurrentPage(1);

    try {
      const pdfjsLib = await getPdfJsLib();

      const loadingTask = pdfjsLib.getDocument({
        url: activePdf.url,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      });
      activeLoadingTaskRef.current = loadingTask;

      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      setTotalPages(numPages);

      // Initialize canvas and page refs
      canvasRefs.current = new Array(numPages).fill(null);
      pageRefs.current = new Array(numPages).fill(null);

      // Give React a tick to mount page canvas containers
      await new Promise((resolve) => setTimeout(resolve, 50));

      const containerWidth = containerRef.current
        ? containerRef.current.clientWidth - 32
        : window.innerWidth - 32;
      const availableWidth = Math.max(280, Math.min(containerWidth, 880));

      // Decode and render each page sequentially
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const baseScale = availableWidth / unscaledViewport.width;
        const scale = baseScale * zoom;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRefs.current[pageNum - 1];
        if (canvas) {
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = `${Math.floor(viewport.width)}px`;
            canvas.style.height = `${Math.floor(viewport.height)}px`;

            const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined;

            const renderTask = page.render({
              canvasContext: ctx,
              viewport,
              transform: transform as any,
            });

            activeRenderTasksRef.current.push(renderTask);

            try {
              await renderTask.promise;
            } catch (renderErr: any) {
              if (renderErr?.name !== 'RenderingCancelledException') {
                console.error(`Error rendering page ${pageNum}:`, renderErr);
              }
            }
          }
        }
        setDecodedPages(pageNum);
      }

      setLoading(false);
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('PDF Document rendering error:', err);
        setError(err?.message || 'Failed to render PDF document.');
        setLoading(false);
      }
    }
  }, [activePdf, zoom, cancelAllTasks]);

  // Trigger render when document or zoom scale changes
  useEffect(() => {
    if (activePdf) {
      renderPdfDocument();
    }
    return () => {
      cancelAllTasks();
    };
  }, [activePdf, zoom, renderPdfDocument, cancelAllTasks]);

  if (!activePdf) return null;

  const isAvailable = isPdfAvailable(activePdf.url);
  const downloadFilename = activePdf.filename || activePdf.url.split('/').pop() || 'document.pdf';

  return (
    <div
      id="pdf-viewer-modal"
      role="dialog"
      aria-modal="true"
      aria-label={activePdf.title}
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200 transform-gpu gpu-accelerated"
    >
      {/* 1. Sticky Top Navigation & Action Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 shadow-xl shrink-0 gap-2">
        {/* Document Identity & Page Indicator */}
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-mech-orange shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-100 text-xs sm:text-sm md:text-base truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {activePdf.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-slate-400">
              <span className="truncate">{downloadFilename}</span>
              {totalPages > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-mech-orange font-bold border border-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Controls (Desktop / Tablet) */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-xl px-1.5 py-1">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.7, Number((prev - 0.15).toFixed(2))))}
              title="Zoom Out"
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-300 px-1 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(2.0, Number((prev + 0.15).toFixed(2))))}
              title="Zoom In"
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoom !== 1.0 && (
              <button
                type="button"
                onClick={() => setZoom(1.0)}
                title="Reset Zoom"
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer ml-0.5"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Direct Explicit Download Icon Button */}
          <a
            id="btn-pdf-modal-download"
            href={activePdf.url}
            download={downloadFilename}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">Save PDF</span>
          </a>

          {/* Close Action Button with min 44x44px Tap Target */}
          <button
            id="btn-pdf-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close PDF viewer"
            className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Vertically Scrollable HTML5 Canvas PDF Container */}
      <main
        ref={containerRef}
        onScroll={handleScroll}
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
        className="flex-1 w-full overflow-y-auto overflow-x-hidden p-3 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
      >
        {/* A. 404 Guard State */}
        {!isAvailable && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white">
                Archive In Progress
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                📄 Archive in progress — This paper will be available shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all cursor-pointer active:scale-95"
            >
              Close Viewer
            </button>
          </div>
        )}

        {/* B. Loading Spinner & Progress */}
        {isAvailable && loading && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-mech-orange animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-mech-orange animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                Rendering document pages...
              </p>
              <p className="text-xs font-mono text-slate-400">
                {totalPages > 0
                  ? `Decoded page ${decodedPages} of ${totalPages}`
                  : 'Initializing client-side canvas renderer...'}
              </p>
            </div>
          </div>
        )}

        {/* C. Error State with Retry and Fallbacks */}
        {isAvailable && error && !loading && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white">
                Document Render Interrupted
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {error}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => renderPdfDocument()}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Rendering</span>
              </button>
              <a
                href={activePdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold bg-mech-orange hover:bg-orange-600 text-white flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </a>
            </div>
          </div>
        )}

        {/* D. Rendered Pages onto HTML5 Canvas Elements */}
        {isAvailable && totalPages > 0 && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNumber = idx + 1;
              return (
                <div
                  key={`pdf-page-${pageNumber}`}
                  ref={(el) => {
                    pageRefs.current[idx] = el;
                  }}
                  data-page={pageNumber}
                  className="bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-2xl p-2.5 sm:p-4 flex flex-col items-center space-y-3 transition-all group hover:border-slate-700"
                >
                  {/* Page Sub-Header Badge */}
                  <div className="flex items-center justify-between w-full px-2 text-xs font-mono text-slate-400">
                    <span className="font-bold text-slate-300">
                      Page {pageNumber} of {totalPages}
                    </span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      Client HTML5 Canvas
                    </span>
                  </div>

                  {/* High-Resolution Canvas Element */}
                  <div className="w-full flex items-center justify-center overflow-x-auto rounded-xl bg-slate-950 p-1">
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[idx] = el;
                      }}
                      className="max-w-full h-auto rounded shadow-md bg-white"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PdfViewerModal;
