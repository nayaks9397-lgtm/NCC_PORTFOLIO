/* ============================================================
   NCC CADET PORTFOLIO — index.js
   Custom cursor · Canvas particles · Navbar · Scroll reveal · Form
   ============================================================ */

/* ══════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring follow
  function followRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .act-card, .nc-card, .tl-card, .val-box, .hs-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();


/* ══════════════════════════════════════
   2. FLOATING CANVAS BACKGROUND PARTICLES
      Floating NCC symbols: ★, ✦, ⊕, shield shapes
══════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  const SYMBOLS = ['★', '✦', '⊕', '◈', '⬡', '✵', '⚔', '⊞'];
  const COLORS  = [
    'rgba(212,160,23,',
    'rgba(255,153,51,',
    'rgba(74,103,65,',
    'rgba(255,255,255,'
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:    Math.random() * W,
      y:    Math.random() * H,
      size: 10 + Math.random() * 22,
      sym:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: col,
      alpha: 0.04 + Math.random() * 0.1,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   -0.2 - Math.random() * 0.5,
      rot:  Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.008,
      life: 0,
      maxLife: 300 + Math.random() * 400
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 55 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vrot;
      p.life++;

      // Fade in / fade out
      const progress = p.life / p.maxLife;
      const fade = progress < 0.15
        ? progress / 0.15
        : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * fade;
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = p.color + '1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.sym, 0, 0);
      ctx.restore();

      // Reset when life ends or goes off screen
      if (p.life >= p.maxLife || p.y < -50 || p.x < -60 || p.x > W + 60) {
        particles[i] = createParticle();
        particles[i].y = H + 20; // start from bottom
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();


/* ══════════════════════════════════════
   3. NAVBAR — scroll shadow + active link
══════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links  = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightNav();
  }, { passive: true });

  // Active link on scroll
  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  // Smooth scroll on nav click
  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('navLinks').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });

  // Hamburger
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
})();


/* ══════════════════════════════════════
   4. SCROLL REVEAL
══════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after reveal for performance
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════
   5. HERO HEADING — character animation
══════════════════════════════════════ */
(function animateHeroName() {
  const nameEl = document.querySelector('.h1-name');
  if (!nameEl) return;
  const text = nameEl.textContent;
  nameEl.innerHTML = '';
  nameEl.setAttribute('aria-label', text);

  text.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.cssText = `
      display: inline-block;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.5s ${0.35 + i * 0.06}s ease,
                  transform 0.5s ${0.35 + i * 0.06}s ease;
    `;
    nameEl.appendChild(span);
  });

  // Trigger after a short delay
  setTimeout(() => {
    nameEl.querySelectorAll('span').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    });
  }, 100);
})();


/* ══════════════════════════════════════
   6. ACTIVITY CARD — stagger on reveal
══════════════════════════════════════ */
(function staggerActCards() {
  const grid = document.querySelector('.act-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.act-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(grid);
})();


/* ══════════════════════════════════════
   7. CONTACT FORM SUBMISSION
══════════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const form   = e.target;
  const btn    = form.querySelector('.f-submit');
  const okMsg  = document.getElementById('fOk');

  // Simple validation
  const inputs = form.querySelectorAll('[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#C0392B';
      valid = false;
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      }, { once: true });
    }
  });
  if (!valid) return;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate sending (replace with real API/EmailJS call)
  setTimeout(() => {
    okMsg.style.display = 'block';
    form.reset();
    btn.innerHTML = 'Send Message <span>→</span>';
    btn.disabled = false;
    setTimeout(() => { okMsg.style.display = 'none'; }, 6000);
  }, 1400);
}


/* ══════════════════════════════════════
   8. TIMELINE ITEM — animate on scroll
══════════════════════════════════════ */
(function animateTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = i % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
    item.style.transition = `opacity 0.6s ${i * 0.15}s ease, transform 0.6s ${i * 0.15}s ease`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();


/* ══════════════════════════════════════
   9. NCC CARDS — hover glow effect
══════════════════════════════════════ */
(function cardGlow() {
  document.querySelectorAll('.nc-card, .act-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    });
  });
})();


/* ══════════════════════════════════════
   10. SMOOTH SCROLL for btn-solid/btn-outline
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});