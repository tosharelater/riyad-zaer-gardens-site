export function initUi(): void {
  initScrollReveal();
  initHeaderScroll();
  initMobileNav();
}

function initScrollReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 60, 360)}ms`;
    observer.observe(el);
  });
}

function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    header.dataset.scrolled = String(scrolled);
    header.classList.toggle('is-scrolled', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-mobile-nav]');
  if (!toggle || !nav) return;

  const iconOpen = toggle.querySelector('.nav-icon-open');
  const iconClose = toggle.querySelector('.nav-icon-close');

  const setOpen = (open: boolean) => {
    nav.classList.toggle('hidden', !open);
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    iconOpen?.classList.toggle('hidden', open);
    iconClose?.classList.toggle('hidden', !open);
  };

  toggle.addEventListener('click', () => {
    setOpen(nav.classList.contains('hidden'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}
