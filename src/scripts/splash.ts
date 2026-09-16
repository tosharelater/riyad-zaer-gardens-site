export function initSplash(): Promise<void> {
  const el = document.querySelector<HTMLElement>('[data-splash]');
  if (!el) return Promise.resolve();

  if (!shouldPlayIntro()) {
    dismiss(el);
    return Promise.resolve();
  }

  document.documentElement.classList.add('is-splashing');
  document.documentElement.classList.remove('splash-done');
  requestAnimationFrame(() => el.classList.add('is-ready'));

  return new Promise((resolve) => {
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      el.classList.add('is-leaving');
      window.setTimeout(() => {
        dismiss(el);
        resolve();
      }, 860);
    };

    window.setTimeout(close, 2550);
    el.addEventListener('click', close, { once: true });
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') close();
      },
      { once: true },
    );
  });
}

export function shouldPlayIntro(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (sessionStorage.getItem('rzg-wipe') === '1') return false;
  return isHomePath();
}

function isHomePath(): boolean {
  const path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') || '/';
  const stripped = path.replace(/\/index\.html$/, '') || '/';
  return stripped === base;
}

function dismiss(el: HTMLElement): void {
  el.remove();
  document.documentElement.classList.remove('is-splashing');
  document.documentElement.classList.add('splash-done');
}
