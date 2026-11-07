// ScrollExpandMedia — vanilla JS. A landscape card opens smoothly to full-bleed as you scroll.
// Uses clip-path (GPU-friendly) + eased, inertial progress so it never feels jumpy.
export function initScrollExpandMedia() {
  const section = document.getElementById('about');
  if (!section) return;

  const bgImg = document.getElementById('sem-bg-img');
  const media = document.getElementById('sem-media-container');
  const mediaImg = document.getElementById('sem-media-img');
  const mediaBlur = document.getElementById('sem-media-blur');
  const overlay = document.getElementById('sem-media-overlay');
  const titleFirst = document.getElementById('sem-title-first');
  const titleRest = document.getElementById('sem-title-rest');
  const prompt = document.querySelector('.sem-prompt');
  const content = document.getElementById('sem-media-content');
  if (!media) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  // Starting card size, expressed as the inset (in %) on each side of the viewport
  function startInset() {
    const w = window.innerWidth;
    if (w < 640) return { x: 9, y: 25 };    // phone: ~82vw x 50vh
    if (w < 1024) return { x: 16, y: 21 };  // tablet: ~68vw
    return { x: 25, y: 19 };                // desktop: 50vw x 62vh
  }

  let target = 0, current = 0, raf = 0;

  function apply(p) {
    const e = easeInOut(p);
    const s = startInset();
    const x = (s.x * (1 - e)).toFixed(3);
    const y = (s.y * (1 - e)).toFixed(3);
    const r = (24 * (1 - e)).toFixed(2);
    media.style.clipPath = `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`;

    const sc = (1.15 - 0.15 * e).toFixed(4);
    if (mediaImg) mediaImg.style.transform = `scale(${sc})`;
    if (mediaBlur) {
      mediaBlur.style.transform = `scale(${(1.15 - 0.07 * e).toFixed(4)})`;
      mediaBlur.style.opacity = Math.max(0, 1 - e * 2.2).toFixed(3);
      mediaBlur.style.visibility = e < 0.46 ? 'visible' : 'hidden';
    }
    if (overlay) overlay.style.opacity = (0.85 - 0.45 * e).toFixed(3);
    if (bgImg) bgImg.style.opacity = Math.max(0, 1 - e * 1.4).toFixed(3);

    // Title drifts apart and fades
    const drift = (e * 22).toFixed(2);
    const tOp = Math.max(0, 1 - e * 1.9).toFixed(3);
    if (titleFirst) { titleFirst.style.transform = `translate3d(-${drift}vw,0,0)`; titleFirst.style.opacity = tOp; }
    if (titleRest) { titleRest.style.transform = `translate3d(${drift}vw,0,0)`; titleRest.style.opacity = tOp; }
    if (prompt) prompt.style.opacity = Math.max(0, 1 - e * 3).toFixed(3);

    // About details fade in once fully open
    if (content) {
      const f = clamp01((e - 0.82) / 0.18);
      content.style.opacity = f.toFixed(3);
      content.style.transform = `translateY(${((1 - f) * 14).toFixed(1)}px)`;
      content.style.pointerEvents = f > 0.5 ? 'auto' : 'none';
    }
  }

  function readTarget() {
    const rect = section.getBoundingClientRect();
    const track = section.offsetHeight - window.innerHeight;
    if (track <= 0) { target = 0; return; }
    const raw = -rect.top / track;
    // Expand over the first ~65% of the scroll track, then hold fully open
    target = clamp01(raw / 0.65);
  }

  function loop() {
    raf = 0;
    if (reduced) current = target;
    else current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    if (current !== target) raf = requestAnimationFrame(loop);
  }
  function kick() { readTarget(); if (!raf) raf = requestAnimationFrame(loop); }

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick, { passive: true });
  readTarget(); current = target; apply(current);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollExpandMedia);
} else {
  initScrollExpandMedia();
}
