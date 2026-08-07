import { useEffect } from 'react';

/**
 * Observes every element with the `.reveal` class and adds `.is-visible`
 * when it scrolls into view. Re-runs whenever `dep` changes (e.g. the active
 * tab) so freshly mounted page content gets observed too. Degrades gracefully
 * when reduced motion is requested or IntersectionObserver is unavailable.
 */
export default function useScrollReveal(dep) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const els = Array.from(document.querySelectorAll('.reveal'));
    if (els.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dep]);
}
