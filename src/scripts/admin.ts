const KEY = 'rzg-admin-key';

export function initAdmin(): void {
  const root = document.querySelector<HTMLElement>('[data-admin]');
  if (!root) return;

  const api = (document.body.dataset.api || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const loginBox = root.querySelector<HTMLElement>('[data-admin-login]');
  const appBox = root.querySelector<HTMLElement>('[data-admin-app]');
  const loginForm = root.querySelector<HTMLFormElement>('[data-login-form]');
  const loginError = root.querySelector<HTMLElement>('[data-login-error]');

  const showApp = (on: boolean) => {
    loginBox?.toggleAttribute('hidden', on);
    appBox?.toggleAttribute('hidden', !on);
  };

  const headers = (): HeadersInit => ({
    'Content-Type': 'application/json',
    'X-Admin-Key': sessionStorage.getItem(KEY) ?? '',
  });

  async function req(path: string, init: RequestInit = {}) {
    const res = await fetch(`${api}${path}`, { ...init, headers: { ...headers(), ...(init.headers || {}) } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(typeof err.detail === 'string' ? err.detail : 'Erreur API');
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function boot() {
    const stored = sessionStorage.getItem(KEY);
    if (!stored) {
      showApp(false);
      return;
    }
    try {
      await req('/api/admin/login', { method: 'POST', body: JSON.stringify({ key: stored }), headers: { 'Content-Type': 'application/json' } });
      showApp(true);
      await loadAll();
    } catch {
      sessionStorage.removeItem(KEY);
      showApp(false);
    }
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError?.toggleAttribute('hidden', true);
    const key = String(new FormData(loginForm).get('key') || '');
    try {
      const res = await fetch(`${api}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) throw new Error('Clé invalide — lancez l’API (`uvicorn`) si vous êtes en local.');
      sessionStorage.setItem(KEY, key);
      showApp(true);
      await loadAll();
    } catch (err) {
      if (loginError) {
        loginError.hidden = false;
        loginError.textContent = err instanceof Error ? err.message : 'Connexion impossible';
      }
    }
  });

  root.querySelector('[data-logout]')?.addEventListener('click', () => {
    sessionStorage.removeItem(KEY);
    showApp(false);
  });

  root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('is-on', b === btn));
      root.querySelectorAll('[data-panel]').forEach((p) => {
        p.classList.toggle('is-on', (p as HTMLElement).dataset.panel === btn.dataset.tab);
      });
    });
  });

  async function loadAll() {
    const [stats, leads, typologies, timeline, gallery, faq, site] = await Promise.all([
      req('/api/admin/stats'),
      req('/api/admin/leads'),
      req('/api/content/typologies'),
      req('/api/content/timeline'),
      req('/api/content/gallery'),
      req('/api/content/faq'),
      req('/api/content/site'),
    ]);
    const statsEl = root.querySelector('[data-stats]');
    if (statsEl) statsEl.textContent = `${stats.leads} leads · ${stats.gallery} visuels`;
    renderLeads(leads);
    renderStock(typologies);
    renderChantier(timeline, site);
    renderGallery(gallery);
    renderFaq(faq);
    renderSite(site);
  }

  function renderLeads(rows: Array<Record<string, string>>) {
    const el = root.querySelector('[data-leads]');
    if (!el) return;
    if (!rows.length) {
      el.innerHTML = '<p>Aucun lead pour le moment.</p>';
      return;
    }
    el.innerHTML = `<table><thead><tr><th>Date</th><th>Nom</th><th>Téléphone</th><th>Intérêt</th><th>Message</th><th></th></tr></thead><tbody>${rows
      .map(
        (r) => `<tr>
          <td>${new Date(r.created_at).toLocaleString('fr-FR')}</td>
          <td>${escapeHtml(r.name)}<br><small>${escapeHtml(r.email || '')}</small></td>
          <td><a href="tel:${escapeHtml(r.phone)}">${escapeHtml(r.phone)}</a></td>
          <td>${escapeHtml(r.interest || '—')}<br><small>${escapeHtml(r.preferred_slot || '')}</small></td>
          <td>${escapeHtml(r.message)}</td>
          <td><button class="admin-danger" data-del-lead="${r.id}">Supprimer</button></td>
        </tr>`,
      )
      .join('')}</tbody></table>`;
    el.querySelectorAll<HTMLButtonElement>('[data-del-lead]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await req(`/api/admin/leads/${btn.dataset.delLead}`, { method: 'DELETE' });
        await loadAll();
      });
    });
  }

  function renderStock(rows: Array<Record<string, string | number>>) {
    const el = root.querySelector('[data-stock]');
    if (!el) return;
    el.innerHTML = `<div class="admin-grid">${rows
      .map(
        (r) => `<form class="admin-card" data-typo-form data-id="${r.id}">
          <strong>${escapeHtml(String(r.title_fr))}</strong>
          <label>Prix FR<input name="price_fr" value="${escapeAttr(String(r.price_fr))}" /></label>
          <label>Prix AR<input name="price_ar" value="${escapeAttr(String(r.price_ar))}" /></label>
          <label>Surface<input name="surface" value="${escapeAttr(String(r.surface))}" /></label>
          <label>Restant<input name="remaining" type="number" value="${escapeAttr(String(r.remaining ?? 0))}" /></label>
          <label>Lien plan<input name="plan_url" value="${escapeAttr(String(r.plan_url || ''))}" /></label>
          <input type="hidden" name="slug" value="${escapeAttr(String(r.slug))}" />
          <input type="hidden" name="title_fr" value="${escapeAttr(String(r.title_fr))}" />
          <input type="hidden" name="title_ar" value="${escapeAttr(String(r.title_ar))}" />
          <label>Texte FR<textarea name="body_fr">${escapeHtml(String(r.body_fr))}</textarea></label>
          <label>Texte AR<textarea name="body_ar">${escapeHtml(String(r.body_ar))}</textarea></label>
          <button type="submit">Enregistrer</button>
        </form>`,
      )
      .join('')}</div>`;
    el.querySelectorAll<HTMLFormElement>('[data-typo-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
        await req(`/api/admin/typologies/${form.dataset.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...data, remaining: Number(data.remaining || 0) }),
        });
        await loadAll();
      });
    });
  }

  function renderChantier(steps: Array<Record<string, string | number>>, site: Array<{ key: string; value_fr: string; value_ar: string }>) {
    const el = root.querySelector('[data-chantier]');
    if (!el) return;
    const progress = site.find((s) => s.key === 'progress_pct')?.value_fr ?? '55';
    const phase = site.find((s) => s.key === 'chantier_phase');
    el.innerHTML = `
      <form class="admin-card" data-progress-form>
        <label>Avancement %<input name="progress" type="number" min="0" max="100" value="${escapeAttr(progress)}" /></label>
        <label>Phase FR<input name="phase_fr" value="${escapeAttr(phase?.value_fr || '')}" /></label>
        <label>Phase AR<input name="phase_ar" value="${escapeAttr(phase?.value_ar || '')}" /></label>
        <button type="submit">Mettre à jour</button>
      </form>
      <div class="admin-grid" style="margin-top:1rem">${steps
        .map(
          (s) => `<form class="admin-card" data-step-form data-id="${s.id}">
            <input type="hidden" name="sort_order" value="${s.sort_order}" />
            <label>Statut FR<input name="status_fr" value="${escapeAttr(String(s.status_fr))}" /></label>
            <label>Statut AR<input name="status_ar" value="${escapeAttr(String(s.status_ar))}" /></label>
            <label>Titre FR<input name="title_fr" value="${escapeAttr(String(s.title_fr))}" /></label>
            <label>Titre AR<input name="title_ar" value="${escapeAttr(String(s.title_ar))}" /></label>
            <button type="submit">Enregistrer</button>
          </form>`,
        )
        .join('')}</div>`;
    el.querySelector<HTMLFormElement>('[data-progress-form]')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
      await req('/api/admin/site/progress_pct', { method: 'PUT', body: JSON.stringify({ value_fr: data.progress, value_ar: data.progress }) });
      await req('/api/admin/site/chantier_phase', { method: 'PUT', body: JSON.stringify({ value_fr: data.phase_fr, value_ar: data.phase_ar }) });
      await loadAll();
    });
    el.querySelectorAll<HTMLFormElement>('[data-step-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        await req(`/api/admin/timeline/${form.dataset.id}`, { method: 'PUT', body: JSON.stringify({ ...data, sort_order: Number(data.sort_order) }) });
        await loadAll();
      });
    });
  }

  function renderGallery(rows: Array<Record<string, string | number>>) {
    const el = root.querySelector('[data-gallery]');
    if (!el) return;
    el.innerHTML = `<div class="admin-grid">${rows
      .map(
        (r) => `<form class="admin-card" data-gal-form data-id="${r.id}">
          <label>URL<input name="url" value="${escapeAttr(String(r.url))}" /></label>
          <label>Alt FR<input name="alt_fr" value="${escapeAttr(String(r.alt_fr))}" /></label>
          <label>Alt AR<input name="alt_ar" value="${escapeAttr(String(r.alt_ar))}" /></label>
          <input type="hidden" name="sort_order" value="${r.sort_order}" />
          <button type="submit">Enregistrer</button>
        </form>`,
      )
      .join('')}</div>`;
    el.querySelectorAll<HTMLFormElement>('[data-gal-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        await req(`/api/admin/gallery/${form.dataset.id}`, { method: 'PUT', body: JSON.stringify({ ...data, sort_order: Number(data.sort_order) }) });
        await loadAll();
      });
    });
  }

  function renderFaq(rows: Array<Record<string, string | number>>) {
    const el = root.querySelector('[data-faq]');
    if (!el) return;
    el.innerHTML = `${rows
      .map(
        (r) => `<form class="admin-card" data-faq-form data-id="${r.id}" style="margin-bottom:1rem">
          <input type="hidden" name="sort_order" value="${r.sort_order}" />
          <label>Question FR<input name="question_fr" value="${escapeAttr(String(r.question_fr))}" /></label>
          <label>Question AR<input name="question_ar" value="${escapeAttr(String(r.question_ar))}" /></label>
          <label>Réponse FR<textarea name="answer_fr">${escapeHtml(String(r.answer_fr))}</textarea></label>
          <label>Réponse AR<textarea name="answer_ar">${escapeHtml(String(r.answer_ar))}</textarea></label>
          <button type="submit">Enregistrer</button>
        </form>`,
      )
      .join('')}`;
    el.querySelectorAll<HTMLFormElement>('[data-faq-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        await req(`/api/admin/faq/${form.dataset.id}`, { method: 'PUT', body: JSON.stringify({ ...data, sort_order: Number(data.sort_order) }) });
        await loadAll();
      });
    });
  }

  function renderSite(rows: Array<{ key: string; value_fr: string; value_ar: string }>) {
    const el = root.querySelector('[data-site]');
    if (!el) return;
    el.innerHTML = `<div class="admin-grid">${rows
      .map(
        (r) => `<form class="admin-card" data-site-form data-key="${escapeAttr(r.key)}">
          <strong>${escapeHtml(r.key)}</strong>
          <label>FR<input name="value_fr" value="${escapeAttr(r.value_fr)}" /></label>
          <label>AR<input name="value_ar" value="${escapeAttr(r.value_ar)}" /></label>
          <button type="submit">Enregistrer</button>
        </form>`,
      )
      .join('')}</div>`;
    el.querySelectorAll<HTMLFormElement>('[data-site-form]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        await req(`/api/admin/site/${form.dataset.key}`, { method: 'PUT', body: JSON.stringify(data) });
        await loadAll();
      });
    });
  }

  boot();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch] ?? ch);
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
