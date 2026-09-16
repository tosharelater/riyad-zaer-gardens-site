const WIPE_KEY = 'rzg-wipe';
const DURATION = 500;

export function initPageWipe(): void {
  const layer = document.querySelector<HTMLElement>('[data-page-wipe]');
  if (!layer) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sessionStorage.removeItem(WIPE_KEY);
    document.documentElement.classList.remove('is-wiping');
    return;
  }

  if (sessionStorage.getItem(WIPE_KEY) === '1') {
    sessionStorage.removeItem(WIPE_KEY);
    finishInbound(layer);
  } else {
    document.documentElement.classList.remove('is-wiping');
  }

  document.addEventListener('click', onClick, true);
}

function onClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = (event.target as Element | null)?.closest?.('a');
  if (!link || !(link instanceof HTMLAnchorElement)) return;
  if (link.target === '_blank' || link.hasAttribute('download')) return;

  let url: URL;
  try {
    url = new URL(link.href, location.href);
  } catch {
    return;
  }

  if (url.origin !== location.origin) return;
  if (url.pathname === location.pathname && url.search === location.search) return;

  event.preventDefault();
  playOutbound(url.href);
}

function playOutbound(href: string): void {
  const layer = document.querySelector<HTMLElement>('[data-page-wipe]');
  if (!layer || document.documentElement.classList.contains('is-wiping')) {
    location.href = href;
    return;
  }

  layer.classList.remove('is-exit', 'is-cover');
  layer.style.transform = 'translate3d(-100%, 0, 0)';
  void layer.offsetWidth;

  document.documentElement.classList.add('is-wiping');
  layer.style.transform = '';
  layer.classList.add('is-cover');

  window.setTimeout(() => {
    sessionStorage.setItem(WIPE_KEY, '1');
    location.href = href;
  }, DURATION);
}

function finishInbound(layer: HTMLElement): void {
  document.documentElement.classList.add('is-wiping');
  layer.classList.remove('is-cover', 'is-exit');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      layer.classList.add('is-exit');
      window.setTimeout(() => {
        document.documentElement.classList.remove('is-wiping');
        layer.classList.remove('is-exit', 'is-cover');
      }, DURATION);
    });
  });
}
