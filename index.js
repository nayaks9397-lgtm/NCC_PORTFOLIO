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
});/* ============================================================
   NCC CADET PORTFOLIO — index.js
   ============================================================ */

/* ── 0. LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
  }, 1800);
});

/* ── 1. CUSTOM CURSOR ── */
(function() {
  const dot = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  function followRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(followRing);
  }
  followRing();
  document.querySelectorAll('a,button,.cert-card,.act-card,.perf-card,.camp-card,.ab-card,.fc-card,.medal-pip').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();

/* ── 2. CANVAS PARTICLES ── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const SYMBOLS = ['★', '✦', '⚔', '◈', '⬡', '✵', '⊕', '✪', '⊞', '⚙'];
  const COLORS = ['rgba(200,168,75,', 'rgba(255,153,51,', 'rgba(74,103,65,', 'rgba(180,200,140,'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function mkParticle() {
    return {
      x: Math.random() * W, y: Math.random() * H,
      size: 8 + Math.random() * 20,
      sym: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.03 + Math.random() * 0.08,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.4,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.006,
      life: 0, maxLife: 350 + Math.random() * 450
    };
  }
  function init() { resize(); particles = Array.from({length: 60}, mkParticle); }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot; p.life++;
      const prog = p.life / p.maxLife;
      const fade = prog < 0.15 ? prog / 0.15 : prog > 0.8 ? (1 - prog) / 0.2 : 1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * fade;
      ctx.font = p.size + 'px serif';
      ctx.fillStyle = p.color + '1)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.sym, 0, 0);
      ctx.restore();
      if (p.life >= p.maxLife || p.y < -60 || p.x < -80 || p.x > W + 80) {
        particles[i] = mkParticle();
        particles[i].y = H + 20;
      }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  init(); draw();
})();

/* ── 3. NAVBAR ── */
(function() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }, { passive: true });

  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { t.scrollIntoView({ behavior: 'smooth' }); navLinks.classList.remove('open'); ham.classList.remove('open'); }
    });
  });
  ham.addEventListener('click', () => { ham.classList.toggle('open'); navLinks.classList.toggle('open'); });
})();

/* ── 4. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const h = a.getAttribute('href');
    if (h.length > 1) {
      const t = document.querySelector(h);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    }
  });
});

/* ── 5. INTERSECTION OBSERVER (Reveal + Skill Bars) ── */
(function() {
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.reveal-up'];
  const allReveal = document.querySelectorAll(revealClasses.join(','));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--d') || '0');
        setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  allReveal.forEach(el => obs.observe(el));

  // Skill bars
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sb-fill').forEach((bar, i) => {
          const w = bar.dataset.w;
          setTimeout(() => { bar.style.width = w + '%'; }, i * 100);
        });
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-bars').forEach(el => barObs.observe(el));
})();

/* ── 6. HERO NAME LETTER ANIMATION ── */
(function() {
  const nameEl = document.querySelector('.h1-name');
  if (!nameEl) return;
  const text = nameEl.textContent;
  nameEl.innerHTML = '';
  nameEl.setAttribute('aria-label', text);
  text.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.cssText = `display:inline-block;opacity:0;transform:translateY(40px) rotate(-8deg);
      transition:opacity .5s ${0.4 + i * 0.055}s ease,transform .5s ${0.4 + i * 0.055}s ease;`;
    nameEl.appendChild(span);
  });
  setTimeout(() => {
    nameEl.querySelectorAll('span').forEach(s => { s.style.opacity = '1'; s.style.transform = 'translateY(0) rotate(0deg)'; });
  }, 200);
})();

/* ── 7. COUNTER ANIMATION ── */
(function() {
  const counters = document.querySelectorAll('[data-target]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const dur = 1800;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ── 8. CARD GLOW ON MOUSE MOVE ── */
document.querySelectorAll('.act-card, .ab-card, .perf-card, .fc-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

/* ── 9. CERTIFICATE MODAL ── */
const certData = [
  { title: 'C Certificate — Grade A (Highest)', year: '2024', desc: 'The highest NCC certificate, achieved with Grade A across written, practical and drill examinations. Holders receive special weightage in Armed Forces SSB and Civil Services recruitment. This is the pinnacle of NCC academic achievement.', icon: '🏆' },
  { title: 'A Certificate — Grade A', year: '2022', desc: 'Passed the NCC A Certificate examination with Grade A. The A Certificate is awarded to Junior Division/Wing cadets who successfully clear the annual examination. Cleared all three components: written, practical and drill.', icon: '🏅' },
  { title: 'B Certificate — Grade A', year: '2023', desc: 'Cleared the NCC B Certificate with Grade A from Senior Division/Wing. Upon clearing this examination, was promoted to the rank of Cadet Under Officer within the unit. Demonstrated exemplary performance across all parameters.', icon: '🎖️' },
  { title: 'Marksman Certificate', year: '2023', desc: 'Awarded the Marksman classification after achieving 48/50 in the .22 Bore Rifle firing exercise at 25m range. Demonstrated exceptional accuracy, consistency and safe weapon handling. Subsequently represented the unit in the District Shooting Competition.', icon: '🎯' },
  { title: 'Republic Day Camp — RDC 2024', year: '2024', desc: 'Certificate of participation in the prestigious Republic Day Camp held in New Delhi. Selected from the state to march at Kartavya Path and attend the Prime Minister\'s Rally. The RDC is considered the most prestigious NCC camp and the highest honour for a cadet.', icon: '🇮🇳' },
  { title: 'Best Cadet Award — District Level', year: '2023', desc: 'Awarded the Best Cadet title at the District-level Annual Training Camp, selected from 250+ cadets based on overall performance in drill, written tests, physical fitness, firing, field craft and personal conduct. Received the Commander\'s Trophy and a commendation letter.', icon: '🌟' }
];

function openCertModal(idx) {
  const d = certData[idx];
  document.getElementById('cmodal-body').innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="font-size:3rem;margin-bottom:.5rem">${d.icon}</div>
      <h3 style="font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:.1rem;color:var(--gold)">${d.title}</h3>
      <span style="font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--muted)">Year: ${d.year}</span>
    </div>
    <p style="line-height:1.8">${d.desc}</p>
    <p style="margin-top:1.5rem;font-family:'Share Tech Mono',monospace;font-size:.7rem;color:var(--muted);border-top:1px solid rgba(200,168,75,.15);padding-top:1rem">
      💡 To display the actual certificate image, add &lt;img&gt; inside the .cert-doc element.
    </p>
  `;
  document.getElementById('certModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCertModal() {
  document.getElementById('certModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

/* ── 10. CONTACT FORM ── */
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.f-submit');
  const ok = document.getElementById('fOk');
  let valid = true;
  form.querySelectorAll('[required]').forEach(inp => {
    if (!inp.value.trim()) {
      inp.style.borderColor = '#b03a2e';
      valid = false;
      inp.addEventListener('input', () => inp.style.borderColor = '', { once: true });
    }
  });
  if (!valid) return;
  btn.textContent = 'SENDING...';
  btn.disabled = true;
  setTimeout(() => {
    ok.style.display = 'block';
    form.reset();
    btn.innerHTML = 'SEND MESSAGE &nbsp;&#8594;';
    btn.disabled = false;
    setTimeout(() => ok.style.display = 'none', 6000);
  }, 1500);
}

/* ── 11. CAMP CARD TILT ── */
document.querySelectorAll('.camp-big-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* ── 12. PARALLAX HERO ── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const logo = hero.querySelector('.ncc-big-logo');
  if (logo) logo.style.transform = `translateY(${window.scrollY * 0.15}px)`;
}, { passive: true });