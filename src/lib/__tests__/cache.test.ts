import { describe, it, expect, beforeEach } from 'vitest'
import { cache } from '@/lib/cache'

beforeEach(() => {
  cache.clear()
})

describe('cache', () => {
  it('set and get', () => {
    cache.set('key1', 'value1', 1000)
    expect(cache.get<string>('key1')).toBe('value1')
  })

  it('returns null for missing keys', () => {
    expect(cache.get('missing')).toBeNull()
  })

  it('TTL expiration', () => {
    cache.set('temp', 'data', 1) // 1ms TTL
    // wait for expiry
    const start = Date.now()
    while (Date.now() - start < 5) {}
    expect(cache.get('temp')).toBeNull()
  })

  it('has and clear', () => {
    cache.set('a', 1, 1000)
    cache.set('b', 2, 1000)
    expect(cache.has('a')).toBe(true)
    cache.clear()
    expect(cache.has('a')).toBe(false)
    expect(cache.size).toBe(0)
  })

  it('size tracking', () => {
    cache.set('x', 1, 1000)
    cache.set('y', 2, 1000)
    expect(cache.size).toBe(2)
    cache.clear()
    expect(cache.size).toBe(0)
  })

  it('getStats returns hit/miss counts', () => {
    cache.get('nope')
    cache.set('ok', 1, 1000)
    cache.get('ok')
    cache.get('ok')
    const s = cache.getStats()
    expect(s.hits).toBe(2)
    expect(s.misses).toBe(1)
    expect(s.size).toBe(1)
  })
})
