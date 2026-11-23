// Editorial (campaign) photography used by the homepage and brand pages.
// Paths are logical: the image loader serves the right width of each file
// built by scripts/images/build.ts (keys in scripts/images/manifest.json).
export const EDITORIAL = {
  hero: { src: '/images/editorial/hero.webp', alt: 'Даашинз, ноосон пальтотой хоёр эмэгтэй ногоон талбайгаар гар хөтлөлцөн алхаж буй нь' },
  evening: { src: '/images/editorial/evening.webp', alt: 'Хар даашинз, цөцгий пальтотой хоёр эмэгтэй үдэшлэг дээр ярилцаж буй нь' },
  story: { src: '/images/editorial/story.webp', alt: 'Хувцасны дэлгүүрт өлгүүрээс цамц сонгож буй эмэгтэй' },
  about: { src: '/images/editorial/about.webp', alt: 'Цагаан цамц, жинстэй эмэгтэй хотын гудамжаар алхаж буй нь' },
} as const
