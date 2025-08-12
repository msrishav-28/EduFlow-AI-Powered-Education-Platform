import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations as any)

function Sample() {
  return (
    <main>
      <h1>Accessible</h1>
      <p>Content</p>
      <button>Click</button>
    </main>
  )
}

describe('a11y baseline', () => {
  it('has no axe violations for sample component', async () => {
    const { container } = render(<Sample />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
