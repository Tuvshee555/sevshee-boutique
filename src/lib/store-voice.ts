// How this store talks to shoppers: the example questions on the assistant's
// buttons and placeholders, and what kind of shop it is. Every example here is
// one the catalogue engine answers from the database (tests/unit/alkham-catalog.test.ts).
export const STORE_VOICE = {
  /** "…зохиомол <kindMn>" in the assistant's about answer. */
  kindMn: 'гутлын дэлгүүр',
  /** Used in the AI instructions ("a fictional <kindEn>"). */
  kindEn: 'shoe store (sneakers, boots, heels, formal shoes, flats, slippers and kids’ shoes)',
  /** Starter buttons in the empty assistant window. */
  starters: ['Ямар пүүз байна?', 'Челси ботинк 38 байгаа юу?', '200,000₮-өөс доош ямар гутал байна?', 'Хүргэлт хэд хоног вэ?', 'Яаж захиалах вэ?'],
  /** "Show me what you have" follow-ups. */
  browse: ['Ямар пүүз байна?', 'Өвөлд ямар гутал тохирох вэ?'],
  /** How to order in the chat, written the way a shopper would. */
  orderExample: 'Бүх хар пүүз 42 авъя',
  inputPlaceholder: 'Жишээ: челси ботинк 38 байгаа юу?',
  searchPlaceholder: 'Юу хайж байна вэ? — пүүз, челси, өвлийн ботинк…',
} as const

/** A size question to suggest for a product: one of its own middle sizes ("42 размер байгаа юу?"). */
export function sizeQuestion(sizes: readonly string[]): string | null {
  const real = sizes.filter((s) => s !== 'ONE SIZE')
  if (real.length === 0) return null
  return `${real[Math.floor((real.length - 1) / 2)]} размер байгаа юу?`
}
