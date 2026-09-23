// ============ ÉCRAN D'INTRO ============
const introOverlay = document.getElementById('intro-overlay');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (introOverlay && !prefersReducedMotion) {
  document.body.classList.add('intro-active');

  const hideIntro = () => {
    if (introOverlay.classList.contains('is-hiding')) return;
    introOverlay.classList.add('is-hiding');
    document.body.classList.remove('intro-active');
    setTimeout(() => introOverlay.classList.add('is-done'), 700);
  };

  // Apparition de la phrase
  requestAnimationFrame(() => {
    requestAnimationFrame(() => introOverlay.classList.add('is-visible'));
  });

  // Disparition automatique après un court instant
  const autoHideTimer = setTimeout(hideIntro, 2200);

  // Possibilité de passer directement (clic, touche, scroll)
  introOverlay.addEventListener('click', () => { clearTimeout(autoHideTimer); hideIntro(); });
  window.addEventListener('keydown', () => { clearTimeout(autoHideTimer); hideIntro(); }, { once: true });
  window.addEventListener('wheel', () => { clearTimeout(autoHideTimer); hideIntro(); }, { once: true, passive: true });
  window.addEventListener('touchstart', () => { clearTimeout(autoHideTimer); hideIntro(); }, { once: true, passive: true });
} else if (introOverlay) {
  introOverlay.classList.add('is-done');
}

// ============ MENU MOBILE ============
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ APPARITION PROGRESSIVE AU SCROLL ============
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
} else {
  // Fallback: pas d'IntersectionObserver disponible
  revealEls.forEach(el => el.classList.add('is-visible'));
}
