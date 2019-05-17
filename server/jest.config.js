module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test-utils/setup.ts',
  setupFilesAfterEnv: ['jest-extended'],
};
