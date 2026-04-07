/* ============================================
   ANIMATIONS.JS — Entrance · Scroll · Parallax
   All GPU-accelerated, no layout thrashing
   ============================================ */

"use strict";

const Anim = (() => {

  /* ── 1. INTERSECTION OBSERVER — fade in on scroll ── */
  const ioCfg = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-in');
        // optional: unobserve after first reveal for perf
        if (!entry.target.dataset.repeat) io.unobserve(entry.target);
      } else if (entry.target.dataset.repeat) {
        entry.target.classList.remove('anim-in');
      }
    });
  }, ioCfg);

  function observeAll() {
    document.querySelectorAll(
      '[data-anim], .reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur'
    ).forEach(el => {
      io.observe(el);
    });
  }

  /* ── 2. STAGGER CHILDREN ── */
  function staggerChildren(parent, delay = 80) {
    const children = parent.querySelectorAll('[data-anim], .reveal, .reveal-left, .reveal-right, .reveal-scale');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}ms`;
    });
  }

  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(parent => {
      const d = parseInt(parent.dataset.stagger) || 80;
      staggerChildren(parent, d);
    });
  }

  /* ── 3. NAVBAR SCROLL BEHAVIOUR ── */
  function initNavScroll() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 4. MOBILE NAVBAR TOGGLE ── */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.querySelector('.nav-mobile');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // close on outside click
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 5. CAROUSEL ── */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(wrap => {
      const track  = wrap.querySelector('.carousel-track');
      const slides = wrap.querySelectorAll('.carousel-slide');
      const prev   = wrap.querySelector('[data-carousel-prev]');
      const next   = wrap.querySelector('[data-carousel-next]');
      const dotsEl = wrap.querySelector('.carousel-dots');
      if (!track || slides.length === 0) return;

      let current = 0;
      let startX = 0;
      let isDragging = false;

      function getVisible() {
        const w = wrap.offsetWidth;
        if (w < 600) return 1;
        if (w < 960) return 2;
        return 3;
      }

      function maxIndex() {
        return Math.max(0, slides.length - getVisible());
      }

      function buildDots() {
        if (!dotsEl) return;
        dotsEl.innerHTML = '';
        const n = maxIndex() + 1;
        for (let i = 0; i < n; i++) {
          const d = document.createElement('span');
          d.className = 'c-dot' + (i === current ? ' active' : '');
          d.addEventListener('click', () => go(i));
          dotsEl.appendChild(d);
        }
      }

      function updateDots() {
        if (!dotsEl) return;
        dotsEl.querySelectorAll('.c-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }

      function go(idx) {
        current = Math.max(0, Math.min(idx, maxIndex()));
        const slide = slides[current];
        if (!slide) return;
        const gap = 20;
        const slideW = slide.offsetWidth + gap;
        track.style.transform = `translateX(-${current * slideW}px)`;
        updateDots();
      }

      if (prev) prev.addEventListener('click', () => go(current - 1));
      if (next) next.addEventListener('click', () => go(current + 1));

      // Swipe support
      track.addEventListener('pointerdown', e => {
        startX = e.clientX;
        isDragging = true;
        track.style.transition = 'none';
      });

      window.addEventListener('pointerup', e => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = '';
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) go(current + (diff > 0 ? 1 : -1));
      });

      // Auto-play optional
      if (wrap.dataset.autoplay) {
        setInterval(() => go(current + 1 > maxIndex() ? 0 : current + 1),
          parseInt(wrap.dataset.autoplay) || 4000);
      }

      buildDots();

      // Rebuild on resize
      window.addEventListener('resize', () => { buildDots(); go(current); }, { passive: true });
    });
  }

  /* ── 6. FAQ ACCORDION ── */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // close all
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── 7. PARALLAX — very light, rAF based ── */
  function initParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (els.length === 0) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          els.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.2;
            el.style.transform = `translateY(${sy * speed}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 8. COUNTER ANIMATION ── */
  function animCounter(el) {
    const target = parseInt(el.dataset.count) || 0;
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          animCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));
  }

  /* ── 9. CURSOR TRAIL (subtle, desktop only) ── */
  function initCursorGlow() {
    if (window.matchMedia('(hover: none)').matches) return;
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;width:300px;height:300px;border-radius:50%;
      background:radial-gradient(circle,rgba(192,23,43,0.05) 0%,transparent 65%);
      pointer-events:none;z-index:9998;
      transform:translate(-50%,-50%);
      transition:transform 0.1s linear,opacity 0.3s;
      top:0;left:0;opacity:0;
    `;
    document.body.appendChild(el);

    let visible = false;
    document.addEventListener('mousemove', e => {
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
      if (!visible) { el.style.opacity = '1'; visible = true; }
    }, { passive: true });

    document.addEventListener('mouseleave', () => { el.style.opacity = '0'; visible = false; });
  }

  /* ── 10. SCROLL PROGRESS BAR ── */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:fixed;top:0;left:0;height:2px;width:0%;
      background:linear-gradient(90deg,var(--blood),var(--rose));
      z-index:9999;pointer-events:none;
      box-shadow:0 0 8px rgba(192,23,43,0.6);
      transition:width 0.1s linear;
    `;
    document.body.appendChild(bar);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── INIT ALL ── */
  function init() {
    observeAll();
    initStagger();
    initNavScroll();
    initMobileNav();
    initCarousels();
    initFAQ();
    initParallax();
    initCounters();
    initCursorGlow();
    initScrollProgress();
  }

  return { init, go: null };

})();

