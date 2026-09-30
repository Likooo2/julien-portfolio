/* ==========================================================================
   Julien Pires · Portfolio : interactions
   1. Écran d'accueil et entrée de l'accueil
   2. En-tête : état au défilement, progression, bouton haut de page
   3. Menu mobile (Échap, focus maintenu dans le menu)
   4. Section active dans la navigation
   5. Apparitions au défilement
   6. Copie de l'adresse email
   7. Formulaire de contact (prépare l'email dans la messagerie)
   8. Année du pied de page
   ========================================================================== */
(() => {
  'use strict';
  window.jpReady = true;

  const root = document.documentElement;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EMAIL = 'jpires@etik.com';

  /* 1. Écran d'accueil ------------------------------------------------------ */
  const intro = $('#intro');
  const showHero = () => requestAnimationFrame(() => root.classList.add('hero-in'));

  if (!intro || reduceMotion || root.classList.contains('intro-seen')) {
    if (intro) intro.classList.add('is-done');
    showHero();
  } else {
    const events = ['keydown', 'wheel', 'touchstart', 'pointerdown'];
    let finished = false;
    let timer = 0;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      events.forEach((type) => window.removeEventListener(type, finish));
      intro.classList.add('is-leaving');
      root.classList.remove('intro-lock');
      try { sessionStorage.setItem('jp-intro', '1'); } catch (e) { /* navigation privée */ }
      setTimeout(showHero, 180);
      setTimeout(() => intro.classList.add('is-done'), 750);
    };
    root.classList.add('intro-lock');
    requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-visible')));
    timer = setTimeout(finish, 2300);
    events.forEach((type) => window.addEventListener(type, finish, { passive: true }));
  }

  /* 2. En-tête ---------------------------------------------------------------- */
  const header = $('#header');
  const bar = $('#progress-bar');
  const toTop = $('#to-top');
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 8);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    toTop.classList.toggle('is-visible', y > window.innerHeight * 0.9);
    ticking = false;
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    $('.brand').focus({ preventScroll: true });
  });

  /* 3. Menu mobile ------------------------------------------------------------ */
  const toggle = $('#menu-toggle');
  const menu = $('#menu');
  const menuLinks = () => $$('a', menu);
  const setMenu = (open, restoreFocus = false) => {
    menu.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (open) setTimeout(() => menuLinks()[0].focus({ preventScroll: true }), 80);
    else if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setMenu(false, true); return; }
    if (e.key !== 'Tab') return;
    const items = [toggle, ...menuLinks()];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* 4. Section active ------------------------------------------------------- */
  const navLinks = $$('[data-nav]');
  const ids = [...new Set(navLinks.map((a) => a.getAttribute('href').slice(1)))];
  const setActive = (id) => {
    navLinks.forEach((a) => {
      const on = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['accueil', ...ids].forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* 5. Apparitions au défilement --------------------------------------------- */
  const revealables = $$('[data-reveal], [data-reveal-line]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    revealables.forEach((el) => io.observe(el));
  }

  /* 6. Copie de l'adresse email ------------------------------------------------ */
  const copyStatus = $('#copy-status');
  const legacyCopy = (text) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    area.remove();
    return ok;
  };
  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* on tente la méthode de secours */ }
    return legacyCopy(text);
  };
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const ok = await copyText(btn.dataset.copy);
      btn.classList.toggle('is-copied', ok);
      btn.setAttribute('aria-label', ok ? 'Adresse copiée' : "Copier l'adresse email");
      copyStatus.textContent = ok
        ? 'Adresse email copiée.'
        : "La copie n'a pas fonctionné : sélectionnez l'adresse à la main.";
      clearTimeout(btn.resetTimer);
      btn.resetTimer = setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', "Copier l'adresse email");
        copyStatus.textContent = '';
      }, 2400);
    });
  });

  /* 7. Formulaire de contact --------------------------------------------------- */
  const form = $('#contact-form');
  if (form) {
    const status = $('#form-status');
    const fields = form.elements;
    const required = [
      { input: fields.namedItem('name'), message: 'Indiquez votre nom.' },
      { input: fields.namedItem('message'), message: 'Écrivez votre message.' },
    ];
    const setError = (input, message) => {
      const error = document.getElementById(`${input.id}-error`);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) error.textContent = message;
    };
    const setStatus = (text, type) => {
      status.textContent = text;
      status.className = `form-status${type ? ` is-${type}` : ''}`;
    };
    required.forEach(({ input }) => {
      input.addEventListener('input', () => { if (input.value.trim()) setError(input, ''); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      required.forEach(({ input, message }) => {
        const empty = !input.value.trim();
        setError(input, empty ? message : '');
        if (empty && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        setStatus('Merci de compléter les champs indiqués.', 'error');
        firstInvalid.focus();
        return;
      }
      const name = fields.namedItem('name').value.trim();
      const company = fields.namedItem('company').value.trim();
      const subject = fields.namedItem('subject').value + (company ? ` · ${company}` : '');
      const body = `Bonjour Julien,\n\n${fields.namedItem('message').value.trim()}\n\n${name}${company ? `\n${company}` : ''}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus(`Votre messagerie s'ouvre avec le message prêt à envoyer. Si rien ne s'ouvre, écrivez directement à ${EMAIL}.`, 'success');
    });
  }

  /* 8. Année du pied de page ------------------------------------------------ */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
