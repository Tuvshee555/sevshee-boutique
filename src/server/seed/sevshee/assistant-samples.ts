// SEVSHEE's own questions and answers, and fictional sample conversations so the
// admin shows what hand-overs and inquiries look like before any visitor has chatted.
import { sampleId as ID, type SampleConversation } from '../assistant-types'

export const SAMPLE_FAQS = [
  {
    question: 'Дэлгүүр дээр очиж өмсөж үзэж болох уу?',
    answer: 'SEVSHEE бол зөвхөн онлайн дэлгүүр (портфолио демо) — биет дэлгүүр байхгүй. Хэмжээ таарахгүй бол 14 хоногийн дотор нэг удаа үнэгүй сольж өгнө.',
    sortOrder: 1,
  },
  {
    question: 'Бэлгийн боодолтой хүргэж болох уу?',
    answer: 'Тийм. Захиалгын тайлбарт «бэлэг» гэж бичвэл үнийн шошгогүй, боодолтой хүргэнэ (демо).',
    sortOrder: 2,
  },
  {
    question: 'Даашинзны уртыг тааруулж өгдөг үү?',
    answer: 'Одоогоор оёдлын засвар хийдэггүй. Барааны хуудсанд загвар бүрийн хэлбэр, хэмжээний хүснэгт бий — эргэлзвэл ажилтнаас асуугаарай.',
    sortOrder: 3,
  },
]

export const SAMPLES: SampleConversation[] = [
  {
    id: ID(1),
    hoursAgo: 30,
    messages: [
      { role: 'customer', text: 'Цөцгий өнгийн свитер M байгаа юу?', minutes: 0 },
      { role: 'assistant', text: '«Цөцгий өнгийн сүлжмэл свитер» — Цөцгий / M: 5 ширхэг байна, 199,000₮.\nДэлгэрэнгүй: [Цөцгий өнгийн сүлжмэл свитер](/products/cream-sweater)', minutes: 0, intent: 'product', events: ['variant_check'], products: ['cream-sweater'] },
      { role: 'customer', text: 'sagsand nemeed ugch bolhuu', minutes: 1 },
      { role: 'assistant', text: 'Сагсанд нэмлээ: **Цөцгий өнгийн сүлжмэл свитер — Цөцгий / M** × 1.\nЗахиалахдаа [сагс](/cart) руу орж «Захиалах» дарна уу.', minutes: 1, intent: 'added_to_cart', events: ['purchase_intent', 'added_to_cart'], products: ['cream-sweater'] },
    ],
  },
  {
    id: ID(2),
    hoursAgo: 3,
    customerName: 'Сараа (жишээ)',
    customerPhone: '00001234',
    handover: { reason: 'customer_request', status: 'open', question: 'Ажилтантай холбогдмоор байна', products: ['sequin-slip-dress'], purchaseIntent: true },
    messages: [
      { role: 'customer', text: 'Гялалзсан даашинзыг шинэ жилийн үдэшлэгээс өмнө хүргэж амжих уу? 28-нд хэрэгтэй', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, энэ асуултад дэлгүүрийн сангаас баттай хариулт олдсонгүй — таамаглаж хэлэхгүй.\n[Гялалзсан хар даашинз](/products/sequin-slip-dress)-ын үнэ, хэмжээ, үлдэгдлийн талаар асууж болно.', minutes: 0, intent: 'fallback', events: ['unanswered'], products: ['sequin-slip-dress'] },
      { role: 'customer', text: 'Ажилтантай холбогдмоор байна', minutes: 2 },
      { role: 'assistant', text: 'Ойлголоо — яриаг ажилтанд шилжүүллээ. Ажилтан энэ чатаар хариулна. Нэр, утасны дугаараа үлдээвэл холбогдоход хялбар.', minutes: 2, intent: 'handoff', events: ['handover:customer_request'] },
      { role: 'customer', text: 'Сараа, 0000 1234', minutes: 3 },
    ],
  },
  {
    id: ID(3),
    hoursAgo: 26,
    customerName: 'Мөнхзул (жишээ)',
    handover: { reason: 'complaint', status: 'resolved', question: 'Захиалсан өмд маань өөр хэмжээ ирсэн', products: ['striped-trousers'], purchaseIntent: false },
    messages: [
      { role: 'customer', text: 'Захиалсан өмд маань өөр хэмжээ ирсэн', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, ийм зүйл тохиолдсонд харамсаж байна. Асуудлыг ажилтанд шилжүүллээ — захиалгын дугаар (MN-…) болон юу болсныг товч бичээрэй, ажилтан энэ чатаар хариулна.', minutes: 0, intent: 'handoff', events: ['handover:complaint'] },
      { role: 'customer', text: 'Судалтай өргөн өмд S захиалсан, M ирсэн', minutes: 1 },
      { role: 'staff', text: 'Уучлаарай! Солилтыг үнэгүй хийнэ — маргааш S хэмжээг хүргэж, M-ийг буцааж авна. (Жишээ яриа)', minutes: 12 },
      { role: 'customer', text: 'За баярлалаа', minutes: 14 },
    ],
  },
  {
    id: ID(4),
    hoursAgo: 8,
    messages: [
      { role: 'customer', text: 'ulaan dashinz hed ve', minutes: 0 },
      { role: 'assistant', text: '«Улаан нэг мөртэй даашинз» — **249,000₮**.\nӨнгө: Улаан. [Улаан нэг мөртэй даашинз](/products/red-ruffle-dress)', minutes: 0, intent: 'product', events: ['product_answer'], products: ['red-ruffle-dress'] },
      { role: 'customer', text: 'S bga yu', minutes: 1 },
      { role: 'assistant', text: '«Улаан нэг мөртэй даашинз» — Улаан / S: 2 ширхэг байна, 249,000₮.\nАвах бол «авъя» гэж бичээрэй.', minutes: 1, intent: 'product', events: ['variant_check'], products: ['red-ruffle-dress'] },
    ],
  },
  {
    id: ID(5),
    hoursAgo: 50,
    messages: [
      { role: 'customer', text: 'Танайд хүүхдийн хувцас байна уу?', minutes: 0 },
      { role: 'assistant', text: 'Уучлаарай, ийм бараа манай сангаас олдсонгүй.\nМанайд: даашинз, цамц, блуз, сүлжмэл, банзал, өмд, жинс, гадуур хувцас, цүнх, ороолт байна.', minutes: 0, intent: 'fallback', events: ['unanswered', 'not_in_catalogue'] },
    ],
  },
]
