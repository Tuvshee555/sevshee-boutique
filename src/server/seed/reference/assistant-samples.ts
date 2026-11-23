// MANAN's sample FAQ and conversations: the reference the engine's tests run
// against (STORE_CATALOG=reference, see ../catalog-data.ts).
import { sampleId as ID, type SampleConversation } from '../assistant-types'

export const SAMPLE_FAQS = [
  {
    question: 'Дэлгүүр дээр очиж үзэж болох уу?',
    answer: 'MANAN бол зөвхөн онлайн дэлгүүр (портфолио демо) — биет дэлгүүр, шоурум байхгүй. Барааны хуудсанд өнгө тус бүрийн зураг, материал, хэмжээний хүснэгт бий.',
    sortOrder: 1,
  },
  {
    question: 'Бэлгийн карт байдаг уу?',
    answer: 'Одоогоор бэлгийн карт гаргадаггүй. Бэлэг болгож явуулах бол хүлээн авагчийн хаягаар захиалж, тэмдэглэлд нь бичээрэй.',
    sortOrder: 2,
  },
  {
    question: 'Захиалгаа өөр хүнээр хүлээн авахуулж болох уу?',
    answer: 'Болно. Захиалахдаа хүлээн авагчийн нэр, утсыг хүргэлтийн тэмдэглэлд бичээрэй — хүргэгч тэр хүнтэй холбогдоно.',
    sortOrder: 3,
  },
]

export const SAMPLES: SampleConversation[] = [
  {
    id: ID(1),
    hoursAgo: 30,
    messages: [
      { role: 'customer', text: 'Оверсайз hoodie хар өнгөөр M байгаа юу?', minutes: 0 },
      { role: 'assistant', text: 'Тийм, «Оверсайз hoodie» — Хар / M бэлэн байна. Үнэ 219,000₮.\nДэлгэрэнгүй: [Оверсайз hoodie](/products/oversized-hoodie)', minutes: 0, intent: 'product', events: ['variant_check'], products: ['oversized-hoodie'] },
      { role: 'customer', text: 'Сагсанд нэмээд өгөөч', minutes: 1 },
      { role: 'assistant', text: 'Сагсанд нэмлээ: **Оверсайз hoodie — Хар / M** × 1.\nЗахиалахдаа [сагс](/cart) руу орж «Захиалах» дарна уу.', minutes: 1, intent: 'added_to_cart', events: ['purchase_intent', 'added_to_cart'], products: ['oversized-hoodie'] },
    ],
  },
  {
    id: ID(2),
    hoursAgo: 3,
    customerName: 'Сараа (жишээ)',
    customerPhone: '00001234',
    handover: { reason: 'customer_request', status: 'open', question: 'Ажилтантай холбогдмоор байна', products: ['cashmere-crew-sweater'], purchaseIntent: true },
    messages: [
      { role: 'customer', text: 'Ноолууран свитерийг бэлгийн боодолтой явуулж болох уу?', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, энэ асуултад дэлгүүрийн сангаас баттай хариулт олдсонгүй — таамаглаж хэлэхгүй.\n[Ноолууран свитер](/products/cashmere-crew-sweater)-ийн үнэ, өнгө, хэмжээ, үлдэгдэл, материалын талаар асууж болно.', minutes: 0, intent: 'fallback', events: ['unanswered'], products: ['cashmere-crew-sweater'] },
      { role: 'customer', text: 'Ажилтантай холбогдмоор байна', minutes: 2 },
      { role: 'assistant', text: 'Ойлголоо — яриаг ажилтанд шилжүүллээ. Ажилтан энэ чатаар хариулна. Нэр, утасны дугаараа үлдээвэл холбогдоход хялбар.', minutes: 2, intent: 'handoff', events: ['handover:customer_request'] },
      { role: 'customer', text: 'Сараа, 0000 1234', minutes: 3 },
    ],
  },
  {
    id: ID(3),
    hoursAgo: 26,
    customerName: 'Тэмүүлэн (жишээ)',
    handover: { reason: 'complaint', status: 'resolved', question: 'Захиалсан цамц маань өөр хэмжээ ирсэн', products: ['oxford-shirt'], purchaseIntent: false },
    messages: [
      { role: 'customer', text: 'Захиалсан цамц маань өөр хэмжээ ирсэн', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, ийм зүйл тохиолдсонд харамсаж байна. Асуудлыг ажилтанд шилжүүллээ — захиалгын дугаар (MN-…) болон юу болсныг товч бичээрэй, ажилтан энэ чатаар хариулна.', minutes: 0, intent: 'handoff', events: ['handover:complaint'] },
      { role: 'customer', text: 'Оксфорд цамц M захиалсан, L ирсэн', minutes: 1 },
      { role: 'staff', text: 'Уучлаарай! Солилтыг үнэгүй хийнэ — маргааш M хэмжээг хүргэж, L-ийг буцааж авна. (Жишээ яриа)', minutes: 12 },
      { role: 'customer', text: 'За баярлалаа', minutes: 14 },
    ],
  },
  {
    id: ID(4),
    hoursAgo: 8,
    messages: [
      { role: 'customer', text: 'ene palito hed ve', minutes: 0 },
      { role: 'assistant', text: '«Ноосон пальто» — **459,000₮**.\nӨнгө: Хар, Шаргал хүрэн. [Ноосон пальто](/products/double-faced-wool-coat)', minutes: 0, intent: 'product', events: ['product_answer'], products: ['double-faced-wool-coat'] },
      { role: 'customer', text: 'XL bga yu', minutes: 1 },
      { role: 'assistant', text: '«Ноосон пальто» — XL хэмжээ:\n- Хар: цөөн үлдсэн\n- Шаргал хүрэн: дууссан\nАль өнгийг авах вэ?', minutes: 1, intent: 'product', events: ['variant_check'], products: ['double-faced-wool-coat'] },
    ],
  },
  {
    id: ID(5),
    hoursAgo: 50,
    messages: [
      { role: 'customer', text: 'Танайд даашинз байна уу?', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, ийм бараа манай сангаас олдсонгүй.\nМанайд: футболк, цамц, hoodie, свитшот, сүлжмэл, хүрэм, пальто, өмд, жинс, дагалдах хэрэгсэл байна.', minutes: 0, intent: 'fallback', events: ['unanswered', 'not_in_catalogue'] },
    ],
  },
]
