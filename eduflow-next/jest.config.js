const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

const customConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/']
}

module.exports = createJestConfig(customConfig)
