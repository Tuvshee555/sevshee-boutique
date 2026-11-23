// How this store talks to shoppers: the example questions on the assistant's
// buttons and placeholders, and what kind of shop it is. Every example here is
// one the catalogue engine answers from the database (tests/unit/sevshee-catalog.test.ts).
export const STORE_VOICE = {
  /** "…зохиомол <kindMn>" in the assistant's about answer. */
  kindMn: 'эмэгтэй хувцасны бутик',
  /** Used in the AI instructions ("a fictional <kindEn>"). */
  kindEn: "women's clothing boutique (dresses, tops, knitwear, skirts, trousers, outerwear, bags and scarves)",
  /** Starter buttons in the empty assistant window. */
  starters: ['Ямар даашинз байна?', 'Цөцгий свитер M байгаа юу?', '150,000₮-өөс доош ямар цамц байна?', 'Хүргэлт хэд хоног вэ?', 'Яаж захиалах вэ?'],
  /** "Show me what you have" follow-ups. */
  browse: ['Ямар даашинз байна?', 'Өвөлд ямар хувцас тохирох вэ?'],
  /** How to order in the chat, written the way a shopper would. */
  orderExample: 'Хар арьсан хүрэм M авъя',
  inputPlaceholder: 'Жишээ: улаан даашинз S байгаа юу?',
  searchPlaceholder: 'Юу хайж байна вэ? — даашинз, свитер, арьсан хүрэм…',
  /** Example questions on the admin's test-chat page. */
  tryThese: [
    'Улаан даашинз S байгаа юу?',
    'ene tsamts hed ve',
    '150,000₮-өөс доош ямар цамц байна?',
    'Цайвар жинс M бий юу?',
    'Хүргэлт хэд хоног вэ?',
    'Хар арьсан хүрэм M авъя → энд захиалъя',
    'Ажилтантай холбогдмоор байна',
  ],
} as const

/** A size question to suggest for a product: one of its own middle sizes ("M размер байгаа юу?"). */
export function sizeQuestion(sizes: readonly string[]): string | null {
  const real = sizes.filter((s) => s !== 'ONE SIZE')
  if (real.length === 0) return null
  return `${real[Math.floor((real.length - 1) / 2)]} размер байгаа юу?`
}
