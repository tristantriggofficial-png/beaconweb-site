/* ============================================================
   BEACON WEB — Main JS
   Nav scroll, hamburger menu, magnetic cursor, page transitions
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initCursor();
  initPageTransitions();
  initDropdown();
  document.documentElement.classList.add('js-loaded');
});

/* ── Nav scroll behavior ──────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Hamburger / mobile overlay ───────────────────────────── */
function initHamburger() {
  const toggle     = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  const body       = document.body;

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('active');
    mobileMenu.classList.toggle('open', isOpen);
    body.classList.toggle('menu-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      body.classList.remove('menu-open');
    }
  });
}

/* ── Packages dropdown ────────────────────────────────────── */
function initDropdown() {
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;

  const toggle = dropdown.querySelector('.nav-dropdown-toggle');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => dropdown.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });
}

/* ── Magnetic cursor ──────────────────────────────────────── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const loop = () => {
    dot.style.transform  = `translate(${mouseX}px, ${mouseY}px)`;
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  document.querySelectorAll('a, button, [role="button"], .btn').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

/* ── Page transitions ─────────────────────────────────────── */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  overlay.style.opacity = '1';
  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.opacity = '0';
  });

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || href.startsWith('http')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '1';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });
}
