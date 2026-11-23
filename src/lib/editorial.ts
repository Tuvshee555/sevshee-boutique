// Editorial (campaign) photography used by the homepage and brand pages.
// Paths are logical: the image loader serves the right width of each file
// built by scripts/images/build.ts (keys in scripts/images/manifest.json).
export const EDITORIAL = {
  hero: { src: '/images/editorial/hero.webp', alt: 'Шар дэвсгэр дээр цагаан пүүзтэй зогсож буй хүн' },
  winter: { src: '/images/editorial/winter-wide.webp', alt: 'Эгнүүлэн тавьсан өвлийн резин гутал' },
  story: { src: '/images/editorial/story.webp', alt: 'Шинэ гутлаа өмсөж үзэж буй хүн' },
  leaves: { src: '/images/editorial/leaves.webp', alt: 'Намрын хуурай навчин дээр ботинктой зогсож буй хүн' },
  kids: { src: '/images/editorial/tile-kids.webp', alt: 'Хүүхдийн жижигхэн гутал, оймс' },
} as const
