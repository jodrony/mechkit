export * from './Home';
export { Home as Dashboard, Home as default } from './Home';

/**
 * Foolproof share & clipboard fallback helper for Dashboard & Creator Modal
 */
export const handleShare = async (showToast?: (msg: string) => void): Promise<void> => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mechkit.local';
  const shareData = {
    title: 'MechKit v0.3 — Diploma ME Sem 3 Portal',
    text: 'Access WBSCTE Sem 3 Lab Reports, Viva Prep, and 2018-2026 PYQs:',
    url: shareUrl
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

