/* ============================================================
   BEACON WEB — Form Handling
   GHL webhook submission + client-side validation
   ============================================================ */

'use strict';

const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/PLACEHOLDER_WEBHOOK_ID/webhook-trigger/PLACEHOLDER';

document.addEventListener('DOMContentLoaded', () => {
  initForms();
  initContactTabs();
  initFaqAccordion();
});

/* ── Generic form submission ──────────────────────────────── */
function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const btn      = form.querySelector('[type="submit"]');
      const success  = form.querySelector('.form-success');
      const formType = form.dataset.form;

      if (!validateForm(form)) return;

      const originalText = btn.textContent;
      btn.textContent    = 'Sending…';
      btn.disabled       = true;

      const data = Object.fromEntries(new FormData(form).entries());
      data._form_type = formType;
      data._page      = window.location.pathname;
      data._timestamp = new Date().toISOString();

      try {
        await fetch(GHL_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        form.reset();
        if (success) {
          success.style.display = 'flex';
          success.classList.add('visible');
          form.querySelectorAll('.form-group').forEach(g => (g.style.display = 'none'));
          btn.style.display = 'none';
        }
      } catch {
        btn.textContent = originalText;
        btn.disabled    = false;
        showFormError(form, 'Something went wrong. Please call us at (541) 291-7030.');
      }
    });
  });
}

/* ── Simple validation ────────────────────────────────────── */
function validateForm(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      field.style.borderColor = '#ff4444';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  const emailField = form.querySelector('[type="email"]');
  if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.style.borderColor = '#ff4444';
    valid = false;
  }

  return valid;
}

function showFormError(form, msg) {
  let err = form.querySelector('.form-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error';
    err.style.cssText = 'color:#ff4444;font-size:.85rem;margin-top:.75rem;';
    form.appendChild(err);
  }
  err.textContent = msg;
}

/* ── Contact page tabs ────────────────────────────────────── */
function initContactTabs() {
  const tabs   = document.querySelectorAll('.contact-tab');
  const panels = document.querySelectorAll('.contact-form-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.querySelector(`.contact-form-panel[data-panel="${target}"]`)?.classList.add('active');
    });
  });
}

/* ── FAQ accordion ────────────────────────────────────────── */
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}
