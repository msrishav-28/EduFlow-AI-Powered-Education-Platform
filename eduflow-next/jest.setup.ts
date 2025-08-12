import '@testing-library/jest-dom'
// Accessibility matchers (jest-axe)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { toHaveNoViolations } = require('jest-axe')
// Library exports an object with property toHaveNoViolations which itself has matcher method
// We need to pass the matcher function not the wrapper object
// @ts-ignore
expect.extend({ toHaveNoViolations: toHaveNoViolations.toHaveNoViolations })
