/* ─── MAGNETIC CURSOR WITH PHYSICS INERTIA ──────────────────────────────── */
(function () {
  'use strict';

  const dot  = document.getElementById('cd');
  const ring = document.getElementById('cr');
  if (!dot || !ring) return;

  /* ── State ── */
  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let vx = 0,  vy = 0;

  /* Spring physics constants */
  const STIFFNESS = 0.13;
  const DAMPING   = 0.72;

  /* Magnetic attraction strength */
  const MAG_STRENGTH = 0.38;
  const MAG_RADIUS   = 90;

  /* ── Mouse tracking ── */
  let activeMagnet = null;
  let magnetRect   = null;
  let magnetCx     = 0;
  let magnetCy     = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;

    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    if (activeMagnet) {
      magnetRect = activeMagnet.getBoundingClientRect();
      magnetCx = magnetRect.left + magnetRect.width  / 2;
      magnetCy = magnetRect.top  + magnetRect.height / 2;
    }
  }, { passive: true });

  /* ── Magnetic targets ── */
  const MAGNETIC_SELECTORS = [
    '.btn-a', '.btn-b', '.n-btn', '.m-btn', '.m-sc', '.proj-card'
  ];

  function bindMagnetics() {
    document.querySelectorAll(MAGNETIC_SELECTORS.join(',')).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        activeMagnet = el;
        magnetRect   = el.getBoundingClientRect();
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        activeMagnet = null;
        document.body.classList.remove('cursor-hover');
      });
    });

    /* Text cursor hint on inputs */
    document.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });

    /* Drag hint on interactive rows */
    document.querySelectorAll('.srv-row').forEach(function (el) {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* Re-bind after modal opens — delegated to a MutationObserver */
  const observer = new MutationObserver(bindMagnetics);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  bindMagnetics();

  /* ── Trail particles ── */
  const TRAIL_COUNT = 7;
  const trail = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const t = document.createElement('div');
    t.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'border-radius:50%',
      'z-index:9990',
      'transform:translate(-50%,-50%)',
      'will-change:left,top,opacity,width,height',
      'transition:none',
      'mix-blend-mode:exclusion'
    ].join(';');
    const size = 3 - i * 0.35;
    const alpha = 0.18 - i * 0.022;
    t.style.width  = size + 'px';
    t.style.height = size + 'px';
    t.style.background = `rgba(0,229,160,${alpha})`;
    document.body.appendChild(t);
    trail.push({ el: t, x: mx, y: my });
  }

  /* ── Animation loop ── */
  function animateCursor() {
    /* Target position with optional magnetic pull */
    let tx = mx;
    let ty = my;

    if (activeMagnet && magnetRect) {
      const dx = mx - magnetCx;
      const dy = my - magnetCy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAG_RADIUS) {
        const pull = 1 - dist / MAG_RADIUS;
        tx = magnetCx + dx * (1 - pull * MAG_STRENGTH);
        ty = magnetCy + dy * (1 - pull * MAG_STRENGTH);
      }
    }

    /* Spring physics for ring */
    const fx = (tx - rx) * STIFFNESS;
    const fy = (ty - ry) * STIFFNESS;
    vx = vx * DAMPING + fx;
    vy = vy * DAMPING + fy;
    rx += vx;
    ry += vy;

    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    /* Stretch ring based on velocity */
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed > 0.5) {
      const angle   = Math.atan2(vy, vx) * (180 / Math.PI);
      const stretch = Math.min(1 + speed * 0.04, 1.5);
      ring.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleX(${stretch}) scaleY(${1 / stretch})`;
    } else {
      ring.style.transform = 'translate(-50%,-50%)';
    }

    /* Trail */
    for (let i = trail.length - 1; i > 0; i--) {
      trail[i].x += (trail[i - 1].x - trail[i].x) * 0.45;
      trail[i].y += (trail[i - 1].y - trail[i].y) * 0.45;
      trail[i].el.style.left = trail[i].x + 'px';
      trail[i].el.style.top  = trail[i].y + 'px';
    }
    trail[0].x = mx;
    trail[0].y = my;
    trail[0].el.style.left = mx + 'px';
    trail[0].el.style.top  = my + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  /* ── Hide cursor on touch devices ── */
  window.addEventListener('touchstart', function () {
    dot.style.display  = 'none';
    ring.style.display = 'none';
    trail.forEach(t => { t.el.style.display = 'none'; });
  }, { once: true });
})();
