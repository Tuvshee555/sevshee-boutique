// Token and signature helpers (server only, no Next.js imports).
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

let derived: string | null = null

function secret(): string {
  const value = process.env.SESSION_SECRET
  if (value && value.length >= 32) return value
  // Without its own SESSION_SECRET a deployment derives one from DATABASE_URL: server-only,
  // secret (it holds the database password) and stable across deploys.
  const databaseUrl = process.env.DATABASE_URL
  if (databaseUrl) return (derived ??= createHash('sha256').update(`sevshee:session-secret:${databaseUrl}`).digest('base64url'))
  if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET (or DATABASE_URL) must be set')
  return 'development-only-secret-do-not-use-in-production'
}

export function hmac(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

export function verifyHmac(value: string, signature: string): boolean {
  const expected = Buffer.from(hmac(value))
  const given = Buffer.from(signature)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

/** One-way hash of an IP address for rate limits — raw IPs are never stored. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  return createHmac('sha256', secret()).update(`ip:${ip}`).digest('hex').slice(0, 32)
}

/** The stored form of a visitor id: orders, carts and demo sessions keep only this. */
export function visitorKeyOf(visitorId: string): string {
  return createHmac('sha256', secret()).update(`visitor:${visitorId}`).digest('hex').slice(0, 40)
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}
