/* ============================================================
   BEACON WEB — NESW Ticker
   Smooth infinite scroll ticker
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', initTicker);

function initTicker() {
  const wraps = document.querySelectorAll('.ticker-wrap');
  if (!wraps.length) return;

  wraps.forEach(wrap => {
    const track = wrap.querySelector('.ticker-track');
    if (!track) return;

    // Clone the track content to create seamless loop
    const clone = track.cloneNode(true);
    wrap.appendChild(clone);

    // Pause on hover
    wrap.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
      clone.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
      clone.style.animationPlayState = 'running';
    });
  });
}
