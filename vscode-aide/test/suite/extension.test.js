'use strict';

const assert = require('node:assert/strict');
let vscode;
try {
  vscode = require('vscode');
} catch {
  require('node:test').skip('VS Code Extension Host専用テスト', () => {});
}

if (vscode) suite('AIDE extension', () => {
  test('activates and registers the public commands', async () => {
    const extension = vscode.extensions.getExtension('daichi.aide-buttons');
    assert.ok(extension, 'extension is discoverable');
    await extension.activate();
    const commands = await vscode.commands.getCommands(true);
    for (const command of [
      'aide.initialize', 'aide.createLane', 'aide.refresh', 'aide.openMaster',
      'aide.openReport', 'aide.openLogs', 'aide.observeLane', 'aide.approveSection',
      'aide.approveLane', 'aide.integrate', 'aide.status', 'aide.watchToggle',
    ]) {
      assert.ok(commands.includes(command), `${command} is registered`);
    }
    await vscode.commands.executeCommand('aide.refresh');
  });

  test('provides Observe and Approve CodeLens for a lane', async () => {
    const folder = vscode.workspace.workspaceFolders[0];
    const uri = vscode.Uri.joinPath(folder.uri, 'design', 'lanes', 'sample.md');
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
    const lenses = await vscode.commands.executeCommand('vscode.executeCodeLensProvider', uri);
    const commands = lenses.map((lens) => lens.command && lens.command.command).filter(Boolean);
    assert.ok(commands.includes('aide.observeLane'));
    assert.ok(commands.includes('aide.approveLane'));
    assert.ok(commands.includes('aide.approveSection'));
  });
});
