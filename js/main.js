/* ============================================================
   BEACONWEB — Main JS v2.0  |  2026-06-16
   Nav, GSAP animations, counters, FAQ, forms
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Nav: scroll darken --- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Nav: hamburger / mobile --- */
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMobile.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Active nav link --- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* --- GSAP: hero headline word split --- */
  const heroHeadline = document.querySelector('.hero-headline');
  if (heroHeadline && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const words = heroHeadline.querySelectorAll('.word');
    gsap.to(words, {
      opacity: 1,
      y: 0,
      stagger: 0.07,
      duration: 0.7,
      ease: 'power3.out',
      delay: 0.2
    });
  }

  /* --- GSAP: stat counters --- */
  const statNumbers = document.querySelectorAll('[data-count]');
  if (statNumbers.length && window.gsap && window.ScrollTrigger) {
    statNumbers.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            }
          });
        }
      });
    });
  }

  /* --- GSAP: automation cards stagger --- */
  const autoCards = document.querySelectorAll('.auto-card');
  if (autoCards.length && window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: '.automations-grid',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(autoCards, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  }

  /* --- GSAP: process steps slide in --- */
  const steps = document.querySelectorAll('.step');
  if (steps.length && window.gsap && window.ScrollTrigger) {
    steps.forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(step, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  /* --- GSAP: fade-in sections --- */
  document.querySelectorAll('[data-fade]').forEach(el => {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.set(el, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      }
    });
  });

  /* --- FAQ accordion --- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(open => open.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* --- Revenue Calculator --- */
  const calcSection = document.getElementById('revenueCalc');
  if (calcSection) {
    const inputLeads    = document.getElementById('calcLeads');
    const inputPct      = document.getElementById('calcPct');
    const inputValue    = document.getElementById('calcValue');
    const sliderDisplay = document.getElementById('calcPctDisplay');
    const amountEl      = document.getElementById('calcAmount');
    const annualEl      = document.getElementById('calcAnnual');
    const mathEl        = document.getElementById('calcMath');

    let animObj = { val: 0 };
    let animTween = null;

    const fmt = n => '$' + Math.round(n).toLocaleString('en-US');

    const updateCalc = () => {
      const leads   = Math.max(0, parseFloat(inputLeads.value)  || 0);
      const pct     = Math.max(0, Math.min(100, parseFloat(inputPct.value) || 0));
      const jobVal  = Math.max(0, parseFloat(inputValue.value)  || 0);

      sliderDisplay.textContent = Math.round(pct) + '%';

      const monthly = leads * 30 * (pct / 100) * jobVal * 0.20;
      const annual  = monthly * 12;

      if (mathEl) {
        mathEl.textContent =
          `${leads} leads/day × 30 days × ${Math.round(pct)}% unanswered × ${fmt(jobVal)} avg job × 20% close rate = ${fmt(monthly)}/mo`;
      }

      if (animTween) animTween.kill();
      const prev = animObj.val;
      animTween = gsap ? gsap.to(animObj, {
        val: monthly,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          amountEl.textContent = fmt(animObj.val);
          annualEl.textContent = 'That\'s ' + fmt(animObj.val * 12) + ' per year walking out the door.';
        }
      }) : null;

      if (!gsap) {
        amountEl.textContent = fmt(monthly);
        annualEl.textContent = 'That\'s ' + fmt(annual) + ' per year walking out the door.';
      }
    };

    inputLeads.addEventListener('input', updateCalc);
    inputValue.addEventListener('input', updateCalc);
    inputPct.addEventListener('input', updateCalc);
    updateCalc();

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.set(calcSection, { opacity: 0 });
      ScrollTrigger.create({
        trigger: calcSection,
        start: 'top 80%',
        once: true,
        onEnter: () => gsap.to(calcSection, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      });
    }
  }

  /* --- Contact form --- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const successEl = document.getElementById('formSuccess');
      const data = Object.fromEntries(new FormData(contactForm));

      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const webhookUrl = contactForm.dataset.webhook;
        if (webhookUrl && !webhookUrl.includes('YOUR_')) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            mode: 'no-cors'
          });
        }
        contactForm.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        alert('Something went wrong. Please try emailing us directly at tristantrigg@beaconweb.co');
      }
    });
  }

});
