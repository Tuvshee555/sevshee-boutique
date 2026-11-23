// Shapes of the assistant's seeded sample conversations (shop's own and reference).

export type SampleMessage = { role: 'customer' | 'assistant' | 'staff'; text: string; minutes: number; intent?: string; events?: string[]; products?: string[] }

/** Fixed ids so the seed only adds a sample when it is missing. */
export const sampleId = (n: number) => `00000000-0000-4000-8000-00000000c00${n}`

export interface SampleConversation {
  id: string
  hoursAgo: number
  customerName?: string
  customerPhone?: string
  handover?: { reason: string; status: 'open' | 'resolved'; question: string; products: string[]; purchaseIntent: boolean }
  messages: SampleMessage[]
}
