const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig({
  files: 'test/suite/**/*.test.js',
  version: 'stable',
  workspaceFolder: 'test/fixture',
  mocha: {
    timeout: 20000,
  },
});
