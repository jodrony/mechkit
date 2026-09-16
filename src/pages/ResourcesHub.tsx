import React, { useState, useMemo, useCallback } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BookOpen,
  FolderArchive,
  Search,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Eye,
  FileDown,
  Sparkles
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { isPdfAvailable } from '../utils/pdfRegistry';

interface PYQSession {
  sessionLabel: string;
  fileUrl: string;
  year?: number | string;
  session?: string;
  title?: string;
  filename?: string;
}

interface SubjectPYQGroup {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  masterArchiveUrl: string;
  sessions?: PYQSession[];
}

export interface ResourcesHubProps {
  onViewPdf?: (url: string, title: string) => void;
}

export const ResourcesHub: React.FC<ResourcesHubProps> = ({ onViewPdf }) => {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'pyq'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const matchesSearch = useCallback(
    (item: { year?: number | string; session?: string; title?: string; filename?: string }) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = item.title?.toLowerCase().includes(q);
      const yearMatch = String(item.year || '').toLowerCase().includes(q);
      const sessionMatch = item.session?.toLowerCase().includes(q);
      const fileMatch = item.filename?.toLowerCase().includes(q);
      return Boolean(titleMatch || yearMatch || sessionMatch || fileMatch);
    },
    [searchQuery]
  );

  const handleView = (url: string, title: string) => {
    if (!isPdfAvailable(url)) {
      showToast('📄 Archive in progress — This paper will be available shortly.', 'warning');
      return;
    }
    if (onViewPdf) {
      onViewPdf(url, title);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadClick = (e: React.MouseEvent, url: string) => {
    if (!isPdfAvailable(url)) {
      e.preventDefault();
      showToast('📄 Archive in progress — This paper will be available shortly.', 'warning');
    }
  };

  const pyqSubjects: SubjectPYQGroup[] = [
    {
      id: 'som',
      code: 'MEPC 205',
      title: 'Strength of Materials (SOM)',
      shortTitle: 'SOM',
      masterArchiveUrl: '/pyq/som_pyq_all.pdf',
      sessions: [
        { sessionLabel: '2018', fileUrl: '/pyq/som_2018.pdf' },
        { sessionLabel: '2021', fileUrl: '/pyq/som_2021.pdf' },
        { sessionLabel: '2022', fileUrl: '/pyq/som_2022.pdf' },
        { sessionLabel: '2023', fileUrl: '/pyq/som_2023.pdf' },
        { sessionLabel: '2024 (Jan)', fileUrl: '/pyq/som_2024_jan.pdf' },
        { sessionLabel: '2024 (Dec)', fileUrl: '/pyq/som_2024_dec.pdf' },
        { sessionLabel: '2026', fileUrl: '/pyq/som_2026.pdf' },
      ],
    },
    {
      id: 'thermal',
      code: 'MEPC 209',
      title: 'Thermal Engineering-I',
      shortTitle: 'Thermal-I',
      masterArchiveUrl: '/pyq/thermal_pyq_all.pdf',
      sessions: [
        { sessionLabel: '2018', fileUrl: '/pyq/thermal_2018.pdf' },
        { sessionLabel: '2019', fileUrl: '/pyq/thermal_2019.pdf' },
        { sessionLabel: '2021', fileUrl: '/pyq/thermal_2021.pdf' },
        { sessionLabel: '2022', fileUrl: '/pyq/thermal_2022.pdf' },
        { sessionLabel: '2023', fileUrl: '/pyq/thermal_2023.pdf' },
        { sessionLabel: '2024 (Jan)', fileUrl: '/pyq/thermal_2024_jan.pdf' },
        { sessionLabel: '2024 (Dec)', fileUrl: '/pyq/thermal_2024_dec.pdf' },
        { sessionLabel: '2026', fileUrl: '/pyq/thermal_2026.pdf' },
      ],
    },
    {
      id: 'mfg',
      code: 'MEPC 207',
      title: 'Manufacturing Processes-I',
      shortTitle: 'Mfg Processes-I',
      masterArchiveUrl: '/pyq/mfg1_pyq_all.pdf',
      sessions: [
        { sessionLabel: '2017', fileUrl: '/pyq/mfg1_2017.pdf' },
        { sessionLabel: '2018', fileUrl: '/pyq/mfg1_2018.pdf' },
        { sessionLabel: '2019', fileUrl: '/pyq/mfg1_2019.pdf' },
        { sessionLabel: '2021', fileUrl: '/pyq/mfg1_2021.pdf' },
        { sessionLabel: '2022', fileUrl: '/pyq/mfg1_2022.pdf' },
        { sessionLabel: '2023', fileUrl: '/pyq/mfg1_2023.pdf' },
        { sessionLabel: '2024 (Jan)', fileUrl: '/pyq/mfg1_2024_jan.pdf' },
        { sessionLabel: '2024 (Dec)', fileUrl: '/pyq/mfg1_2024_dec.pdf' },
        { sessionLabel: '2026', fileUrl: '/pyq/mfg1_2026.pdf' },
      ],
    },
    {
      id: 'materials',
      code: 'MEPC 203',
      title: 'Mechanical Engineering Materials',
      shortTitle: 'Materials',
      masterArchiveUrl: '/pyq/materials_pyq_all.pdf',
      sessions: [
        { sessionLabel: '2018', fileUrl: '/pyq/materials_2018.pdf' },
        { sessionLabel: '2019', fileUrl: '/pyq/materials_2019.pdf' },
        { sessionLabel: '2022', fileUrl: '/pyq/materials_2022.pdf' },
        { sessionLabel: '2023', fileUrl: '/pyq/materials_2023.pdf' },
        { sessionLabel: '2024 (Jan)', fileUrl: '/pyq/materials_2024_jan.pdf' },
        { sessionLabel: '2024 (Dec)', fileUrl: '/pyq/materials_2024_dec.pdf' },
        { sessionLabel: '2026', fileUrl: '/pyq/materials_2026.pdf' },
      ],
    },
    {
      id: 'drawing',
      code: 'MEPC 201',
      title: 'Mechanical Engineering Drawing',
      shortTitle: 'Engg Drawing',
      masterArchiveUrl: '/pyq/drawing_pyq_all.pdf',
    },
  ];

  // Real-time query filtering across subjects and individual session papers
  const searchedSubjects = useMemo<SubjectPYQGroup[]>(() => {
    const list = selectedSubject === 'all'
      ? pyqSubjects
      : pyqSubjects.filter((s) => s.id === selectedSubject);

    if (!searchQuery.trim()) return list;

    const result: SubjectPYQGroup[] = [];

    for (const sub of list) {
      const masterFilename = sub.masterArchiveUrl.split('/').pop() || '';
      const subjectTitleMatches =
        matchesSearch({
          title: sub.title,
          filename: masterFilename,
        }) ||
        matchesSearch({
          title: sub.shortTitle,
          filename: masterFilename,
        }) ||
        matchesSearch({
          title: sub.code,
          filename: masterFilename,
        });

      const matchingSessions = sub.sessions?.filter((sess) => {
        const year = sess.sessionLabel.match(/\d{4}/)?.[0] || '';
        const filename = sess.fileUrl.split('/').pop() || '';
        return matchesSearch({
          year: sess.year || year,
          session: sess.session || sess.sessionLabel,
          title: sess.title || `${sub.title} ${sess.sessionLabel}`,
          filename: sess.filename || filename,
        });
      });

      if (matchingSessions && matchingSessions.length > 0) {
        result.push({
          ...sub,
          sessions: matchingSessions,
        });
      } else if (subjectTitleMatches) {
        result.push({
          ...sub,
          sessions: sub.sessions,
        });
      }
    }

    return result;
  }, [pyqSubjects, selectedSubject, searchQuery, matchesSearch]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-orange-500/10 text-mech-orange">
            <FolderArchive className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Resources Hub
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            Module 7 • Sem 3 ME
          </span>
        </div>
      </div>

      {/* Top Segmented Filter Controls */}
      <div className="flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`flex-1 min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeCategory === 'all'
              ? 'bg-white dark:bg-[#1e293b] text-mech-orange shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Resources
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('academic')}
          className={`flex-1 min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeCategory === 'academic'
              ? 'bg-white dark:bg-[#1e293b] text-mech-orange shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Academic Utilities (5 PDFs)
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('pyq')}
          className={`flex-1 min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
            activeCategory === 'pyq'
              ? 'bg-white dark:bg-[#1e293b] text-mech-orange shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          PYQ Archives (37 Papers)
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* ==================================================== */}
        {/* SECTION A: Core Academic Utilities & Submission Kits */}
        {/* ==================================================== */}
        {(activeCategory === 'all' || activeCategory === 'academic') && (
          <section className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mech-orange" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  A. Core Academic Utilities &amp; Submission Kits
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>5 Core PDFs Ready</span>
              </span>
            </div>

            {/* Vertically Stacked Mobile-First Cards */}
            <div className="space-y-2.5 sm:space-y-3">
              {/* Card 1: Academic Calendar (2026–2027) */}
              <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-orange-500/10 text-mech-orange shrink-0">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Academic Calendar 2026–2027
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60">
                        Official
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                    <button
                      id="btn-view-calendar"
                      type="button"
                      onClick={() => handleView('/academic/academic_calendar_2026_2027.pdf', 'Academic Calendar 2026–2027')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-mech-orange shrink-0" />
                      <span>View PDF</span>
                    </button>
                    <a
                      id="btn-download-calendar"
                      href="/academic/academic_calendar_2026_2027.pdf"
                      download="academic_calendar_2026_2027.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleDownloadClick(e, '/academic/academic_calendar_2026_2027.pdf')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 2: Master Syllabus (Revised 2022) */}
              <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-mech-blue dark:text-blue-400 shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Master Syllabus (Revised 2022)
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                        Official
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                    <button
                      id="btn-view-syllabus"
                      type="button"
                      onClick={() => handleView('/syllabus/DME_3rd_Semester_Syllabus.pdf', 'Master Syllabus (Revised 2022)')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>View PDF</span>
                    </button>
                    <a
                      id="btn-download-syllabus"
                      href="/syllabus/DME_3rd_Semester_Syllabus.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      download="DME_3rd_Semester_Syllabus.pdf"
                      onClick={(e) => handleDownloadClick(e, '/syllabus/DME_3rd_Semester_Syllabus.pdf')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 3: Class Routine (Dual View) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Routine A: Official College Routine */}
                <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Official College Routine
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                        Timetable
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-view-college-routine"
                      type="button"
                      onClick={() => handleView('/routine/college_routine_sem3.pdf', 'Official College Routine')}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-mech-orange shrink-0" />
                      <span>View PDF</span>
                    </button>
                    <a
                      id="btn-download-college-routine"
                      href="/routine/college_routine_sem3.pdf"
                      download="college_routine_sem3.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleDownloadClick(e, '/routine/college_routine_sem3.pdf')}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>

                {/* Routine B: Simplified Student Routine */}
                <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Simplified Student Routine
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                        Student View
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-view-simplified-routine"
                      type="button"
                      onClick={() => handleView('/routine/simplified_routine_sem3.pdf', 'Simplified Student Routine')}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>View PDF</span>
                    </button>
                    <a
                      id="btn-download-simplified-routine"
                      href="/routine/simplified_routine_sem3.pdf"
                      download="simplified_routine_sem3.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleDownloadClick(e, '/routine/simplified_routine_sem3.pdf')}
                      className="flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 4: Universal Assignment & Lab Record Kit */}
              <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Universal Assignment &amp; Lab Record Kit
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        Universal
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                    <button
                      id="btn-view-universal-kit"
                      type="button"
                      onClick={() => handleView('/templates/universal_assignment_lab_master.pdf', 'Universal Lab & Assignment Kit')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>View PDF</span>
                    </button>
                    <a
                      id="btn-download-universal-kit"
                      href="/templates/universal_assignment_lab_master.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      download="universal_assignment_lab_master.pdf"
                      onClick={(e) => handleDownloadClick(e, '/templates/universal_assignment_lab_master.pdf')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Card 5: Companion Lab Kit: Thermal Engineering-I */}
              <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1e293b] border border-amber-300/80 dark:border-amber-700/60 shadow-xs hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        Thermal Engineering-I Lab Report Kit
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        MEPC 215
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                    <button
                      id="btn-view-thermal-kit"
                      type="button"
                      onClick={() => handleView('/labs/thermal_front_index.pdf', 'Thermal Engineering-I Lab Report Kit')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>View PDF</span>
                    </button>
                    <a
                      id="btn-download-thermal-kit"
                      href="/labs/thermal_front_index.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      download="thermal_front_index.pdf"
                      onClick={(e) => handleDownloadClick(e, '/labs/thermal_front_index.pdf')}
                      className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-mech-orange hover:bg-orange-600 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* SECTION B: Previous Year Questions (PYQs)            */}
        {/* ==================================================== */}
        {(activeCategory === 'all' || activeCategory === 'pyq') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  B. Previous Year Questions (PYQs)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>37 Official PDF Archives Ready</span>
              </span>
            </div>

            {/* Top Banner: All-Semester-3 Master Archive Mega Bundle */}
            <div className="py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/50 border-2 border-purple-500/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-base sm:text-lg text-white">
                    3rd Sem Complete PYQ Mega Bundle
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    2017–2026
                  </span>
                </div>
              </div>

              {/* Mega Bundle Dual Actions */}
              <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                <button
                  id="btn-view-mega-bundle"
                  type="button"
                  onClick={() => handleView('/pyq/sem3_pyq_master_all.pdf', '3rd Sem Complete PYQ Mega Bundle')}
                  className="flex-1 sm:flex-initial min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Eye className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>View PDF</span>
                </button>
                <a
                  id="btn-download-mega-bundle"
                  href="/pyq/sem3_pyq_master_all.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="sem3_pyq_master_all.pdf"
                  onClick={(e) => handleDownloadClick(e, '/pyq/sem3_pyq_master_all.pdf')}
                  className="flex-1 sm:flex-initial min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Instant In-Page PYQ Search & Filter Bar */}
            <div className="sticky top-0 z-20 py-2.5 bg-slate-50/95 dark:bg-[#0f172a]/95 backdrop-blur-md">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  id="input-pyq-filter"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter sessions or years (e.g. 2024, Jan, Dec, 2026)..."
                  className="w-full min-h-[44px] pl-10 pr-10 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-xs"
                />
                {searchQuery && (
                  <button
                    id="btn-clear-pyq-filter"
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear filter"
                    className="absolute right-2 p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
              <button
                type="button"
                onClick={() => setSelectedSubject('all')}
                className={`px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  selectedSubject === 'all'
                    ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/30'
                    : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                }`}
              >
                All Subjects ({pyqSubjects.length})
              </button>
              {pyqSubjects.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`px-3.5 py-2 min-h-[44px] rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                    selectedSubject === sub.id
                      ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-500/30'
                      : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                  }`}
                >
                  {sub.shortTitle}
                </button>
              ))}
            </div>

            {/* Subject Cards Grid */}
            <div className="space-y-4">
              {searchedSubjects.length === 0 ? (
                <div className="p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                      No papers matching &apos;{searchQuery}&apos;
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              ) : (
                searchedSubjects.map((sub) => (
                  <div
                    key={sub.id}
                    id={`pyq-card-${sub.id}`}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '0 120px' }}
                    className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xs space-y-3 hover:border-purple-300/60 dark:hover:border-purple-800/60 transition-all content-visibility-auto"
                  >
                    {/* Subject Header & Master Archive Dual Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60">
                          {sub.code}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {sub.title}
                        </h4>
                      </div>

                      {/* Master Archive Dual Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleView(sub.masterArchiveUrl, `${sub.title} — Master Archive`)}
                          className="flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          <span>View Master PDF</span>
                        </button>
                        <a
                          href={sub.masterArchiveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={`${sub.id}_pyq_all.pdf`}
                          onClick={(e) => handleDownloadClick(e, sub.masterArchiveUrl)}
                          className="flex-1 sm:flex-initial min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
                        >
                          <FileDown className="w-3.5 h-3.5 shrink-0" />
                          <span>Download Archive</span>
                        </a>
                      </div>
                    </div>

                    {/* Sessions Grid (or Single Master Note for Drawing) */}
                    {sub.sessions && sub.sessions.length > 0 ? (
                      <div className="space-y-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                          Available Sessions ({sub.sessions.length} Papers):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                          {sub.sessions.map((sess) => (
                            <div
                              key={sess.fileUrl}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2.5 transition-all hover:border-purple-300 dark:hover:border-purple-700 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                                  {sess.sessionLabel}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-500/10 font-bold uppercase">
                                  PDF
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => handleView(sess.fileUrl, `${sub.shortTitle} — ${sess.sessionLabel}`)}
                                  className="flex-1 min-h-[40px] px-2 py-1.5 text-xs font-bold rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                                  title={`View ${sub.shortTitle} ${sess.sessionLabel}`}
                                >
                                  <Eye className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                  <span>View</span>
                                </button>
                                <a
                                  href={sess.fileUrl}
                                  download={sess.fileUrl.replace('/pyq/', '')}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => handleDownloadClick(e, sess.fileUrl)}
                                  className="flex-1 min-h-[40px] px-2 py-1.5 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                                  title={`Download ${sub.shortTitle} ${sess.sessionLabel}`}
                                >
                                  <Download className="w-3.5 h-3.5 shrink-0" />
                                  <span>Download</span>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : sub.id === 'drawing' ? (
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          Complete Master Drawing Question Archive
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shrink-0">
                          Consolidated PDF
                        </span>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                          No papers matching &apos;{searchQuery}&apos;
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResourcesHub;
