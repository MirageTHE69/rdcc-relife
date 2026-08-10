/* =============================================
   RDCC Healthcare — Main JS
   Handles: Scroll Reveal, Mobile Nav, FAQ Accordion, Modal
   ============================================= */

'use strict';

/* ─── Scroll Reveal ─────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el, i) => {
    // Stagger siblings within the same parent
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(el);
  });
})();

/* ─── Mobile Nav Toggle ─────────────────────── */
(function initMobileNav() {
  const burger    = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const header    = document.getElementById('siteHeader');
  if (!burger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    burger.textContent = '✕';
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('open');
    burger.textContent = '☰';
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });

  // Close on any anchor link click
  mobileNav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeNav);
  });

  // Close on any button inside nav click (book btn etc.)
  mobileNav.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', closeNav);
  });

  // Close when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !burger.contains(e.target)) {
      closeNav();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
})();

/* ─── Sticky Header Shadow ───────────────────── */
(function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(20,35,29,.08)'
      : 'none';
  }, { passive: true });
})();

/* ─── FAQ Accordion ─────────────────────────── */
(function initFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;

  list.addEventListener('click', (e) => {
    const item = e.target.closest('.faq-item');
    if (!item) return;

    const isOpen = item.classList.contains('open');

    // Close all
    list.querySelectorAll('.faq-item').forEach((i) => {
      i.classList.remove('open');
      i.querySelector('.faq-toggle').textContent = '+';
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-toggle').textContent = '−';
    }
  });
})();

/* ─── Consultation Modal ─────────────────────── */
(function initModal() {
  const overlay = document.getElementById('consultModal');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open triggers
  document.querySelectorAll('.js-open-modal').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Form submit (modal)
  overlay.querySelector('form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = overlay.querySelector('.btn-submit');
    btn.textContent = 'Thank you! We\'ll call you back today.';
    btn.style.background = '#17786E';
    btn.disabled = true;
    setTimeout(closeModal, 2500);
  });
})();

/* ─── Main Contact Form ──────────────────────── */
(function initContactForm() {
  const form = document.getElementById('mainContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Thank you! We\'ll call you back today. ✓';
    btn.style.background = '#17786E';
    btn.disabled = true;
  });
})();

/* ─── Smooth scroll for anchor links ────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
