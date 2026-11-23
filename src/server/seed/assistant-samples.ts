// The assistant's seeded FAQ and sample chats: SEVSHEE's, or the MANAN reference
// for the engine's tests (STORE_CATALOG=reference, see ./catalog-data.ts).
import * as sevshee from './sevshee/assistant-samples'
import * as reference from './reference/assistant-samples'

const data = process.env.STORE_CATALOG === 'reference' ? reference : sevshee

export const SAMPLE_FAQS = data.SAMPLE_FAQS
export const SAMPLES = data.SAMPLES
