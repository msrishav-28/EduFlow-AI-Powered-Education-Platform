import { parseMCQs } from '../lib/mcq'

describe('parseMCQs', () => {
  it('parses JSON array format', () => {
    const input = JSON.stringify([
      { question: 'Q1', options: ['Opt1','Opt2','Opt3','Opt4'], correct: 'B', explanation: 'Because' }
    ])
    const res = parseMCQs('Some preface ' + input + ' trailing')
    expect(res).not.toBeNull()
    expect(res![0].correct).toBe('B')
    expect(res![0].options).toHaveLength(4)
  })
  it('parses plain text blocks', () => {
    const input = `1. What?\nA. One\nB. Two\nC. Three\nAnswer: B\nExplanation: test`;
    const res = parseMCQs(input)
    expect(res).not.toBeNull()
    expect(res![0].correct).toBe('B')
    expect(res![0].explanation).toMatch(/test/)
  })
})
