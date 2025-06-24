module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.spec.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};