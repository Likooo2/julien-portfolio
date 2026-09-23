/* ==========================================================
   Julien Pires, portfolio : comportements de la page
   ========================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Écran d'accueil : une fois par visite, passable au clic, au défilement ou au clavier */
  const intro = document.getElementById('intro-overlay');
  if (intro) {
    if (reduceMotion || root.classList.contains('intro-seen')) {
      intro.classList.add('is-done');
    } else {
      let hidden = false;
      let timer = null;
      const hideIntro = () => {
        if (hidden) return;
        hidden = true;
        clearTimeout(timer);
        intro.classList.add('is-hiding');
        body.classList.remove('intro-active');
        try { sessionStorage.setItem('jp-intro-vue', '1'); } catch (e) { /* stockage indisponible */ }
        setTimeout(() => intro.classList.add('is-done'), 700);
      };
      body.classList.add('intro-active');
      requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-visible')));
      timer = setTimeout(hideIntro, 2200);
      intro.addEventListener('click', hideIntro);
      ['keydown', 'wheel', 'touchstart'].forEach((type) => {
        window.addEventListener(type, hideIntro, { once: true, passive: true });
      });
    }
  }

  /* En-tête : un filet apparaît dès que la page défile */
  const header = document.getElementById('header');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* Menu mobile */
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  /* Le menu indique la section en cours de lecture */
  if (nav && 'IntersectionObserver' in window) {
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const setCurrent = (id) => {
      links.forEach((a) => {
        if (a === byId.get(id)) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['accueil', ...byId.keys()].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* Apparition douce des sections */
  const reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* Copier l'adresse email */
  const copyBtn = document.getElementById('copy-email');
  const copyStatus = document.getElementById('copy-status');
  if (copyBtn && copyStatus) {
    const email = copyBtn.dataset.email;
    let resetTimer = null;
    const report = (ok) => {
      copyStatus.textContent = ok
        ? 'Adresse copiée.'
        : "La copie n'a pas fonctionné : sélectionnez l'adresse ci-dessus.";
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { copyStatus.textContent = ''; }, 3500);
    };
    const fallbackCopy = () => {
      try {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(field);
        return ok;
      } catch (e) {
        return false;
      }
    };
    copyBtn.addEventListener('click', () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => report(true), () => report(fallbackCopy()));
      } else {
        report(fallbackCopy());
      }
    });
  }
})();
