import { describe, it, expect } from 'vitest'
import {
  extractHeadingsFromMarkdown,
  generateBreadcrumbSchema,
  generateFAQSchema,
  extractMetaDescription,
} from '@/lib/seo-loop'

describe('extractHeadingsFromMarkdown', () => {
  it('extracts h2 and h3 headings', () => {
    const md = `## First Heading\n\nSome text\n\n### Sub Heading\n\nMore text\n\n## Second Heading`
    const headings = extractHeadingsFromMarkdown(md)
    expect(headings).toHaveLength(3)
    expect(headings[0]).toEqual({ level: 2, text: 'First Heading', id: 'first-heading' })
    expect(headings[1]).toEqual({ level: 3, text: 'Sub Heading', id: 'sub-heading' })
  })

  it('strips formatting from heading text', () => {
    const md = '## **Bold** and *italic* heading'
    const headings = extractHeadingsFromMarkdown(md)
    expect(headings[0].text).toBe('Bold and italic heading')
  })

  it('returns empty for no headings', () => {
    expect(extractHeadingsFromMarkdown('Just plain text')).toHaveLength(0)
  })
})

describe('generateBreadcrumbSchema', () => {
  it('generates correct breadcrumb', () => {
    const schema = generateBreadcrumbSchema({ id: 1, title: 'My Post', category: 'AI' })
    expect(schema.itemListElement).toHaveLength(3)
    expect(schema.itemListElement[0].name).toBe('홈')
    expect(schema.itemListElement[1].name).toBe('AI')
    expect(schema.itemListElement[2].name).toBe('My Post')
  })
})

describe('generateFAQSchema', () => {
  it('generates FAQ schema', () => {
    const schema = generateFAQSchema([
      { question: 'What is AI?', answer: 'Artificial Intelligence.' },
    ])
    expect(schema!['@type']).toBe('FAQPage')
    expect(schema!.mainEntity).toHaveLength(1)
  })

  it('returns null for empty array', () => {
    expect(generateFAQSchema([])).toBeNull()
  })
})

describe('extractMetaDescription', () => {
  it('returns short summary as-is', () => {
    const result = extractMetaDescription('A short description', 160)
    expect(result).toBe('A short description')
  })

  it('truncates long summary', () => {
    const long = 'A'.repeat(200)
    const result = extractMetaDescription(long, 160)
    expect(result.length).toBeLessThanOrEqual(160)
    expect(result).toContain('…')
  })

  it('strips markdown characters', () => {
    expect(extractMetaDescription('**bold** and `code`')).toBe('bold and code')
  })
})