/* Inject animation CSS inline (keeps it in one JS file, no extra CSS request) */
(function injectAnimCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* Base hidden state */
    .reveal, [data-anim] {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s cubic-bezier(0,0,0.2,1),
                  transform 0.65s cubic-bezier(0,0,0.2,1);
    }
    .reveal-left {
      opacity: 0;
      transform: translateX(-32px);
      transition: opacity 0.65s cubic-bezier(0,0,0.2,1),
                  transform 0.65s cubic-bezier(0,0,0.2,1);
    }
    .reveal-right {
      opacity: 0;
      transform: translateX(32px);
      transition: opacity 0.65s cubic-bezier(0,0,0.2,1),
                  transform 0.65s cubic-bezier(0,0,0.2,1);
    }
    .reveal-scale {
      opacity: 0;
      transform: scale(0.93);
      transition: opacity 0.6s cubic-bezier(0,0,0.2,1),
                  transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
    }
    .reveal-blur {
      opacity: 0;
      filter: blur(8px);
      transition: opacity 0.7s cubic-bezier(0,0,0.2,1),
                  filter 0.7s cubic-bezier(0,0,0.2,1);
    }

    /* Revealed state */
    .reveal.anim-in,
    .reveal-left.anim-in,
    .reveal-right.anim-in,
    [data-anim].anim-in {
      opacity: 1;
      transform: none;
    }
    .reveal-scale.anim-in {
      opacity: 1;
      transform: scale(1);
    }
    .reveal-blur.anim-in {
      opacity: 1;
      filter: blur(0);
    }

    /* Hero entrance (CSS, not JS) */
    @keyframes heroIn {
      from { opacity:0; transform:translateY(22px); }
      to   { opacity:1; transform:none; }
    }
    .hero-pre    { animation: heroIn 0.7s 0.1s both cubic-bezier(0,0,0.2,1); }
    .hero-h1     { animation: heroIn 0.8s 0.25s both cubic-bezier(0,0,0.2,1); }
    .hero-p      { animation: heroIn 0.7s 0.45s both cubic-bezier(0,0,0.2,1); }
    .hero-cta    { animation: heroIn 0.7s 0.6s  both cubic-bezier(0,0,0.2,1); }
    .hero-scroll { animation: heroIn 0.7s 0.9s  both cubic-bezier(0,0,0.2,1); }

    /* Page transition overlay */
    @keyframes pageIn {
      from { opacity:0; }
      to   { opacity:1; }
    }
    body { animation: pageIn 0.4s ease both; }

    /* Shake for login error */
    @keyframes shake {
      0%,100% { transform: none; }
      20%,60%  { transform: translateX(-7px); }
      40%,80%  { transform: translateX(7px); }
    }
    .shake { animation: shake 0.38s ease; }

    /* Spinner */
    @keyframes spin360 {
      to { transform: rotate(360deg); }
    }
    .spin { animation: spin360 1.4s linear infinite; }
  `;
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', Anim.init);
