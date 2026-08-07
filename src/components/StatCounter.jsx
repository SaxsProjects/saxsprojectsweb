import { useEffect, useRef, useState } from 'react';

/**
 * Animated count-up stat. Parses a leading number out of `value`
 * (e.g. "50+", "5★", "100+") and counts up to it once scrolled into view.
 * Honors prefers-reduced-motion by showing the final value immediately.
 */
export default function StatCounter({ value, label }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  const match = String(value).match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : String(value);

  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      setN(target);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  useEffect(() => {
    if (!shown) return;
    let raf;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, target]);

  const display = Number.isInteger(target) ? Math.round(n) : n.toFixed(1);

  return (
    <div className="stat-card reveal" ref={ref}>
      <div className="stat-num">{prefix}{display}{suffix}</div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.6rem' }}>
        {label}
      </p>
    </div>
  );
}
