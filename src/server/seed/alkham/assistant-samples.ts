// ALKHAM's own questions and answers, and fictional sample conversations so the
// admin shows what hand-overs and inquiries look like before any visitor has chatted.
import { sampleId as ID, type SampleConversation } from '../assistant-types'

export const SAMPLE_FAQS = [
  {
    question: 'Дэлгүүр дээр очиж өмсөж үзэж болох уу?',
    answer: 'ALKHAM бол зөвхөн онлайн дэлгүүр (портфолио демо) — биет дэлгүүр байхгүй. Харин хүргэгч хаалган дээр хүлээж байхад өмсөж үзээд, таарахгүй бол тэр дор нь буцааж болно.',
    sortOrder: 1,
  },
  {
    question: 'Гутлаа хайрцагтай нь авах уу?',
    answer: 'Тийм, гутал бүр өөрийн хайрцагтай ирнэ. Буцаах, солих бол хайрцаг, шошгыг нь хадгалаарай.',
    sortOrder: 2,
  },
  {
    question: 'Өвлийн гутал хэдэн хэмд дулаан байх вэ?',
    answer: 'Ноосон доторлогоотой «Өвлийн ажлын ботинк» хасах 30 хэм хүртэлх хүйтэнд зориулагдсан. Зузаан ноосон оймстой өмсөх бол нэг размер томыг сонгоорой.',
    sortOrder: 3,
  },
]

export const SAMPLES: SampleConversation[] = [
  {
    id: ID(1),
    hoursAgo: 30,
    messages: [
      { role: 'customer', text: 'Өвлийн ажлын ботинк 42 байгаа юу?', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, «Өвлийн ажлын ботинк» — Шаргал / 42 дууссан.\nБэлэн размер: 41, 43.\nДэлгэрэнгүй: [Өвлийн ажлын ботинк](/products/winter-work-boot)', minutes: 0, intent: 'product', events: ['variant_check'], products: ['winter-work-boot'] },
      { role: 'customer', text: '43 iig sagsand nemeed ugch bolhuu', minutes: 1 },
      { role: 'assistant', text: 'Сагсанд нэмлээ: **Өвлийн ажлын ботинк — Шаргал / 43** × 1.\nЗахиалахдаа [сагс](/cart) руу орж «Захиалах» дарна уу.', minutes: 1, intent: 'added_to_cart', events: ['purchase_intent', 'added_to_cart'], products: ['winter-work-boot'] },
    ],
  },
  {
    id: ID(2),
    hoursAgo: 3,
    customerName: 'Сараа (жишээ)',
    customerPhone: '00001234',
    handover: { reason: 'customer_request', status: 'open', question: 'Ажилтантай холбогдмоор байна', products: ['crystal-party-heel'], purchaseIntent: true },
    messages: [
      { role: 'customer', text: 'Үдэшлэгийн гутлыг хуримын өдрөөс өмнө өсгийг нь намсгуулж болох уу?', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, энэ асуултад дэлгүүрийн сангаас баттай хариулт олдсонгүй — таамаглаж хэлэхгүй.\n[Гялалзсан үдэшлэгийн гутал](/products/crystal-party-heel)-ын үнэ, размер, үлдэгдлийн талаар асууж болно.', minutes: 0, intent: 'fallback', events: ['unanswered'], products: ['crystal-party-heel'] },
      { role: 'customer', text: 'Ажилтантай холбогдмоор байна', minutes: 2 },
      { role: 'assistant', text: 'Ойлголоо — яриаг ажилтанд шилжүүллээ. Ажилтан энэ чатаар хариулна. Нэр, утасны дугаараа үлдээвэл холбогдоход хялбар.', minutes: 2, intent: 'handoff', events: ['handover:customer_request'] },
      { role: 'customer', text: 'Сараа, 0000 1234', minutes: 3 },
    ],
  },
  {
    id: ID(3),
    hoursAgo: 26,
    customerName: 'Тэмүүлэн (жишээ)',
    handover: { reason: 'complaint', status: 'resolved', question: 'Захиалсан гутал маань өөр размер ирсэн', products: ['all-black-sneaker'], purchaseIntent: false },
    messages: [
      { role: 'customer', text: 'Захиалсан гутал маань өөр размер ирсэн', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, ийм зүйл тохиолдсонд харамсаж байна. Асуудлыг ажилтанд шилжүүллээ — захиалгын дугаар (MN-…) болон юу болсныг товч бичээрэй, ажилтан энэ чатаар хариулна.', minutes: 0, intent: 'handoff', events: ['handover:complaint'] },
      { role: 'customer', text: 'Бүх хар пүүз 43 захиалсан, 42 ирсэн', minutes: 1 },
      { role: 'staff', text: 'Уучлаарай! Солилтыг үнэгүй хийнэ — маргааш 43 размерыг хүргэж, 42-ыг буцааж авна. (Жишээ яриа)', minutes: 12 },
      { role: 'customer', text: 'За баярлалаа', minutes: 14 },
    ],
  },
  {
    id: ID(4),
    hoursAgo: 8,
    messages: [
      { role: 'customer', text: 'ene chelsi botink hed ve', minutes: 0 },
      { role: 'assistant', text: '«Челси ботинк» — **289,000₮**.\nӨнгө: Хар, Шаргал. [Челси ботинк](/products/heeled-chelsea-boot)', minutes: 0, intent: 'product', events: ['product_answer'], products: ['heeled-chelsea-boot'] },
      { role: 'customer', text: '38 bga yu', minutes: 1 },
      { role: 'assistant', text: '«Челси ботинк» — 38 размер:\n- Хар: бэлэн\n- Шаргал: дууссан\nАль өнгийг авах вэ?', minutes: 1, intent: 'product', events: ['variant_check'], products: ['heeled-chelsea-boot'] },
    ],
  },
  {
    id: ID(5),
    hoursAgo: 50,
    messages: [
      { role: 'customer', text: 'Танайд усан гутал байна уу?', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, ийм бараа манай сангаас олдсонгүй.\nМанайд: пүүз, ботинк, өсгийтэй гутал, туфли, лофер, хавтгай гутал, шаахай, хүүхдийн гутал байна.', minutes: 0, intent: 'fallback', events: ['unanswered', 'not_in_catalogue'] },
    ],
  },
]
