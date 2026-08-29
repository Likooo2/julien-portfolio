// ============ MESSAGE D'ACCUEIL (visiteurs venus du QR code) ============
const qrGreeting = document.getElementById('qr-greeting');
const qrGreetingClose = document.getElementById('qr-greeting-close');

if (qrGreeting) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('via') === 'qr') {
    qrGreeting.hidden = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => qrGreeting.classList.add('is-visible'));
    });
  }
}

if (qrGreetingClose) {
  qrGreetingClose.addEventListener('click', () => {
    qrGreeting.classList.remove('is-visible');
    setTimeout(() => { qrGreeting.hidden = true; }, 400);
  });
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
