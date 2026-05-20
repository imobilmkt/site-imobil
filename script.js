/* ═══════════════════════════════════════════════════════════════════
   IMOBIL — script.js
   Handles: cursor, navbar, hero canvas, scroll reveals,
            counter animation, mobile menu
═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  // Only on pointer devices
  if (!window.matchMedia('(hover: hover)').matches) {
    cursor.style.display = 'none';
    trail.style.display  = 'none';
    return;
  }

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Trail follows with lerp
  function animateTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover state on interactive elements
  const interactives = document.querySelectorAll('a, button, .service-card, .stat-card, .diff-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
})();


/* ─────────────────────────────────────────
   2. NAVBAR — SCROLL + MOBILE MENU
───────────────────────────────────────── */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  if (!navbar) return;

  // Glassmorphism on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ─────────────────────────────────────────
   3. HERO CANVAS — ANIMATED DOT GRID
───────────────────────────────────────── */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, dots = [], raf;

  const NAVY   = [13,  27,  42];
  const PURPLE = [108, 63, 197];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const gap = 56;
    const cols = Math.ceil(W / gap) + 1;
    const rows = Math.ceil(H / gap) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x:      c * gap,
          y:      r * gap,
          base:   Math.random() * 0.12 + 0.03,
          phase:  Math.random() * Math.PI * 2,
          speed:  Math.random() * 0.004 + 0.001,
          radius: Math.random() < 0.03 ? 2.5 : 1.2,
          isPurple: Math.random() < 0.04,
        });
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    dots.forEach(d => {
      const alpha = d.base + Math.sin(d.phase + t * d.speed * 60) * 0.08;
      const color = d.isPurple ? PURPLE : NAVY.map((v,i) => v + (240 - v) * 0.3);

      if (d.isPurple) {
        ctx.fillStyle = `rgba(108,63,197,${Math.max(0, alpha * 2.5)})`;
      } else {
        ctx.fillStyle = `rgba(240,239,244,${Math.max(0, alpha)})`;
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  raf = requestAnimationFrame(draw);

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
  });
})();


/* ─────────────────────────────────────────
   4. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
(function initReveal() {
  // Immediately show elements if reduced motion preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   5. COUNTER ANIMATION
───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();
    const card     = el.closest('.stat-card');

    if (card) card.classList.add('counting');

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const current  = Math.floor(eased * target);

      el.textContent = current.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
        if (card) {
          setTimeout(() => card.classList.remove('counting'), 600);
        }
      }
    }
    requestAnimationFrame(step);
  }

  // Trigger when in viewport
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   6. SMOOTH SCROLL — internal anchors
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   7. HERO MARK PARALLAX (subtle)
───────────────────────────────────────── */
(function initParallax() {
  const mark = document.querySelector('.hero-mark');
  if (!mark || !window.matchMedia('(hover: hover)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    mark.style.transform = `translateY(calc(-50% + ${y * 0.18}px))`;
  }, { passive: true });
})();


/* ─────────────────────────────────────────
   8. ACTIVE NAV LINK on scroll
───────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            const href = link.getAttribute('href');
            link.style.color = href === '#' + id
              ? 'var(--white)'
              : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();
