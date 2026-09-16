export function initLightbox(): void {
  const root = document.querySelector<HTMLElement>('[data-lightbox]');
  if (!root) return;

  const items = [...root.querySelectorAll<HTMLButtonElement>('[data-lightbox-item]')];
  if (!items.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = `
    <button type="button" class="lightbox__close" data-lb-close aria-label="Fermer">×</button>
    <button type="button" class="lightbox__nav lightbox__prev" data-lb-prev aria-label="Précédent">‹</button>
    <img alt="" />
    <button type="button" class="lightbox__nav lightbox__next" data-lb-next aria-label="Suivant">›</button>
  `;
  document.body.append(dialog);
  const img = dialog.querySelector('img')!;
  let index = 0;

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const btn = items[index];
    img.src = btn.dataset.src || btn.querySelector('img')?.getAttribute('src') || '';
    img.alt = btn.dataset.alt || '';
  };

  items.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-lb-close]')?.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')?.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}
