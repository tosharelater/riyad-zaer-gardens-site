export function initScrollFusion(): void {
  if (!document.querySelector('[data-fusion-page]')) return;

  initHeaderScroll();
  initScrollProgress();
  initFusionReveal();
  initCounterReveal();
  initHeroCrossfadeOnly();
  initMediaReveal();
  initRowReveal();
  initTypoTicks();
  initTypoTitleLift();
  initFilmGallery();
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

function initTypoTitleLift(): void {
  const title = document.querySelector<HTMLElement>('.typo-panel--title');
  const inner = title?.querySelector<HTMLElement>('.typo-title-inner');
  const heading = title?.querySelector<HTMLElement>('.fusion-h2');
  const next = title?.nextElementSibling as HTMLElement | null;
  if (!title || !inner || !heading || !next) return;

  let ticking = false;
  const update = () => {
    if (prefersReducedMotion()) {
      inner.style.transform = '';
      ticking = false;
      return;
    }
    const currentY = new DOMMatrix(getComputedStyle(inner).transform).m42;
    const naturalBottom = heading.getBoundingClientRect().bottom - currentY;
    const clearance = Math.max(88, Math.round(window.innerHeight * 0.14));
    const overlap = naturalBottom + clearance - next.getBoundingClientRect().top;
    inner.style.transform = overlap > 0 ? `translate3d(0, ${-overlap}px, 0)` : '';
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

function initFilmGallery(): void {
  const root = document.querySelector<HTMLElement>('[data-film-gallery]');
  if (!root) return;

  const strip = root.querySelector<HTMLElement>('.film-strip');
  const preview = root.querySelector<HTMLElement>('[data-film-preview]');
  const layerA = preview?.querySelector<HTMLImageElement>('[data-film-a]');
  const layerB = preview?.querySelector<HTMLImageElement>('[data-film-b]');
  const thumbs = [...root.querySelectorAll<HTMLImageElement>('[data-film-i]')];
  if (!strip || !preview || !layerA || !layerB || !thumbs.length) return;

  const sources = [...new Set(thumbs.map((img) => img.getAttribute('src') || ''))].filter(Boolean);
  if (!sources.length) return;

  let index = 0;
  let usingA = true;
  let cycleTimer = 0;
  let startTimer = 0;

  const markHot = (i: number) => {
    thumbs.forEach((thumb) => {
      thumb.classList.toggle('is-hot', Number(thumb.dataset.filmI) === i);
    });
  };

  const show = (i: number) => {
    index = (i + sources.length) % sources.length;
    const incoming = usingA ? layerB : layerA;
    const outgoing = usingA ? layerA : layerB;
    incoming.src = sources[index];
    incoming.classList.add('is-show');
    outgoing.classList.remove('is-show');
    usingA = !usingA;
    markHot(index);
  };

  const stopCycle = () => {
    window.clearTimeout(startTimer);
    window.clearInterval(cycleTimer);
    startTimer = 0;
    cycleTimer = 0;
  };

  const close = () => {
    stopCycle();
    preview.classList.remove('is-on');
    strip.classList.remove('is-paused');
    thumbs.forEach((thumb) => thumb.classList.remove('is-hot'));
    layerA.classList.remove('is-show');
    layerB.classList.remove('is-show');
  };

  const open = (i: number) => {
    stopCycle();
    strip.classList.add('is-paused');
    preview.classList.add('is-on');
    show(i);
    if (prefersReducedMotion()) return;
    startTimer = window.setTimeout(() => {
      cycleTimer = window.setInterval(() => show(index + 1), 2000);
    }, 2000);
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('mouseenter', () => {
      open(Number(thumb.dataset.filmI) || 0);
    });
  });

  root.addEventListener('mouseleave', close);
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
