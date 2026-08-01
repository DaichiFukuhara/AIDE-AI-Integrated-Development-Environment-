'use strict';

const fs = require('node:fs');
const path = require('node:path');

const extensionRoot = path.resolve(__dirname, '..');
const repositoryRoot = path.resolve(extensionRoot, '..');
const engineRoot = path.join(extensionRoot, 'engine');
fs.mkdirSync(engineRoot, { recursive: true });
for (const name of ['aide.js', 'mdtalk.js', 'knowledge.js']) {
  fs.copyFileSync(path.join(repositoryRoot, name), path.join(engineRoot, name));
}
console.log(`AIDE engine prepared: ${engineRoot}`);
