import { describe, it, expect } from 'vitest'
import { checkRateLimit } from '@/lib/rate-limit'

describe('checkRateLimit', () => {
  it('allows within limit', () => {
    const r = checkRateLimit('test-allow', 3, 1000)
    expect(r.allowed).toBe(true)
    expect(r.remaining).toBe(2)
  })

  it('blocks over limit', () => {
    const key = 'test-block-' + Date.now()
    checkRateLimit(key, 2, 60000)
    checkRateLimit(key, 2, 60000)
    const third = checkRateLimit(key, 2, 60000)
    expect(third.allowed).toBe(false)
    expect(third.remaining).toBe(0)
  })

  it('window reset allows again', async () => {
    const key = 'test-reset-' + Date.now()
    checkRateLimit(key, 1, 50) // 50ms window
    const blocked = checkRateLimit(key, 1, 50)
    expect(blocked.allowed).toBe(false)

    await new Promise((r) => setTimeout(r, 60))
    const allowed = checkRateLimit(key, 1, 50)
    expect(allowed.allowed).toBe(true)
  })
})
