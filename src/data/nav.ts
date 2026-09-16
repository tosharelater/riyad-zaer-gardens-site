import { withBase } from '../lib/base';

export const navLinks = [
  { id: 'projet', href: withBase('/projet/'), key: 'nav_projet', label: 'Le projet' },
  { id: 'location', href: withBase('/emplacement/'), key: 'nav_location', label: 'Emplacement' },
  { id: 'gallery', href: withBase('/galerie/'), key: 'nav_gallery', label: 'Galerie' },
  { id: 'contact', href: withBase('/contact/'), key: 'nav_contact', label: 'Contact' },
] as const;

export const extraLinks = [{ id: 'home', href: withBase('/'), key: 'nav_home', label: 'Accueil' }] as const;
