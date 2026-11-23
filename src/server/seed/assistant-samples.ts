// The assistant's seeded FAQ and sample chats: ALKHAM's, or the MANAN reference
// for the engine's tests (STORE_CATALOG=reference, see ./catalog-data.ts).
import * as alkham from './alkham/assistant-samples'
import * as reference from './reference/assistant-samples'

const data = process.env.STORE_CATALOG === 'reference' ? reference : alkham

export const SAMPLE_FAQS = data.SAMPLE_FAQS
export const SAMPLES = data.SAMPLES
