import { aiGenerate } from '../lib/api'

describe('aiGenerate', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn()
  })
  it('throws on non-ok response', async () => {
    // @ts-ignore
    fetch.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({ error: 'fail' }) })
    await expect(aiGenerate('test','auto')).rejects.toThrow(/fail/)
  })
  it('returns content on success', async () => {
    // @ts-ignore
    fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ content: 'Hello' }) })
    await expect(aiGenerate('test','auto')).resolves.toBe('Hello')
  })
})
