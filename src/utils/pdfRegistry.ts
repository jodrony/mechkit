/**
 * PDF Registry & Static Asset Guard
 * Tracks all officially uploaded and available PDF documents in public/
 */

export const REGISTERED_PDF_ASSETS = new Set<string>([
  // Academic & Curriculum Utilities
  '/academic/academic_calendar_2026_2027.pdf',
  '/syllabus/DME_3rd_Semester_Syllabus.pdf',
  '/routine/college_routine_sem3.pdf',
  '/routine/simplified_routine_sem3.pdf',
  '/templates/universal_assignment_lab_master.pdf',
  '/labs/thermal_front_index.pdf',

  // Thermal Engineering Lab Manuals
  '/labs/exp1_tl.pdf',
  '/labs/exp2_tl.pdf',
  '/labs/exp3_tl.pdf',

  // PYQ Master Archives
  '/pyq/sem3_pyq_master_all.pdf',
  '/pyq/sem3_pyq_master_2018_2026.pdf',
  '/pyq/som_pyq_all.pdf',
  '/pyq/thermal_pyq_all.pdf',
  '/pyq/mfg1_pyq_all.pdf',
  '/pyq/materials_pyq_all.pdf',
  '/pyq/drawing_pyq_all.pdf',

  // Strength of Materials (SOM) Sessions
  '/pyq/som_2018.pdf',
  '/pyq/som_2021.pdf',
  '/pyq/som_2022.pdf',
  '/pyq/som_2023.pdf',
  '/pyq/som_2024_jan.pdf',
  '/pyq/som_2024_dec.pdf',
  '/pyq/som_2026.pdf',

  // Thermal Engineering-I Sessions
  '/pyq/thermal_2018.pdf',
  '/pyq/thermal_2019.pdf',
  '/pyq/thermal_2021.pdf',
  '/pyq/thermal_2022.pdf',
  '/pyq/thermal_2023.pdf',
  '/pyq/thermal_2024_jan.pdf',
  '/pyq/thermal_2024_dec.pdf',
  '/pyq/thermal_2026.pdf',

  // Manufacturing Processes-I Sessions
  '/pyq/mfg1_2017.pdf',
  '/pyq/mfg1_2018.pdf',
  '/pyq/mfg1_2019.pdf',
  '/pyq/mfg1_2021.pdf',
  '/pyq/mfg1_2022.pdf',
  '/pyq/mfg1_2023.pdf',
  '/pyq/mfg1_2024_jan.pdf',
  '/pyq/mfg1_2024_dec.pdf',
  '/pyq/mfg1_2026.pdf',

  // Mechanical Engineering Materials Sessions
  '/pyq/materials_2018.pdf',
  '/pyq/materials_2019.pdf',
  '/pyq/materials_2022.pdf',
  '/pyq/materials_2023.pdf',
  '/pyq/materials_2024_jan.pdf',
  '/pyq/materials_2024_dec.pdf',
  '/pyq/materials_2026.pdf',
]);

/**
 * Checks if a PDF asset is officially registered and present
 */
export const isPdfAvailable = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return REGISTERED_PDF_ASSETS.has(normalized);
};

/**
 * Native Web Share API helper with clipboard & textarea fallback
 */
export const shareMechKit = async (
  showToast?: (msg: string) => void
): Promise<void> => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mechkit.local';
  const shareData = {
    title: 'MechKit v0.3 — Diploma ME Sem 3 Portal',
    text: 'Access WBSCTE Sem 3 Lab Reports, Viva Prep, and 2018-2026 PYQs:',
    url: shareUrl,
  };

  // Attempt native share if supported and in secure context (works automatically on production HTTPS)
  if (typeof navigator !== 'undefined' && navigator.share && typeof window !== 'undefined' && window.isSecureContext) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
    }
  }

  // Robust fallback for HTTP / Localhost preview:
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
    } else if (typeof document !== 'undefined') {
      // Older mobile fallback using textarea
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    // Trigger a visible toast banner at the top or bottom of the screen
    showToast?.('Link copied to clipboard! Share it in your WhatsApp group.');
  } catch (err) {
    showToast?.('Unable to auto-copy. App URL: ' + (typeof window !== 'undefined' ? window.location.origin : ''));
  }
};
