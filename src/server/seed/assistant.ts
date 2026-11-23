// Seed for the AI Chatbot section: default settings, a few of the owner's own
// questions and answers, and fictional sample conversations so the admin shows
// what hand-overs and inquiries look like before any visitor has chatted.
// Sample chats are channel "sample": read-only, labelled «Жишээ», never
// anonymised or pruned, and visible to the public demo. Idempotent: fixed ids,
// rows are only added when missing.
import { inArray } from 'drizzle-orm'
import { defaultAssistantSettings } from '@/lib/assistant/settings'
import type { Database } from '@/server/db/client'
import * as t from '@/server/db/schema'

import { SAMPLE_FAQS, SAMPLES } from './assistant-samples'

export { SAMPLE_FAQS }


export async function seedAssistant(tx: Database, now: Date): Promise<string[]> {
  const log: string[] = []
  const settings = await tx.insert(t.settings).values({ key: 'assistant', value: defaultAssistantSettings() }).onConflictDoNothing().returning({ key: t.settings.key })
  log.push(`assistant settings: +${settings.length}`)

  const existingFaqs = new Set((await tx.select({ q: t.chatFaqs.question }).from(t.chatFaqs)).map((r) => r.q))
  const faqs = SAMPLE_FAQS.filter((f) => !existingFaqs.has(f.question))
  if (faqs.length) await tx.insert(t.chatFaqs).values(faqs.map((f) => ({ ...f, enabled: true })))
  log.push(`assistant faq: +${faqs.length}`)

  const present = new Set((await tx.select({ id: t.chatConversations.id }).from(t.chatConversations).where(inArray(t.chatConversations.id, SAMPLES.map((s) => s.id)))).map((r) => r.id))
  const slugs = [...new Set(SAMPLES.flatMap((s) => [...s.messages.flatMap((m) => m.products ?? []), ...(s.handover?.products ?? [])]))]
  const products = slugs.length ? await tx.select({ id: t.products.id, slug: t.products.slug, name: t.products.name }).from(t.products).where(inArray(t.products.slug, slugs)) : []
  const productId = (slug: string) => products.find((p) => p.slug === slug)?.id
  let added = 0
  for (const sample of SAMPLES) {
    if (present.has(sample.id)) continue
    const start = new Date(now.getTime() - sample.hoursAgo * 3_600_000)
    const at = (minutes: number) => new Date(start.getTime() + minutes * 60_000)
    const lastAt = at(sample.messages[sample.messages.length - 1].minutes)
    const staffAt = sample.messages.filter((m) => m.role === 'staff').map((m) => at(m.minutes)).pop() ?? null
    const open = sample.handover?.status === 'open'
    await tx.insert(t.chatConversations).values({
      id: sample.id,
      channel: 'sample',
      needsHuman: open,
      handoffReason: open ? sample.handover!.reason : null,
      handoffAt: open ? at(sample.messages.find((m) => m.events?.some((e) => e.startsWith('handover')))?.minutes ?? 0) : null,
      lastHumanAt: staffAt,
      botReleasedAt: sample.handover?.status === 'resolved' ? at(sample.messages[sample.messages.length - 1].minutes + 1) : null,
      customerName: sample.customerName ?? null,
      customerPhone: sample.customerPhone ?? null,
      messageCount: sample.messages.length,
      unreadForStaff: open ? 1 : 0,
      lastMessageAt: lastAt,
      isDemo: true,
      createdAt: start,
    })
    await tx.insert(t.chatMessages).values(
      sample.messages.map((m, i) => ({
        conversationId: sample.id,
        role: m.role,
        text: m.text,
        clientMessageId: `sample-${i}`,
        createdAt: at(m.minutes),
        metadata:
          m.role === 'assistant'
            ? { intent: m.intent, mode: 'rules', productIds: (m.products ?? []).map(productId).filter(Boolean), cards: [], actions: [], suggestions: [], events: m.events ?? [], sample: true }
            : m.role === 'staff'
              ? { staffLabel: 'Эзэмшигч (жишээ)' }
              : { script: /[a-z]/i.test(m.text) && !/[Ѐ-ӿ]/.test(m.text) ? 'latin' : 'cyrillic' },
      })),
    )
    if (sample.handover) {
      const h = sample.handover
      await tx.insert(t.chatHandovers).values({
        conversationId: sample.id,
        reason: h.reason,
        status: h.status,
        question: h.question,
        context: {
          products: h.products.map((slug) => ({ slug, name: products.find((p) => p.slug === slug)?.name ?? slug })),
          variant: null,
          purchaseIntent: h.purchaseIntent,
          draftStep: null,
          lastMessages: sample.messages.filter((m) => m.role === 'customer').map((m) => m.text).slice(-4),
        },
        customerName: sample.customerName ?? null,
        customerPhone: sample.customerPhone ?? null,
        resolvedAt: h.status === 'resolved' ? lastAt : null,
        createdAt: start,
      })
    }
    added++
  }
  log.push(`sample conversations: +${added}`)
  return log
}

