export function initScrollFusion(): void {
  if (!document.querySelector('[data-fusion-page]')) return;

  initHeaderScroll();
  initHeaderHide();
  initScrollProgress();
  initFusionReveal();
  initCounterReveal();
  initHeroCrossfadeOnly();
  initMediaReveal();
  initRowReveal();
  initTypoTicks();
  initInView('[data-fill-track]', 'is-in');
  initInView('[data-phase-track]', 'is-in');
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('[data-fusion-header]');
  if (!header) return;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initHeaderHide(): void {
  if (!document.querySelector('[data-fx-lab]')) return;
  const header = document.querySelector<HTMLElement>('[data-fusion-header]');
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const open = header.querySelector('[data-nav-toggle]')?.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('is-away', !open && y > last && y > 90);
    last = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
}

function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', String(h > 0 ? window.scrollY / h : 0));
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

function initFusionReveal(): void {
  const groups = document.querySelectorAll<HTMLElement>('[data-reveal-group]');
  if (!groups.length) return;

  if (prefersReducedMotion()) {
    groups.forEach((g) => g.querySelectorAll('.reveal-fusion').forEach((el) => el.classList.add('is-visible')));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = entry.target as HTMLElement;
        group.querySelectorAll<HTMLElement>('.reveal-fusion').forEach((el, i) => {
          el.style.transitionDelay = `${i * 90}ms`;
          el.classList.add('is-visible');
        });
        observer.unobserve(group);
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  );

  groups.forEach((g) => observer.observe(g));
}

function initCounterReveal(): void {
  const nums = document.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!nums.length || prefersReducedMotion()) {
    nums.forEach((el) => {
      el.textContent = `${el.dataset.countTo ?? ''}${el.dataset.countSuffix ?? ''}`;
    });
    return;
  }

  const animate = (el: HTMLElement) => {
    const target = Number(el.dataset.countTo ?? 0);
    const suffix = el.dataset.countSuffix ?? '';
    const start = performance.now();
    const duration = 1280;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 },
  );

  nums.forEach((n) => observer.observe(n));
}

function initHeroCrossfadeOnly(): void {
  const root = document.querySelector('[data-hero-crossfade]');
  if (!root) return;
  const slides = root.querySelectorAll('img');
  if (!slides.length) return;

  root.classList.add('is-in');
  slides[0]?.classList.add('is-active');
  if (slides.length < 2 || prefersReducedMotion()) return;

  let index = 0;
  const hold = 6200;

  const cycle = () => {
    const next = (index + 1) % slides.length;
    slides[next]?.classList.add('is-active');
    slides[index]?.classList.remove('is-active');
    index = next;
  };

  window.setInterval(cycle, hold);
}

function initMediaReveal(): void {
  const nodes = document.querySelectorAll<HTMLElement>('[data-media-reveal]');
  if (!nodes.length) return;

  if (prefersReducedMotion()) {
    nodes.forEach((n) => n.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.22 },
  );

  nodes.forEach((n) => observer.observe(n));
}

function initRowReveal(): void {
  const rows = document.querySelectorAll<HTMLElement>('[data-row-reveal]');
  if (!rows.length) return;

  if (prefersReducedMotion()) {
    rows.forEach((r) => r.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.28 },
  );

  rows.forEach((r) => observer.observe(r));
}

function initTypoTicks(): void {
  const ticks = document.querySelector<HTMLElement>('[data-typo-ticks]');
  const stack = document.querySelector<HTMLElement>('.typo-stack');
  const panels = document.querySelectorAll<HTMLElement>('[data-typo-tick]');
  if (!ticks || !panels.length) return;

  const buttons = [...ticks.querySelectorAll<HTMLButtonElement>('button')];

  const panelIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = Number(entry.target.getAttribute('data-typo-tick'));
        buttons.forEach((b, j) => b.classList.toggle('is-on', j === i));
      });
    },
    { threshold: 0.5 },
  );
  panels.forEach((p) => panelIo.observe(p));

  if (stack) {
    const stackIo = new IntersectionObserver(
      (entries) => {
        ticks.classList.toggle('is-on', entries.some((e) => e.isIntersecting));
      },
      { threshold: 0.08 },
    );
    stackIo.observe(stack);
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      panels[i]?.scrollIntoView({ block: 'start' });
    });
  });
}

function initInView(selector: string, className: string): void {
  const nodes = document.querySelectorAll<HTMLElement>(selector);
  if (!nodes.length) return;

  if (prefersReducedMotion()) {
    nodes.forEach((n) => n.classList.add(className));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  nodes.forEach((n) => observer.observe(n));
}
