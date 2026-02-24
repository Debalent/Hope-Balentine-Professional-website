/**
 * Hope Balentine — Executive Personal Brand Website
 * main.js — UI Interactions, Accessibility & Animations
 * ─────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════
     1. DOM REFERENCES
  ═══════════════════════════════════════════════════ */
  const html           = document.documentElement;
  const header         = document.getElementById('site-header');
  const themeToggle    = document.getElementById('themeToggle');
  const themeIcon      = document.getElementById('themeIcon');
  const navHamburger   = document.getElementById('navHamburger');
  const mobileMenu     = document.getElementById('mobileMenu');
  const backToTop      = document.getElementById('backToTop');
  const contactForm    = document.getElementById('contactForm');
  const submitBtn      = document.getElementById('submitBtn');
  const formSuccess    = document.getElementById('formSuccess');
  const yearEl         = document.getElementById('currentYear');
  const navLinks       = document.querySelectorAll('.nav-link');
  const mobileLinks    = document.querySelectorAll('.mobile-nav-link');
  const skillBarFills  = document.querySelectorAll('.skill-bar-fill');
  const animElements   = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

  /* ═══════════════════════════════════════════════════
     2. CURRENT YEAR
  ═══════════════════════════════════════════════════ */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ═══════════════════════════════════════════════════
     3. THEME SYSTEM (DARK / LIGHT)
  ═══════════════════════════════════════════════════ */
  const THEME_KEY = 'hb-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    const isDark = theme === 'dark';
    if (themeIcon) {
      themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initTheme() {
    // Priority: stored prefs → system prefs → default light
    const stored = localStorage.getItem(THEME_KEY);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (systemDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  initTheme();
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Listen for OS-level theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ═══════════════════════════════════════════════════
     4. NAVIGATION — SCROLL EFFECTS & ACTIVE STATES
  ═══════════════════════════════════════════════════ */
  let lastScrollY = 0;
  let scrollTicking = false;

  function updateNavOnScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class for shadow
    if (header) {
      header.classList.toggle('scrolled', scrollY > 20);
    }

    // Back to top visibility
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    lastScrollY = scrollY;
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateNavOnScroll);
      scrollTicking = true;
    }
  }, { passive: true });

  // Active nav link tracking via IntersectionObserver
  const sections = document.querySelectorAll('main [id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0,
  });

  sections.forEach((section) => navObserver.observe(section));

  /* ═══════════════════════════════════════════════════
     5. MOBILE MENU
  ═══════════════════════════════════════════════════ */
  function openMobileMenu() {
    if (!mobileMenu || !navHamburger) return;
    mobileMenu.removeAttribute('hidden');
    navHamburger.setAttribute('aria-expanded', 'true');
    navHamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    // Focus first link
    const firstLink = mobileMenu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu || !navHamburger) return;
    mobileMenu.setAttribute('hidden', '');
    navHamburger.setAttribute('aria-expanded', 'false');
    navHamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const isOpen = navHamburger && navHamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMobileMenu() : openMobileMenu();
  }

  if (navHamburger) navHamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      mobileMenu &&
      !mobileMenu.hasAttribute('hidden') &&
      !mobileMenu.contains(e.target) &&
      !navHamburger.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  /* ═══════════════════════════════════════════════════
     6. SMOOTH SCROLL FOR ANCHOR LINKS
  ═══════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navH = header ? header.offsetHeight : 0;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top: offset, behavior: 'smooth' });

      // Update URL without jump
      history.pushState(null, '', href);

      // Move focus to section (accessibility)
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ═══════════════════════════════════════════════════
     7. BACK TO TOP
  ═══════════════════════════════════════════════════ */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.getElementById('site-header')?.focus({ preventScroll: true });
    });
  }

  /* ═══════════════════════════════════════════════════
     8. INTERSECTION OBSERVER — FADE-IN ANIMATIONS
  ═══════════════════════════════════════════════════ */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Slight stagger for grouped items
          const delay = entry.target.closest('.timeline-item, .pillar-card, .testimonial-card, .about-pillars')
            ? (Array.from(entry.target.parentElement?.children || []).indexOf(entry.target)) * 80
            : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    animElements.forEach((el) => fadeObserver.observe(el));
  } else {
    // Instantly show all for reduced motion
    animElements.forEach((el) => el.classList.add('visible'));
  }

  /* ═══════════════════════════════════════════════════
     9. SKILL BAR ANIMATIONS
  ═══════════════════════════════════════════════════ */
  const skillsSection = document.getElementById('skills');

  if (skillsSection && skillBarFills.length) {
    const skillsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillBarFills.forEach((bar, i) => {
          const targetWidth = bar.getAttribute('data-width') || '0';
          setTimeout(() => {
            bar.style.width = `${targetWidth}%`;
          }, reducedMotion ? 0 : i * 80);
        });
        skillsObserver.unobserve(entries[0].target);
      }
    }, { threshold: 0.3 });

    skillsObserver.observe(skillsSection);
  }

  /* ═══════════════════════════════════════════════════
     10. CONTACT FORM — VALIDATION & SUBMISSION
  ═══════════════════════════════════════════════════ */
  if (contactForm) {
    const fields = {
      firstName:  { el: document.getElementById('firstName'),  error: document.getElementById('firstNameError'),  rules: { required: true, minLen: 2 } },
      lastName:   { el: document.getElementById('lastName'),   error: document.getElementById('lastNameError'),   rules: { required: true, minLen: 2 } },
      email:      { el: document.getElementById('email'),      error: document.getElementById('emailError'),      rules: { required: true, email: true } },
      subject:    { el: document.getElementById('subject'),    error: document.getElementById('subjectError'),    rules: { required: true } },
      message:    { el: document.getElementById('message'),    error: document.getElementById('messageError'),    rules: { required: true, minLen: 20 } },
    };

    function validateField(key) {
      const { el, error, rules } = fields[key];
      if (!el || !error) return true;

      const val = el.value.trim();
      let msg = '';

      if (rules.required && !val) {
        msg = 'This field is required.';
      } else if (rules.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = 'Please enter a valid email address.';
      } else if (rules.minLen && val.length > 0 && val.length < rules.minLen) {
        msg = `Please enter at least ${rules.minLen} characters.`;
      }

      error.textContent = msg;
      el.classList.toggle('input-error', !!msg);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }

    // Live validation on blur
    Object.keys(fields).forEach((key) => {
      const { el } = fields[key];
      if (el) {
        el.addEventListener('blur', () => validateField(key));
        el.addEventListener('input', () => {
          if (el.classList.contains('input-error')) validateField(key);
        });
      }
    });

    function setLoading(on) {
      if (!submitBtn) return;
      const btnText    = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled = on;
      submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
      if (btnText)    btnText.hidden    = on;
      if (btnLoading) btnLoading.hidden = !on;
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate all fields
      let allValid = true;
      Object.keys(fields).forEach((key) => {
        if (!validateField(key)) allValid = false;
      });

      if (!allValid) {
        // Focus first error field
        for (const key of Object.keys(fields)) {
          const { el } = fields[key];
          if (el && el.classList.contains('input-error')) {
            el.focus();
            break;
          }
        }
        return;
      }

      // Check if Formspree has been configured
      const formAction = contactForm.getAttribute('action');
      if (formAction.includes('YOUR_FORM_ID')) {
        // Demo mode — show success state without actually submitting
        setLoading(true);
        await delay(1200);
        setLoading(false);
        contactForm.reset();
        if (formSuccess) {
          formSuccess.removeAttribute('hidden');
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          formSuccess.focus();
        }
        return;
      }

      // Real Formspree submission
      setLoading(true);
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          setLoading(false);
          contactForm.reset();
          if (formSuccess) {
            formSuccess.removeAttribute('hidden');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            formSuccess.focus();
          }
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      } catch (err) {
        setLoading(false);
        console.error('Form submission error:', err);
        alert('There was an issue sending your message. Please try emailing directly at balentinehope25@gmail.com');
      }
    });
  }

  /* ═══════════════════════════════════════════════════
     11. UTILITY — DELAY HELPER
  ═══════════════════════════════════════════════════ */
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* ═══════════════════════════════════════════════════
     12. HEADSHOT FALLBACK — ALREADY HANDLED IN HTML
         via onerror attribute; extra safeguard here
  ═══════════════════════════════════════════════════ */
  const headshotImg = document.querySelector('.headshot-img');
  if (headshotImg) {
    headshotImg.addEventListener('error', () => {
      headshotImg.style.display = 'none';
      const frame = headshotImg.closest('.headshot-frame');
      if (frame) frame.classList.add('headshot-placeholder-active');
    });
  }

  /* ═══════════════════════════════════════════════════
     13. RESIZE HANDLING — Close mobile menu on desktop
  ═══════════════════════════════════════════════════ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 150);
  });

  /* ═══════════════════════════════════════════════════
     14. PILLAR CARD KEYBOARD NAVIGATION
  ═══════════════════════════════════════════════════ */
  document.querySelectorAll('.pillar-card, .testimonial-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     15. TYPED EFFECT — Subtle hero title cycling
         (lightweight, no library needed)
  ═══════════════════════════════════════════════════ */
  const heroTitle = document.querySelector('.hero-title');
  const titleVariants = [
    'Customer Experience & Operations Leader',
    'Front Office & Guest Experience Expert',
    'Corporate Operations Strategist',
    'Team Leadership & Process Optimizer',
  ];

  if (heroTitle && !reducedMotion) {
    let currentVariant = 0;

    // Only cycle after initial delay so hero loads cleanly
    setInterval(() => {
      currentVariant = (currentVariant + 1) % titleVariants.length;

      heroTitle.style.opacity = '0';
      heroTitle.style.transform = 'translateY(8px)';

      setTimeout(() => {
        heroTitle.textContent = titleVariants[currentVariant];
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        heroTitle.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }, 400);
    }, 4500);
  }

  /* ═══════════════════════════════════════════════════
     16. COMPETENCY TAGS — Hover wave effect
  ═══════════════════════════════════════════════════ */
  const compTags = document.querySelectorAll('.competency-tag');
  compTags.forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 20}ms`;
  });

  /* ═══════════════════════════════════════════════════
     17. TIMELINE ITEMS — Stagger observer
  ═══════════════════════════════════════════════════ */
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!reducedMotion) {
    const timelineObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target.querySelector('.timeline-card');
          if (card) {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }
          timelineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    timelineItems.forEach((item, idx) => {
      const card = item.querySelector('.timeline-card');
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transitionDelay = `${idx * 120}ms`;
      }
      timelineObs.observe(item);
    });
  }

  /* ═══════════════════════════════════════════════════
     18. ANNOUNCE PAGE LOADED (Screen reader)
  ═══════════════════════════════════════════════════ */
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(liveRegion);

  window.addEventListener('load', () => {
    setTimeout(() => {
      liveRegion.textContent = 'Hope Balentine — Personal Brand Website loaded successfully.';
    }, 500);
  });

  /* ═══════════════════════════════════════════════════
     19. ANIMATED STAT COUNTERS
  ═══════════════════════════════════════════════════ */
  const statCounters = document.querySelectorAll('.stat-block-number[data-count]');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = reducedMotion ? 0 : 1400;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    if (duration === 0) {
      el.textContent = target + suffix;
    } else {
      requestAnimationFrame(step);
    }
  }

  if (statCounters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statCounters.forEach((el) => counterObserver.observe(el));
  }

  /* ═══════════════════════════════════════════════════
     20. LOG INIT
  ═══════════════════════════════════════════════════ */
  console.log('%c Hope Balentine — Executive Brand Site ', 'background:#1C2A39;color:#C6A85E;font-weight:bold;font-size:13px;padding:4px 8px;border-radius:4px;');
  console.log('%c Operational Excellence. Customer-Centered Leadership. ', 'color:#6B7280;font-style:italic;');

})();
