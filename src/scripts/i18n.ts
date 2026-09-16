import { strings, type Lang } from '../i18n/strings';

const STORAGE_KEY = 'rzg-lang';

export function refreshLang(): void {
  const saved = (localStorage.getItem(STORAGE_KEY) as Lang | null) ?? 'fr';
  applyLang(saved);
}

export function initLangToggle(): void {
  refreshLang();

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang as Lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyLang(lang);
    });
  });
}

function applyLang(lang: Lang): void {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as keyof (typeof strings)['fr'];
    if (key && strings[lang][key]) el.textContent = strings[lang][key];
  });

  document.querySelectorAll<HTMLElement>('[data-bilingual-fr]').forEach((el) => {
    el.hidden = lang !== 'fr';
  });
  document.querySelectorAll<HTMLElement>('[data-bilingual-ar]').forEach((el) => {
    el.hidden = lang !== 'ar';
  });

  document.querySelectorAll<HTMLImageElement>('[data-bilingual-alt-fr]').forEach((img) => {
    const fr = img.dataset.bilingualAltFr;
    const ar = img.dataset.bilingualAltAr;
    if (fr && ar) img.alt = lang === 'ar' ? ar : fr;
  });
}
