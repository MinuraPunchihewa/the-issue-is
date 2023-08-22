module.exports = {
  testEnvironment: 'node --experimental-vm-modules node_modules/jest/bin/jest.js',
  testMatch: [
    '**/tests/**/*.test.mjs'
  ],
  transform: {},
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
  moduleFileExtensions: [
    'js',
    'mjs',
    'json',
    'node'
  ],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};