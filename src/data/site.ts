import { withBase } from '../lib/base';

export const site = {
  name: 'Riyad Zaer Gardens',
  phone: '07 08 08 08 39',
  phoneTel: '+212708080839',
  whatsapp: 'https://wa.me/212708080839',
  email: 'contact@riyadzaergardens.com',
  domain: 'riyadzaergardens.com',
  delivery: 'Septembre 2028',
  address: 'Km 25, Avenue Mohamed VI, Rabat — Lotissement Les Portes de Zaer',
  locationReal: 'Aïn Aouda',
  priceFrom: '420 000 DHS',
  priceWithAid: '350 000 DHS',
  aidAmount: '70 000 DHS',
  apartments: 120,
  commercial: 49,
} as const;

export const typologies = [
  {
    id: 'f3',
    titleFr: 'F3',
    titleAr: 'F3',
    surface: '65 – 75 m²',
    priceFr: 'À partir de 420 000 DHS',
    priceAr: 'ابتداءً من 420,000 درهم',
    bodyFr: 'Séjour lumineux, deux chambres, cuisine ouverte — idéal pour démarrer ou se réancrer.',
    bodyAr: 'صالón مشرق، غرفتان، مطبخ مفتوح — مثالي للبداية أو للاستقرار.',
  },
  {
    id: 'f4',
    titleFr: 'F4',
    titleAr: 'F4',
    surface: 'jusqu\'à 86 m²',
    priceFr: 'À partir de 480 000 DHS',
    priceAr: 'ابتداءً من 480,000 درهم',
    bodyFr: 'Troisième chambre, plus d\'espace familial, volumes clairs.',
    bodyAr: 'غرفة ثالثة، مساحة عائلية أكبر، حجم واضح.',
  },
  {
    id: 'fonds',
    titleFr: 'Fonds de commerce',
    titleAr: 'محلات تجارية',
    surface: '13 – 30 m²',
    priceFr: 'À partir de 15 000 DHS / m²',
    priceAr: 'ابتداءً من 15,000 درهم / م²',
    bodyFr: 'Locaux en rez-de-chaussée au cœur du nouveau pôle urbain.',
    bodyAr: 'محلات في الطابق الأرضي في قلب القطب الحضري الجديد.',
  },
] as const;

export const amenities = [
  { fr: 'Ascenseur dans chaque immeuble', ar: 'مصعد في كل عمارة' },
  { fr: 'Espaces verts et aires de jeux', ar: 'مساحات خضراء ومناطق لعب' },
  { fr: 'Sécurité résidence', ar: 'أمن الإقامة' },
  { fr: 'Parking titré (en supplément)', ar: 'موقف سيارات بعقد (إضافي)' },
  { fr: 'Finitions modernes', ar: 'تشطيبات عصرية' },
] as const;

export const timeline = [
  { statusFr: 'Terminé', statusAr: 'منجز', titleFr: 'Terrassement & fondations', titleAr: 'التسوية والأساسات' },
  { statusFr: 'Terminé', statusAr: 'منجز', titleFr: 'Gros oeuvre', titleAr: 'الهيكل الإنشائي' },
  { statusFr: 'En cours', statusAr: 'جاري', titleFr: 'Second oeuvre', titleAr: 'الأعمال الثانوية' },
  { statusFr: 'À venir', statusAr: 'قادم', titleFr: 'Finitions', titleAr: 'التشطيبات' },
  { statusFr: 'À venir', statusAr: 'قادم', titleFr: 'Livraison', titleAr: 'التسليم' },
] as const;

export const faq = [
  {
    qFr: 'Le projet est-il éligible aux aides au logement ?',
    qAr: 'هل المشروع مؤهل لدعم السكن؟',
    aFr: 'Oui. Riyad Zaer Gardens est éligible aux aides au logement de l\'État — jusqu\'à 70 000 DHS selon conditions.',
    aAr: 'نعم. مشروع Riyad Zaer Gardens مؤهل لدعم السكن — حتى 70,000 درهم حسب الشروط.',
  },
  {
    qFr: 'Quelles typologies sont disponibles ?',
    qAr: 'ما الأنماط المتاحة؟',
    aFr: 'F3 et F4 (65 à 86 m²) ainsi que 49 fonds de commerce (13 à 30 m²).',
    aAr: 'F3 و F4 (65 إلى 86 م²) بالإضافة إلى 49 محلاً تجارياً (13 إلى 30 م²).',
  },
  {
    qFr: 'Quand est la livraison prévue ?',
    qAr: 'متى التسليم المتوقع؟',
    aFr: 'Livraison prévisionnelle : septembre 2028.',
    aAr: 'التسليم المتوقع: سبتمبر 2028.',
  },
] as const;

export const galleryImages = Array.from({ length: 12 }, (_, i) => ({
  src: withBase(`/gallery/render-${i + 1}.jpg`),
  altFr: `Riyad Zaer Gardens — visuel ${i + 1}`,
  altAr: `رياد زاير غاردنز — صورة ${i + 1}`,
}));
