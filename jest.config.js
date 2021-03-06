/* istanbul ignore file */

module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/config/jest/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/coverage/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/src/config/jest/cssTransform.js'
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  }
};
