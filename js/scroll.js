/* ─── GSAP SCROLLTRIGGER ANIMATIONS ─────────────────────────────────────── */
(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero title parallax ── */
  gsap.to('.hero-title', {
    yPercent: -22,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    }
  });

  gsap.to('.hero-eyebrow', {
    yPercent: -35,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1
    }
  });

  /* ── Marquee speed on scroll ── */
  const mqTrack = document.querySelector('.mq-t');
  if (mqTrack) {
    ScrollTrigger.create({
      trigger: '.mq',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const speed = 28 - self.getVelocity() * 0.005;
        mqTrack.style.animationDuration = Math.max(8, Math.min(50, speed)) + 's';
      }
    });
  }

  /* ── Section headings — split stagger ── */
  document.querySelectorAll('.s-h').forEach((el) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ── Service rows stagger ── */
  const rows = document.querySelectorAll('.srv-row');
  if (rows.length) {
    gsap.fromTo(rows,
      { x: -20, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.srv-rows', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Numbers strip ── */
  gsap.fromTo('.num-item',
    { y: 30, opacity: 0 },
    {
      y: 0, opacity: 1, stagger: 0.1, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: '.nums-strip', start: 'top 82%', toggleActions: 'play none none none' }
    }
  );

  /* ── Project cards stagger ── */
  const projCards = document.querySelectorAll('.proj-card');
  if (projCards.length) {
    gsap.fromTo(projCards,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.proj-grid', start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Timeline scrub — progress line ── */
  const tlp = document.getElementById('tlp');
  if (tlp) {
    gsap.to(tlp, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 72%',
        end: 'bottom 55%',
        scrub: 0.6
      }
    });
  }

  /* ── CTA heading kinetic type ── */
  gsap.fromTo('.cta-h',
    { y: 60, opacity: 0, skewY: 4 },
    {
      y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: 'power4.out',
      scrollTrigger: { trigger: '.cta-s', start: 'top 75%', toggleActions: 'play none none none' }
    }
  );

  /* ── Bento cells ── */
  const bentoCells = document.querySelectorAll('.bento-cell');
  if (bentoCells.length) {
    gsap.fromTo(bentoCells,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: { amount: 0.5, from: 'start' }, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.bento', start: 'top 82%', toggleActions: 'play none none none' }
      }
    );
  }

  /* ── Feature cards — horizontal slide-in ── */
  const featRight = document.getElementById('feat-right');
  if (featRight && window.innerWidth > 960) {
    const featCards = document.querySelectorAll('.feat-card');
    featCards.forEach((card) => {
      gsap.fromTo(card,
        { x: 40 },
        {
          x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 70%', toggleActions: 'play none none none' }
        }
      );
    });
  }

  /* ── CTA buttons ── */
  gsap.fromTo('.cta-btns',
    { y: 20, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: '.cta-btns', start: 'top 85%', toggleActions: 'play none none none' }
    }
  );

  /* ── Footer ── */
  gsap.fromTo('footer',
    { opacity: 0 },
    {
      opacity: 1, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: 'footer', start: 'top 92%', toggleActions: 'play none none none' }
    }
  );

  /* ── Refresh on load ── */
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
