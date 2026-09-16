import { refreshLang } from './i18n';

type ExtraLine = {
  group: string;
  sort_order: number;
  text_fr: string;
  text_ar: string;
};

export async function hydrateLines(): Promise<void> {
  const lists = document.querySelectorAll<HTMLElement>('[data-line-group]');
  if (!lists.length) return;

  const api = (document.body.dataset.api || 'http://127.0.0.1:8000').replace(/\/$/, '');
  try {
    const res = await fetch(`${api}/api/content/lines`);
    if (!res.ok) return;
    const rows = (await res.json()) as ExtraLine[];
    if (!Array.isArray(rows) || !rows.length) return;

    lists.forEach((list) => {
      const group = list.dataset.lineGroup;
      const items = rows.filter((r) => r.group === group);
      if (!items.length) return;
      list.innerHTML = items
        .map((item) => {
          const inner = `<span data-bilingual-fr>${escapeHtml(item.text_fr)}</span><span data-bilingual-ar hidden>${escapeHtml(item.text_ar)}</span>`;
          if (list.tagName === 'OL') {
            return `<li class="reveal-fusion is-visible"><span>${inner}</span></li>`;
          }
          return `<li class="reveal-fusion is-visible">${inner}</li>`;
        })
        .join('');
    });
    refreshLang();
  } catch {
    /* static markup stays */
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch);
}
