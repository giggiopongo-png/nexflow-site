/* ─── NEXFLOW APP INTERACTIONS ───────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── LOADER ── */
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', function () {
    setTimeout(function () {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('out');
      document.body.style.overflow = '';
    }, 1700);
  });

  /* ── NAV SCROLL STATE ── */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── MARQUEE FILL ── */
  var mqItems = [
    'Bot Telegram', 'Automazioni AI', 'Pipeline intelligenti',
    'Deploy rapido', 'Costo fisso', 'H24 uptime',
    'Python · Flask · SQLite', 'LLM integrati',
    'Bitget · D3.js', 'Kling API · ComfyUI',
    'Made in Italy', 'Nexflow ✦'
  ];
  var mq = document.getElementById('mq');
  if (mq) {
    var mqHtml = [...mqItems, ...mqItems].map(function (t) {
      return '<span class="mq-i"><span class="mq-dot"></span>' + t + '</span>';
    }).join('');
    mq.innerHTML = mqHtml;
  }

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var dur    = 1900;
    var start  = performance.now();
    function step(ts) {
      var p    = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(ease * target).toLocaleString('it-IT');
      if (p < 1) requestAnimationFrame(step);
      else       el.textContent = target.toLocaleString('it-IT');
    }
    requestAnimationFrame(step);
  }

  var counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.num-val').forEach(function (el) {
    counterObs.observe(el);
  });

  /* ── FEATURES STICKY SCROLL ── */
  var featCards = document.querySelectorAll('.feat-card');
  var featFill  = document.getElementById('feat-fill');
  var featCount = document.getElementById('feat-count');

  if (featCards.length) {
    var featObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          featCards.forEach(function (c) { c.classList.remove('active'); });
          e.target.classList.add('active');
          var idx = parseInt(e.target.dataset.feat, 10);
          if (featFill)  featFill.style.width = (idx / featCards.length * 100) + '%';
          if (featCount) featCount.textContent = String(idx).padStart(2, '0') + ' / 0' + featCards.length;
        }
      });
    }, { threshold: 0.45, rootMargin: '-15% 0px -15% 0px' });

    featCards.forEach(function (c) { featObs.observe(c); });
    if (featCards[0]) featCards[0].classList.add('active');
  }

  /* ── TIMELINE DOTS ── */
  var tlItems = document.querySelectorAll('.tl-item');
  if (tlItems.length) {
    var tlObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('active', e.isIntersecting);
      });
    }, { threshold: 0.35 });
    tlItems.forEach(function (i) { tlObs.observe(i); });
  }

  /* ── REVEAL OBSERVER (.rv / .rv-l) ── */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rv, .rv-l').forEach(function (el) {
    revObs.observe(el);
  });

  /* ── CTA CANVAS PARTICLES ── */
  var ctaCanvas = document.getElementById('cta-canvas');
  if (ctaCanvas) {
    var cc = ctaCanvas.getContext('2d');
    function resizeCta() {
      ctaCanvas.width  = ctaCanvas.offsetWidth  || window.innerWidth;
      ctaCanvas.height = ctaCanvas.offsetHeight || 600;
    }
    resizeCta();
    window.addEventListener('resize', resizeCta, { passive: true });

    var pts = Array.from({ length: 65 }, function () {
      return {
        x:  Math.random() * ctaCanvas.width,
        y:  Math.random() * ctaCanvas.height,
        r:  Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        a:  Math.random() * 0.22 + 0.04,
        pulse: Math.random() * Math.PI * 2
      };
    });

    function drawCta() {
      cc.clearRect(0, 0, ctaCanvas.width, ctaCanvas.height);
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
        if (p.x < 0 || p.x > ctaCanvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > ctaCanvas.height)  p.vy *= -1;
        var alpha = p.a * (0.7 + 0.3 * Math.sin(p.pulse));
        cc.beginPath();
        cc.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cc.fillStyle = 'rgba(0,229,160,' + alpha + ')';
        cc.fill();
      });

      /* Subtle connecting lines between close particles */
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx   = pts[i].x - pts[j].x;
          var dy   = pts[i].y - pts[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            cc.beginPath();
            cc.moveTo(pts[i].x, pts[i].y);
            cc.lineTo(pts[j].x, pts[j].y);
            cc.strokeStyle = 'rgba(0,229,160,' + ((1 - dist / 80) * 0.06) + ')';
            cc.lineWidth = 0.5;
            cc.stroke();
          }
        }
      }
      requestAnimationFrame(drawCta);
    }
    drawCta();
  }

  /* ══════════════════════════════════════════════════════════════════════════
     MODAL — 3-step project brief form
  ══════════════════════════════════════════════════════════════════════════ */
  var currentStep    = 1;
  var selectedService = '';

  function openModal() {
    document.getElementById('modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    goStep(1);
    /* Reset service selection */
    document.querySelectorAll('.m-sc').forEach(function (b) { b.classList.remove('sel'); });
    selectedService = '';
  }

  function closeModal() {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  function goStep(n) {
    currentStep = n;
    var steps = ['ms1', 'ms2', 'ms3', 'msok'];
    steps.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove('act');
    });
    var pips = document.querySelectorAll('.m-pd');
    pips.forEach(function (pd, i) {
      pd.classList.remove('act', 'done');
      if (i < n - 1)      pd.classList.add('done');
      else if (i === n - 1) pd.classList.add('act');
    });
    var target = n <= 3 ? document.getElementById('ms' + n) : document.getElementById('msok');
    if (target) target.classList.add('act');
  }

  function selSrv(el, srv) {
    document.querySelectorAll('.m-sc').forEach(function (b) { b.classList.remove('sel'); });
    el.classList.add('sel');
    selectedService = srv;
    var fsrv = document.getElementById('fsrv');
    if (fsrv) fsrv.value = srv;
    buildDynFields(srv);
    setTimeout(function () { goStep(2); }, 280);
  }

  function buildDynFields(srv) {
    var dynf = document.getElementById('dynf');
    if (!dynf) return;
    var html = '';

    if (srv === 'Bot Telegram') {
      html = `
        <div class="m-field">
          <label>Cosa deve fare il bot?</label>
          <textarea placeholder="Descrivi le funzionalità principali che ti servono..."></textarea>
        </div>
        <div class="m-field">
          <label>Funzionalità richieste</label>
          <div class="pill-g">
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Database utenti</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Pagamenti Stripe</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Admin panel</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">API esterne</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Notifiche push</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Mini App</button>
          </div>
        </div>`;
    } else if (srv === 'Automazione & Pipeline') {
      html = `
        <div class="m-field">
          <label>Quale processo vuoi automatizzare?</label>
          <textarea placeholder="Es. sincronizzare dati tra due sistemi ogni ora, inviare report settimanali..."></textarea>
        </div>
        <div class="m-field">
          <label>Tool già in uso</label>
          <div class="pill-g">
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Google Sheets</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Notion</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Slack</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Email/SMTP</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">API custom</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Database</button>
          </div>
        </div>`;
    } else if (srv === 'Pipeline AI') {
      html = `
        <div class="m-field">
          <label>Tipo di task AI</label>
          <div class="pill-g">
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Generazione testo</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Classificazione dati</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Generazione immagini</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">RAG / Chatbot</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Analisi documenti</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Video / Audio AI</button>
          </div>
        </div>
        <div class="m-field">
          <label>Budget indicativo</label>
          <div class="bval" id="bv">1.000€</div>
          <input type="range" class="m-range" id="brange" min="1000" max="5000" step="250" value="1000"
            oninput="document.getElementById('bv').textContent=Number(this.value).toLocaleString('it-IT')+'€'">
          <div class="rl"><span>1.000€</span><span>5.000€+</span></div>
        </div>`;
    } else {
      html = `
        <div class="m-field">
          <label>Cosa hai già in produzione?</label>
          <textarea placeholder="Descrivi la soluzione attuale da mantenere o supportare..."></textarea>
        </div>
        <div class="m-field">
          <label>Tipo di supporto necessario</label>
          <div class="pill-g">
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Monitoring h24</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Bug fix</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Aggiornamenti</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Nuove feature</button>
            <button type="button" class="pill" onclick="this.classList.toggle('on')">Ottimizzazioni</button>
          </div>
        </div>`;
    }

    dynf.innerHTML = html;
  }

  async function handleSub(e) {
    e.preventDefault();
    var btn = document.getElementById('sbtn');
    if (btn) { btn.textContent = 'Invio in corso…'; btn.disabled = true; }

    /* Collect pills and textarea from step 2 */
    var dynPills = document.querySelectorAll('#dynf .pill.on');
    var dynText  = document.querySelector('#dynf textarea');
    var details  = (dynText ? dynText.value : '');
    if (dynPills.length) {
      details += '\nOpzioni selezionate: ' +
        Array.from(dynPills).map(function (p) { return p.textContent.trim(); }).join(', ');
    }
    /* Budget slider */
    var brange = document.getElementById('brange');
    if (brange) details += '\nBudget indicativo: ' + Number(brange.value).toLocaleString('it-IT') + '€';

    var fdet = document.getElementById('fdet');
    if (fdet) fdet.value = details;

    var fd = new FormData(e.target);
    try {
      var res = await fetch('https://formspree.io/f/mojbnoyy', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        goStep(4);
      } else {
        if (btn) { btn.textContent = 'Errore. Riprova.'; btn.disabled = false; }
      }
    } catch (_) {
      if (btn) { btn.textContent = 'Errore. Riprova.'; btn.disabled = false; }
    }
  }

  /* ── ESC close & backdrop click ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  var mbg = document.getElementById('mbg');
  if (mbg) mbg.addEventListener('click', closeModal);

  /* ── Expose globals for inline onclick ── */
  window.openModal  = openModal;
  window.closeModal = closeModal;
  window.goStep     = goStep;
  window.selSrv     = selSrv;
  window.handleSub  = handleSub;
})();
