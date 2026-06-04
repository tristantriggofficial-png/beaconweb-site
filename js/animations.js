/* ============================================================
   BEACON WEB — GSAP ScrollTrigger Animations
   Requires: gsap.min.js + ScrollTrigger.min.js
   ============================================================ */

'use strict';

window.addEventListener('load', initAnimations);

function initAnimations() {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  initHeroHeadline();
  initLogoLetters();
  initServiceCards();
  initStatCounters();
  initProcessSteps();
  initSectionHeadings();
  initPackageCards();
  initScrollFades();
}

/* ── Hero headline — word by word ─────────────────────────── */
function initHeroHeadline() {
  const headline = document.querySelector('.hero-headline');
  if (!headline) return;

  const text  = headline.innerHTML.trim();
  const words = text.split(/\s+/);

  headline.innerHTML = words
    .map(w => `<span class="word"><span class="word-inner">${w}</span></span>`)
    .join(' ');

  gsap.to('.hero-headline .word-inner', {
    translateY: '0%',
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 0.3,
    onComplete() {
      gsap.to(['.hero-sub', '.hero-cta', '.hero-badge', '.hero-industries'], {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1
      });
    }
  });
}

/* ── Logo letters ─────────────────────────────────────────── */
function initLogoLetters() {
  const logo = document.querySelector('.nav-logo-main');
  if (!logo) return;

  const text = logo.textContent.trim();
  logo.innerHTML = text.split('').map(c =>
    `<span class="logo-letter" style="opacity:0;transform:translateY(20px);display:inline-block">${c}</span>`
  ).join('');

  gsap.to('.logo-letter', {
    opacity: 1,
    y: 0,
    duration: 0.45,
    ease: 'power2.out',
    stagger: 0.04,
    delay: 0.1
  });
}

/* ── Service cards stagger ────────────────────────────────── */
function initServiceCards() {
  const cards = gsap.utils.toArray('.service-card');
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 60 });
  gsap.to(cards, {
    scrollTrigger: {
      trigger: cards[0].parentElement,
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1
  });
}

/* ── Stats counter ────────────────────────────────────────── */
function initStatCounters() {
  const counters = gsap.utils.toArray('[data-count]');
  if (!counters.length) return;

  counters.forEach(el => {
    const end    = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec    = el.dataset.dec ? parseInt(el.dataset.dec) : 0;

    gsap.fromTo(el,
      { textContent: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        textContent: end,
        opacity: 1,
        duration: 1.8,
        ease: 'power2.out',
        snap: { textContent: dec > 0 ? Math.pow(10, -dec) : 1 },
        onUpdate() {
          const v = parseFloat(this.targets()[0].textContent);
          el.textContent = v.toFixed(dec) + suffix;
        }
      }
    );
  });
}

/* ── Process steps alternating left/right ─────────────────── */
function initProcessSteps() {
  const steps = gsap.utils.toArray('.process-step');
  if (!steps.length) return;

  steps.forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
      {
        scrollTrigger: {
          trigger: step,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: 'power3.out'
      }
    );
  });
}

/* ── Section headings clip reveal ─────────────────────────── */
function initSectionHeadings() {
  document.querySelectorAll('h2:not(.no-animate), h3:not(.no-animate)').forEach(h => {
    if (h.closest('.hero-headline') || h.closest('.nav')) return;

    gsap.fromTo(h,
      { clipPath: 'inset(0 0 100% 0)', opacity: 0.4 },
      {
        scrollTrigger: {
          trigger: h,
          start: 'top 87%',
          toggleActions: 'play none none none'
        },
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
        duration: 0.85,
        ease: 'power4.out'
      }
    );
  });
}

/* ── Package cards ────────────────────────────────────────── */
function initPackageCards() {
  const cards = gsap.utils.toArray('.package-card');
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 50, scale: 0.97 });
  gsap.to(cards, {
    scrollTrigger: {
      trigger: cards[0].parentElement,
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.75,
    ease: 'power3.out',
    stagger: 0.12
  });
}

/* ── Generic scroll fades ─────────────────────────────────── */
function initScrollFades() {
  gsap.utils.toArray('.scroll-fade').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 87%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out'
      }
    );
  });
}
