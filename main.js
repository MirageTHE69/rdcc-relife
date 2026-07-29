/* ==========================================================================
   RDCC ReLife — Premium Interactive Scripts v3.0
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. SCROLL-BASED ANIMATIONS (Reveal on scroll)
  ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────
     2. STICKY NAV — add 'scrolled' class on scroll
  ────────────────────────────────────────── */
  const nav = document.getElementById('siteNav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });


  /* ──────────────────────────────────────────
     3. MOBILE BURGER MENU
  ────────────────────────────────────────── */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      // Toggle icon
      const icon = burgerBtn.querySelector('[data-lucide]');
      if (icon) {
        const isOpen = mobileNav.classList.contains('open');
        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        lucide.createIcons({ nodes: [icon] });
      }
    });

    // Close mobile menu on link click
    mobileNav.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const icon = burgerBtn.querySelector('[data-lucide]');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons({ nodes: [icon] });
        }
      });
    });
  }


  /* ──────────────────────────────────────────
     4. ACTIVE NAV LINK on scroll
  ────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id="locations"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeLinkObserver.observe(s));


  /* ──────────────────────────────────────────
     5. CONSULTATION MODAL
  ────────────────────────────────────────── */
  const consultationModal = document.getElementById('consultationModal');
  const openModalBtns = document.querySelectorAll('.js-open-consultation');
  const closeModalBtns = document.querySelectorAll('.js-close-modal');

  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (consultationModal) openModal(consultationModal);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Click backdrop to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });


  /* ──────────────────────────────────────────
     6. VIDEO MODAL
  ────────────────────────────────────────── */
  const videoModal = document.getElementById('videoModal');
  const playVideoBtn = document.getElementById('playVideoBtn');

  if (playVideoBtn && videoModal) {
    playVideoBtn.addEventListener('click', () => {
      openModal(videoModal);
    });
  }

  // Pause video on close
  videoModal && videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal || e.target.closest('.js-close-modal')) {
      const iframe = videoModal.querySelector('iframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = '';
        iframe.src = src;
      }
    }
  });


  /* ──────────────────────────────────────────
     7. COUNTER ANIMATION (stats strip)
  ────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const formatCount = (num) => {
    if (num >= 10000) return num.toLocaleString('en-IN') + '+';
    if (num >= 100) return num + '+';
    return num + '+';
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const duration = 1800;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = formatCount(current);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  /* ──────────────────────────────────────────
     8. LOCATION CARDS INTERACTIVE
  ────────────────────────────────────────── */
  const locCards = document.querySelectorAll('.loc-card');
  const locationVisualName = document.querySelector('.location-overlay-name');
  const locationVisualAddr = document.querySelector('.location-overlay-addr');

  const locationData = {
    alkapuri: { name: 'Riddhara — Alkapuri, Vadodara', addr: 'Alkapuri, Vadodara, Gujarat — Headquarters' },
    bhayli:   { name: 'Akshaza — Bhayli, Vadodara',   addr: 'Bhayli, Vadodara, Gujarat' },
    bharuch:  { name: 'Bharuch Center',                addr: 'Bharuch, Gujarat' },
    anand:    { name: 'Anand Center',                  addr: 'Anand, Gujarat' },
    godhra:   { name: 'Godhra Center',                 addr: 'Godhra, Gujarat' },
    jodhpur:  { name: 'Jodhpur Center',                addr: 'Jodhpur, Rajasthan' },
    pune:     { name: 'Pune Center',                   addr: 'Pune, Maharashtra' },
    gwalior:  { name: 'Gwalior Center ✨ New',         addr: 'Gwalior, Madhya Pradesh' },
  };

  locCards.forEach(card => {
    card.addEventListener('click', () => {
      locCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const loc = card.getAttribute('data-loc');
      if (loc && locationData[loc]) {
        if (locationVisualName) locationVisualName.textContent = locationData[loc].name;
        if (locationVisualAddr) locationVisualAddr.innerHTML =
          `<i data-lucide="map-pin" style="width:13px;height:13px;display:inline;"></i> ${locationData[loc].addr}`;
        lucide.createIcons();
      }
    });
  });


  /* ──────────────────────────────────────────
     9. SCROLL TO TOP BUTTON
  ────────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ──────────────────────────────────────────
     10. HERO PARTICLES (floating bubbles)
  ────────────────────────────────────────── */
  const particlesContainer = document.getElementById('heroParticles');

  if (particlesContainer) {
    const colors = ['#D35F38', '#204E79', '#329447', '#3096D1', '#EA6D29'];

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 14 + 6;
      const delay = Math.random() * 12;
      const duration = Math.random() * 14 + 10;
      const left = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: ${color};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: 0.06;
      `;

      particlesContainer.appendChild(p);
    }
  }


  /* ──────────────────────────────────────────
     11. FORM SUBMISSION
  ────────────────────────────────────────── */
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Animate button
      const submitBtn = bookingForm.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i data-lucide="loader" style="width:16px;height:16px;"></i> Sending...';
      submitBtn.disabled = true;
      lucide.createIcons();

      setTimeout(() => {
        submitBtn.innerHTML = '<i data-lucide="check-circle" style="width:16px;height:16px;"></i> Booking Confirmed!';
        submitBtn.style.background = 'linear-gradient(135deg, #329447, #27853D)';
        lucide.createIcons();

        setTimeout(() => {
          closeAllModals();
          bookingForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          lucide.createIcons();

          // Show success toast
          showToast('🎉 Consultation booked! Our team will contact you within 24 hours.');
        }, 1800);
      }, 1200);
    });
  }


  /* ──────────────────────────────────────────
     12. TOAST NOTIFICATION
  ────────────────────────────────────────── */
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #1A1F2E;
      color: #fff;
      padding: 16px 28px;
      border-radius: 40px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 20px 48px rgba(0,0,0,.25);
      z-index: 9999;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
      max-width: 90vw;
      text-align: center;
      border: 1px solid rgba(255,255,255,.1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }


  /* ──────────────────────────────────────────
     13. SMOOTH SCROLL for anchor links
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 90; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────────────────
     14. SERVICE CARDS — hover magnetic effect
  ────────────────────────────────────────── */
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-8px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
