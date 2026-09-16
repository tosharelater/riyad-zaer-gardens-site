import { site } from './site';

export const poleUrban = {
  titleFr: 'Un nouveau pôle urbain à l\'entrée de Rabat',
  titleAr: 'قطب حضري جديد عند مدخل الرباط',
  bodyFr:
    'Riyad Zaer Gardens structure un quartier complet : logements finis, commerces de proximité, espaces verts et circulation apaisée. Tranche 1 : 9 immeubles, 120 appartements et 49 fonds de commerce.',
  bodyAr:
    'رياد زاير غاردنز يؤسس حياً متكاملاً: سكن منتهٍ، محلات، مساحات خضراء وتنقل هادئ. الطابق 1: 9 عمارات، 120 شقة و 49 محلاً تجارياً.',
} as const;

export const accessPoints = [
  { fr: 'Rocade et axes structurants vers Rabat', ar: 'الطرق السريعة والمحاور نحو الرباط' },
  { fr: 'Aïn Aouda — cadre résidentiel en expansion', ar: 'عين عودة — إطار سكني في توسع' },
  { fr: 'Commerces, écoles et services à proximité', ar: 'محلات، مدارس وخدمات قريبة' },
  { fr: 'Espaces verts et aires de jeux intégrés', ar: 'مساحات خضراء ومناطق لعب' },
] as const;

export const aidSteps = [
  { fr: 'Vérification d\'éligibilité avec un conseiller', ar: 'التحقق من الأهلية مع مستشار' },
  { fr: 'Constitution du dossier Daam Sakane', ar: 'إعداد ملف دعم السكن' },
  { fr: 'Simulation du prix net avec aide', ar: 'محاكاة السعر الصافي مع الدعم' },
  { fr: 'Accompagnement jusqu\'à la réservation', ar: 'مرافقة حتى الحجز' },
] as const;

export const chantierDetail = {
  phaseFr: 'Second oeuvre en cours — gros oeuvre terminé',
  phaseAr: 'الأعمال الثانوية جارية — الهيكل منجز',
  noteFr: 'Pas d\'appartement témoin pour l\'instant : la communication sur l\'avancement du chantier rassure et montre la trajectoire jusqu\'à la livraison.',
  noteAr: 'لا يوجد شقة نموذجية حالياً: التواصل حول تقدم الورش يطمئن ويوضح المسار حتى التسليم.',
} as const;

export const developer = {
  name: 'La Manoussa',
  bodyFr:
    'Promoteur du projet, La Manoussa porte une identité propre pour Riyad Zaer Gardens — distincte des Portes de Zaer dans la communication client, avec un interlocuteur dédié et une équipe commerciale de 3 personnes.',
  bodyAr:
    'المطور La Manoussa يحمل هوية مستقلة لمشروع Riyad Zaer Gardens — منفصلة عن Portes de Zaer في التواصل، مع فريق تجاري مخصص من 3 أشخاص.',
  stats: [
    { value: '9', labelFr: 'immeubles — Tranche 1', labelAr: 'عمارات — الطابق 1' },
    { value: '3', labelFr: 'conseillers dédiés', labelAr: 'مستشارون مخصصون' },
    { value: site.delivery, labelFr: 'livraison cible', labelAr: 'التسليم المستهدف' },
  ],
} as const;

export const visitInfo = {
  hoursFr: 'Lun – Sam : 9h – 18h',
  hoursAr: 'الإثنين – السبت : 9 ص – 6 م',
  ctaFr: 'Visite sur site sur rendez-vous',
  ctaAr: 'زيارة الموقع بموعد',
} as const;

export const typologyDetails = [
  {
    specsFr: ['2 chambres + séjour', 'Cuisine ouverte', 'Finitions eco+', 'Ascenseur'],
    specsAr: ['غرفتان + صالón', 'مطبخ مفتوح', 'تشطيبات eco+', 'مصعد'],
  },
  {
    specsFr: ['3 chambres + séjour', 'Volumes familiaux', 'Jusqu\'à 86 m²', 'Ascenseur'],
    specsAr: ['3 غرف + صالón', 'مساحات عائلية', 'حتى 86 م²', 'مصعد'],
  },
  {
    specsFr: ['Rez-de-chaussée', '13 – 30 m²', 'Flux piéton du pôle', 'Investissement locatif'],
    specsAr: ['الطابق الأرضي', '13 – 30 م²', 'حركة المشاة', 'استثمار تجاري'],
  },
] as const;
