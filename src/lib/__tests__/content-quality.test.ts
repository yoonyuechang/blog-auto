import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db', () => ({ db: {} }))

const { calculateQualityScore } = await import('@/lib/content-quality')

const highQuality = {
  content: 'A'.repeat(4000),
  aiSummary: 'A'.repeat(150),
  tags: JSON.stringify(['ai', 'ml', 'llm', 'nlp']),
  source: 'https://github.com/example',
}

const lowQuality = {
  content: 'short',
  aiSummary: '',
  tags: '[]',
  source: 'https://random-blog.com',
}

describe('calculateQualityScore', () => {
  it('high quality article scores high', () => {
    const r = calculateQualityScore(highQuality)
    expect(r.score).toBeGreaterThanOrEqual(75)
    expect(['S', 'A']).toContain(r.grade)
  })

  it('low quality article scores low', () => {
    const r = calculateQualityScore(lowQuality)
    expect(r.score).toBeLessThan(40)
    expect(['C', 'D']).toContain(r.grade)
  })

  it('grade boundaries', () => {
    const full = {
      content: 'A'.repeat(4000),
      aiSummary: 'A'.repeat(200),
      tags: JSON.stringify(['a', 'b', 'c', 'd']),
      source: 'https://github.com/x',
    }
    expect(calculateQualityScore(full).grade).toBe('S')

    const noTags = { ...full, tags: '[]' }
    expect(calculateQualityScore(noTags).grade).toBe('A')

    // no tags + short summary = C grade (35-54)
    const minimal = { content: 'A'.repeat(4000), aiSummary: 'short', tags: '[]', source: 'https://example.com' }
    expect(calculateQualityScore(minimal).grade).toBe('C')
  })
})
