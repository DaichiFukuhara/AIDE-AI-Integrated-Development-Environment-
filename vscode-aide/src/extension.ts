import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ChildProcess, spawn } from 'node:child_process';
import { Debouncer, errorTail, laneVisual, parseStatusJson, resolveDesignRoot, safeTopic } from './core';
import { runProcess, ProcessResult } from './process';
import { AideLane, AidePoolEntry, AideStatus } from './types';

type NodeKind = 'group' | 'master' | 'lane' | 'report' | 'section' | 'poolEntry' | 'archive';

class AideNode extends vscode.TreeItem {
  filePath?: string;
  lanePath?: string;
  heading?: string;
  line?: number;
  needle?: string;
  lane?: AideLane;
  poolEntry?: AidePoolEntry;

  constructor(
    readonly kind: NodeKind,
    label: string,
    state: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
  ) {
    super(label, state);
    this.contextValue = kind;
  }
}

class AideTreeProvider implements vscode.TreeDataProvider<AideNode> {
  private readonly emitter = new vscode.EventEmitter<AideNode | undefined>();
  readonly onDidChangeTreeData = this.emitter.event;
  private status: AideStatus | undefined;
  private watching = new Set<string>();

  setState(status: AideStatus | undefined, watching: Set<string>): void {
    this.status = status;
    this.watching = watching;
    this.emitter.fire(undefined);
  }

  getStatus(): AideStatus | undefined {
    return this.status;
  }

  getTreeItem(element: AideNode): vscode.TreeItem {
    return element;
  }

  getChildren(element?: AideNode): AideNode[] {
    const status = this.status;
    if (!status?.initialized) return [];
    if (!element) return this.rootNodes(status);
    if (element.kind === 'group' && element.label === 'Lanes') return status.lanes.map((lane) => this.laneNode(status, lane));
    if (element.kind === 'group' && element.label === 'Pool') return status.pool.entries.map((entry) => this.poolNode(status, entry));
    if (element.kind === 'lane' && element.lane) return this.laneChildren(status, element.lane);
    return [];
  }

  private rootNodes(status: AideStatus): AideNode[] {
    const master = new AideNode('master', 'Master');
    master.description = status.master.exists ? `${status.master.bytes} bytes` : 'なし';
    master.iconPath = new vscode.ThemeIcon('book');
    master.filePath = path.join(status.root, status.master.path);
    master.command = { command: 'aide.openTreeItem', title: 'Open Master', arguments: [master] };

    const lanes = new AideNode('group', 'Lanes', status.lanes.length
      ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
    lanes.description = `${status.lanes.length}`;
    lanes.iconPath = new vscode.ThemeIcon('git-branch');

    const pool = new AideNode('group', 'Pool', status.pool.count
      ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
    pool.description = `${status.pool.count}件`;
    pool.iconPath = new vscode.ThemeIcon('archive');
    pool.filePath = path.join(status.root, status.pool.path);
    if (!status.pool.count) pool.command = { command: 'aide.openTreeItem', title: 'Open Pool', arguments: [pool] };

    const archive = new AideNode('archive', 'Archive');
    archive.description = `${status.archive.count}件（統合 ${status.archive.integrated} / 差し戻し ${status.archive.bounced}）`;
    archive.iconPath = new vscode.ThemeIcon('history');
    archive.filePath = path.join(status.root, status.archive.path);
    archive.command = { command: 'aide.openTreeItem', title: 'Open Archive', arguments: [archive] };
    return [master, lanes, pool, archive];
  }

  private laneNode(status: AideStatus, lane: AideLane): AideNode {
    const absolute = path.join(status.root, lane.path);
    const visual = laneVisual(lane, this.watching.has(normalizePath(absolute)));
    const hasChildren = Boolean(lane.report || lane.headings.length);
    const node = new AideNode('lane', lane.topic, hasChildren
      ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
    node.description = visual.description;
    node.iconPath = new vscode.ThemeIcon(visual.icon);
    node.filePath = absolute;
    node.lanePath = absolute;
    node.lane = lane;
    node.tooltip = lane.report
      ? `${lane.path}\n現在のレベル: ${lane.observeLevel} (${lane.observeLevelSource})\n最新観察: ${lane.report.verdict} (${lane.report.observeLevel})${lane.stale ? '（観察後に編集あり）' : ''}`
      : `${lane.path}\n現在のレベル: ${lane.observeLevel} (${lane.observeLevelSource})\nまだ観察されていません`;
    node.command = { command: 'aide.openTreeItem', title: 'Open Lane', arguments: [node] };
    return node;
  }

  private laneChildren(status: AideStatus, lane: AideLane): AideNode[] {
    const absolute = path.join(status.root, lane.path);
    const nodes: AideNode[] = [];
    if (lane.report) {
      const report = new AideNode('report', `Report: ${lane.report.verdict ?? 'unknown'}`);
      report.description = `${lane.report.observeLevel}${lane.report.date ? ` · ${lane.report.date}` : ''}`;
      report.iconPath = new vscode.ThemeIcon(lane.report.verdict === 'pass' ? 'pass' : 'error');
      report.filePath = path.join(status.root, lane.report.path);
      report.lanePath = absolute;
      report.command = { command: 'aide.openTreeItem', title: 'Open Report', arguments: [report] };
      nodes.push(report);
    }
    for (const heading of lane.headings) {
      const section = new AideNode('section', heading.title);
      section.description = `L${heading.line}`;
      section.iconPath = new vscode.ThemeIcon('symbol-namespace');
      section.filePath = absolute;
      section.lanePath = absolute;
      section.heading = heading.title;
      section.line = heading.line;
      section.command = { command: 'aide.openTreeItem', title: 'Open Section', arguments: [section] };
      nodes.push(section);
    }
    return nodes;
  }

  private poolNode(status: AideStatus, entry: AidePoolEntry): AideNode {
    const node = new AideNode('poolEntry', entry.section || entry.id);
    node.description = `${entry.lane} · ${entry.id}`;
    node.tooltip = `Accepted: ${entry.accepted}\nReport: ${entry.report}`;
    node.iconPath = new vscode.ThemeIcon('package');
    node.filePath = path.join(status.root, status.pool.path);
    node.needle = `id: ${entry.id}`;
    node.poolEntry = entry;
    node.command = { command: 'aide.openTreeItem', title: 'Open Pool Entry', arguments: [node] };
    return node;
  }
}

class AideLensProvider implements vscode.CodeLensProvider {
  constructor(private readonly isLane: (document: vscode.TextDocument) => boolean) {}

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (!this.isLane(document)) return [];
    const top = new vscode.Range(0, 0, 0, 0);
    const lenses = [
      new vscode.CodeLens(top, { title: '$(search) Observe', command: 'aide.observeLane', arguments: [document.uri] }),
      new vscode.CodeLens(top, { title: '$(check-all) Approve（レーン全体）', command: 'aide.approveLane', arguments: [document.uri] }),
    ];
    for (let line = 0; line < document.lineCount; line++) {
      const match = document.lineAt(line).text.match(/^(#{2,6})\s+(.+?)\s*$/);
      if (match) {
        lenses.push(new vscode.CodeLens(new vscode.Range(line, 0, line, 0), {
          title: `$(check) Approve: ${match[2]}`,
          command: 'aide.approveSection',
          arguments: [document.uri, match[2]],
        }));
      }
    }
    return lenses;
  }
}

class AideController implements vscode.Disposable {
  private readonly output = vscode.window.createOutputChannel('AIDE');
  private readonly provider = new AideTreeProvider();
  private readonly tree: vscode.TreeView<AideNode>;
  private readonly statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  private readonly subscriptions: vscode.Disposable[] = [];
  private readonly watchers = new Map<string, ChildProcess>();
  private fileWatcher: vscode.FileSystemWatcher | undefined;
  private readonly refreshDebouncer = new Debouncer(200, () => { void this.refresh(false); });
  private readonly knowledgeDebouncer = new Debouncer(300, () => { void this.syncKnowledge(); });
  private disposed = false;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.tree = vscode.window.createTreeView('aide.designView', { treeDataProvider: this.provider, showCollapseAll: true });
    this.statusItem.command = 'aide.watchToggle';
    this.subscriptions.push(this.output, this.tree, this.statusItem);
  }

  async activate(): Promise<void> {
    this.registerCommands();
    this.subscriptions.push(
      vscode.languages.registerCodeLensProvider({ language: 'markdown' }, new AideLensProvider((d) => this.isLaneDocument(d))),
      vscode.window.onDidChangeActiveTextEditor(() => this.updateStatusItem()),
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('aide.designRoot')) {
          this.setupFileWatcher();
          void this.refresh(true);
        } else if (event.affectsConfiguration('aide.nodePath')) {
          void this.diagnoseRuntime();
        }
      }),
    );
    this.setupFileWatcher();
    await this.refresh(false);
    this.updateStatusItem();
    void this.diagnoseRuntime();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.refreshDebouncer.dispose();
    this.fileWatcher?.dispose();
    for (const child of this.watchers.values()) {
      try { child.kill(); } catch { /* already stopped */ }
    }
    this.watchers.clear();
    for (const subscription of this.subscriptions) subscription.dispose();
  }

  private registerCommands(): void {
    const register = (name: string, callback: (...args: any[]) => unknown) => {
      this.subscriptions.push(vscode.commands.registerCommand(name, callback));
    };
    register('aide.initialize', () => this.guard('初期化', () => this.initialize()));
    register('aide.createLane', () => this.guard('レーン作成', () => this.createLane()));
    register('aide.refresh', () => this.refresh(true));
    register('aide.openMaster', () => this.openMaster());
    register('aide.openReport', (node?: AideNode) => this.openReport(node));
    register('aide.openLogs', () => this.output.show(true));
    register('aide.openTreeItem', (node: AideNode) => this.openNode(node));
    register('aide.observeLane', (input?: AideNode | vscode.Uri) => this.guard('Observe', () => this.observe(input)));
    register('aide.approveSection', (input?: AideNode | vscode.Uri, heading?: string) =>
      this.guard('Approve', () => this.approveSection(input, heading)));
    register('aide.approveSectionAtCursor', () => this.guard('Approve', () => this.approveAtCursor()));
    register('aide.approveLane', (input?: AideNode | vscode.Uri) => this.guard('Approve', () => this.approveLane(input)));
    register('aide.integrate', () => this.guard('Integrate', () => this.integrate()));
    register('aide.status', () => this.guard('Status', () => this.showHumanStatus()));
    register('aide.watchToggle', (input?: AideNode | vscode.Uri) => this.guard('AI対話', () => this.watchToggle(input)));
  }

  private async guard(label: string, action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.output.appendLine(`[error] ${label}: ${message}`);
      void vscode.window.showErrorMessage(`${label}: ${message}`);
    }
  }

  private workspaceRoot(): string {
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) throw new Error('AIDEを使うフォルダーをVS Codeで開いてください');
    return folder.uri.fsPath;
  }

  private designRoot(): string {
    const configured = vscode.workspace.getConfiguration('aide').get<string>('designRoot', 'design');
    return resolveDesignRoot(this.workspaceRoot(), configured);
  }

  private engineScript(tool: 'aide' | 'mdtalk'): string {
    const bundled = this.context.asAbsolutePath(path.join('engine', `${tool}.js`));
    if (fs.existsSync(bundled)) return bundled;
    const development = path.join(this.workspaceRoot(), `${tool}.js`);
    if (fs.existsSync(development)) return development;
    throw new Error(`${tool}.js が拡張に同梱されていません。拡張を再インストールしてください`);
  }

  private nodePath(): string {
    return vscode.workspace.getConfiguration('aide').get<string>('nodePath', 'node').trim() || 'node';
  }

  private async runEngine(
    tool: 'aide' | 'mdtalk',
    args: string[],
    label: string,
    options: { cancellable?: boolean; silent?: boolean } = {},
  ): Promise<ProcessResult> {
    if (!vscode.workspace.isTrusted) throw new Error('AIDEのCLI実行には信頼されたワークスペースが必要です');
    const command = this.nodePath();
    const fullArgs = [this.engineScript(tool), ...args];
    if (!options.silent) {
      this.output.appendLine(`\n$ ${command} ${fullArgs.map(quoteArg).join(' ')}`);
      this.output.show(true);
    }
    const execute = (token?: vscode.CancellationToken) => runProcess({
      command,
      args: fullArgs,
      cwd: this.workspaceRoot(),
      onStdout: options.silent ? undefined : (chunk) => this.output.append(chunk),
      onStderr: options.silent ? undefined : (chunk) => this.output.append(chunk),
      registerCancellation: token ? (cancel) => token.onCancellationRequested(cancel) : undefined,
    });
    const result = options.cancellable
      ? await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `AIDE: ${label}`,
        cancellable: true,
      }, (_progress, token) => execute(token))
      : await execute();
    if (result.cancelled) throw new Error(`${label}をキャンセルしました`);
    if (result.code !== 0) throw new Error(errorTail(result.stderr, result.code));
    return result;
  }

  async refresh(showError: boolean): Promise<void> {
    try {
      const result = await this.runEngine('aide', ['status', this.designRoot(), '--json', '--quiet'], '状態取得', { silent: true });
      const status = parseStatusJson(result.stdout);
      this.provider.setState(status, new Set(this.watchers.keys()));
      // 未初期化時はviewsWelcomeの初期化ボタンを表示するためmessageを設定しない。
      this.tree.message = undefined;
      await vscode.commands.executeCommand('setContext', 'aide.initialized', status.initialized);
      await vscode.commands.executeCommand('setContext', 'aide.hasPool', status.pool.count > 0);
    } catch (error) {
      this.provider.setState(undefined, new Set(this.watchers.keys()));
      this.tree.message = error instanceof Error ? error.message : String(error);
      await vscode.commands.executeCommand('setContext', 'aide.initialized', false);
      await vscode.commands.executeCommand('setContext', 'aide.hasPool', false);
      if (showError) throw error;
      this.output.appendLine(`[warn] 状態取得: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async syncKnowledge(): Promise<void> {
    try {
      await this.runEngine('aide', ['knowledge', this.designRoot(), '--quiet'], '共有知識の同期', { silent: true });
    } catch (error) {
      this.output.appendLine(`[warn] 共有知識の同期: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async initialize(): Promise<void> {
    await this.runEngine('aide', ['init', this.designRoot()], '設計を初期化');
    await this.refresh(false);
    await this.openMaster();
    void vscode.window.showInformationMessage('AIDEの設計ワークスペースを初期化しました');
  }

  private async createLane(): Promise<void> {
    const topic = await vscode.window.showInputBox({
      title: 'AIDE: レーンを作成',
      prompt: '設計する項目名を入力してください',
      placeHolder: '例: auth',
      validateInput: (value) => safeTopic(value) ? undefined : 'レーン名を入力してください',
    });
    if (topic === undefined) return;
    const safe = safeTopic(topic);
    await this.runEngine('aide', ['lane', safe, this.designRoot()], 'レーン作成');
    await this.refresh(false);
    await this.openFile(path.join(this.designRoot(), 'lanes', `${safe}.md`));
  }

  private async observe(input?: AideNode | vscode.Uri): Promise<void> {
    const lanePath = this.lanePathOf(input);
    await this.runEngine('aide', ['observe', lanePath], '観察中', { cancellable: true });
    await this.refresh(false);
    const lane = this.provider.getStatus()?.lanes.find((item) => normalizePath(path.join(this.designRoot(), item.path)) === normalizePath(lanePath));
    if (lane?.report) await this.openFile(path.join(this.designRoot(), lane.report.path));
  }

  private async approveSection(input?: AideNode | vscode.Uri, explicitHeading?: string): Promise<void> {
    const lanePath = this.lanePathOf(input);
    const heading = explicitHeading || (input instanceof AideNode ? input.heading : undefined);
    if (!heading) throw new Error('Approveするセクションが指定されていません');
    await this.runEngine('aide', ['accept', lanePath, '--section', heading], `Approve: ${heading}`);
    await this.refresh(false);
  }

  private async approveAtCursor(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) throw new Error('レーンファイルを開いてください');
    let heading: string | undefined;
    for (let line = editor.selection.active.line; line >= 0; line--) {
      const match = editor.document.lineAt(line).text.match(/^(#{2,6})\s+(.+?)\s*$/);
      if (match) { heading = match[2]; break; }
    }
    if (!heading) throw new Error('カーソルの上に見出し（##〜######）がありません');
    await this.approveSection(editor.document.uri, heading);
  }

  private async approveLane(input?: AideNode | vscode.Uri): Promise<void> {
    const lanePath = this.lanePathOf(input);
    await this.runEngine('aide', ['accept', lanePath], 'Approve（レーン全体）');
    await this.refresh(false);
  }

  private async integrate(): Promise<void> {
    const count = this.provider.getStatus()?.pool.count ?? 0;
    if (!count) {
      void vscode.window.showInformationMessage('Poolは空です');
      return;
    }
    const answer = await vscode.window.showWarningMessage(
      `Poolの${count}件をmasterへ統合します。`,
      { modal: true },
      '統合する',
    );
    if (answer !== '統合する') return;
    await this.runEngine('aide', ['integrate', this.designRoot()], 'masterへ統合中', { cancellable: true });
    await this.refresh(false);
    await this.openMaster();
  }

  private async showHumanStatus(): Promise<void> {
    await this.runEngine('aide', ['status', this.designRoot()], 'Status');
  }

  private async openMaster(): Promise<void> {
    const status = this.provider.getStatus();
    await this.openFile(path.join(status?.root || this.designRoot(), status?.master.path || 'master.md'));
  }

  private async openReport(node?: AideNode): Promise<void> {
    if (node?.filePath) {
      await this.openFile(node.filePath);
      return;
    }
    const lanePath = this.lanePathOf(node);
    const status = this.provider.getStatus();
    const lane = status?.lanes.find((item) => normalizePath(path.join(status.root, item.path)) === normalizePath(lanePath));
    if (!lane?.report) throw new Error('最新の観察レポートがありません');
    await this.openFile(path.join(status!.root, lane.report.path));
  }

  private async openNode(node: AideNode): Promise<void> {
    if (!node.filePath) return;
    await this.openFile(node.filePath, node.line, node.needle);
  }

  private async openFile(filePath: string, line?: number, needle?: string): Promise<void> {
    if (!fs.existsSync(filePath)) throw new Error(`ファイルがありません: ${filePath}`);
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    const editor = await vscode.window.showTextDocument(document);
    let position: vscode.Position | undefined;
    if (needle) {
      const index = document.getText().indexOf(needle);
      if (index >= 0) position = document.positionAt(index);
    } else if (line) {
      position = new vscode.Position(Math.max(0, line - 1), 0);
    }
    if (position) {
      editor.selection = new vscode.Selection(position, position);
      editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    }
  }

  private async watchToggle(input?: AideNode | vscode.Uri): Promise<void> {
    if (!vscode.workspace.isTrusted) throw new Error('AI対話には信頼されたワークスペースが必要です');
    const file = this.filePathOf(input);
    if (!file || path.extname(file).toLowerCase() !== '.md') throw new Error('Markdownファイルを開いてください');
    const key = normalizePath(file);
    const running = this.watchers.get(key);
    if (running) {
      this.watchers.delete(key);
      try { running.kill(); } catch { /* already stopped */ }
      this.output.appendLine(`[mdtalk:${path.basename(file)}] 監視を停止しました`);
      await this.refresh(false);
      this.updateStatusItem();
      return;
    }
    const child = spawn(this.nodePath(), [this.engineScript('mdtalk'), file], {
      cwd: this.workspaceRoot(),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const relay = (chunk: unknown) => {
      for (const line of String(chunk).split(/\r?\n/)) {
        if (line.trim()) this.output.appendLine(`[mdtalk:${path.basename(file)}] ${line}`);
      }
    };
    child.stdout?.on('data', relay);
    child.stderr?.on('data', relay);
    child.once('error', (error) => {
      this.watchers.delete(key);
      void vscode.window.showErrorMessage(`mdtalkの起動に失敗: ${error.message}`);
      void this.refresh(false);
      this.updateStatusItem();
    });
    child.once('close', (code) => {
      if (this.watchers.get(key) !== child) return;
      this.watchers.delete(key);
      if (code !== 0 && code !== null) void vscode.window.showErrorMessage(`mdtalkが終了しました (exit ${code})`);
      void this.refresh(false);
      this.updateStatusItem();
    });
    this.watchers.set(key, child);
    this.output.show(true);
    this.output.appendLine(`[mdtalk:${path.basename(file)}] 監視を開始しました`);
    await this.refresh(false);
    this.updateStatusItem();
  }

  private lanePathOf(input?: AideNode | vscode.Uri): string {
    const file = input instanceof AideNode ? input.lanePath || input.filePath : this.filePathOf(input);
    if (!file || !this.isLanePath(file)) throw new Error('AIDEのレーンファイルを選択してください');
    return file;
  }

  private filePathOf(input?: AideNode | vscode.Uri): string | undefined {
    if (input instanceof AideNode) return input.lanePath || input.filePath;
    if (input && 'fsPath' in input && typeof input.fsPath === 'string') return input.fsPath;
    return vscode.window.activeTextEditor?.document.uri.fsPath;
  }

  private isLanePath(file: string): boolean {
    try {
      const laneRoot = path.join(this.designRoot(), 'lanes');
      const relative = path.relative(laneRoot, file);
      return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative) && path.extname(file).toLowerCase() === '.md';
    } catch {
      return false;
    }
  }

  private isLaneDocument(document: vscode.TextDocument): boolean {
    return document.languageId === 'markdown' && this.isLanePath(document.uri.fsPath);
  }

  private updateStatusItem(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
      this.statusItem.hide();
      return;
    }
    const file = editor.document.uri.fsPath;
    const running = this.watchers.has(normalizePath(file));
    this.statusItem.text = running ? '$(stop-circle) AI対話 停止' : '$(play-circle) AI対話 開始';
    this.statusItem.tooltip = running
      ? `mdtalk監視中: ${path.basename(file)}（クリックで停止）`
      : `${path.basename(file)}のmdtalk監視を開始`;
    this.statusItem.show();
  }

  private setupFileWatcher(): void {
    this.fileWatcher?.dispose();
    this.fileWatcher = undefined;
    const folder = vscode.workspace.workspaceFolders?.[0];
    if (!folder) return;
    try {
      const relative = path.relative(folder.uri.fsPath, this.designRoot()).split(path.sep).join('/');
      this.fileWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(folder, `${relative}/**/*.md`));
      const schedule = (uri: vscode.Uri) => {
        this.refreshDebouncer.schedule();
        if (path.basename(uri.fsPath) !== '_knowledge.md') this.knowledgeDebouncer.schedule();
      };
      this.fileWatcher.onDidCreate(schedule);
      this.fileWatcher.onDidChange(schedule);
      this.fileWatcher.onDidDelete(schedule);
      this.subscriptions.push(this.fileWatcher);
    } catch (error) {
      this.output.appendLine(`[warn] ファイル監視: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async diagnoseRuntime(): Promise<void> {
    try {
      const result = await runProcess({ command: this.nodePath(), args: ['--version'], cwd: this.workspaceRoot() });
      if (result.code !== 0) throw new Error(errorTail(result.stderr, result.code));
      const version = result.stdout.trim();
      const major = Number(version.replace(/^v/, '').split('.')[0]);
      if (!Number.isFinite(major) || major < 20) throw new Error(`Node.js 20以上が必要です（検出: ${version || '不明'}）`);
      this.output.appendLine(`[diagnostic] Node.js ${version}: OK`);
      for (const command of ['codex', 'claude']) {
        this.output.appendLine(`[diagnostic] ${command}: ${findOnPath(command) ? '検出' : '未検出（利用するAI操作の前にインストールしてください）'}`);
      }
    } catch (error) {
      const message = `Node.jsを起動できません: ${error instanceof Error ? error.message : String(error)}`;
      this.output.appendLine(`[error] ${message}`);
      void vscode.window.showErrorMessage(message, '設定を開く').then((answer) => {
        if (answer) void vscode.commands.executeCommand('workbench.action.openSettings', 'aide.nodePath');
      });
    }
  }
}

function normalizePath(value: string): string {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function quoteArg(value: string): string {
  return /\s/.test(value) ? JSON.stringify(value) : value;
}

function findOnPath(command: string): string | undefined {
  const pathValue = process.env.PATH || '';
  const extensions = process.platform === 'win32'
    ? (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';') : [''];
  for (const directory of pathValue.split(path.delimiter)) {
    if (!directory) continue;
    for (const extension of extensions) {
      const candidate = path.join(directory, process.platform === 'win32' ? command + extension.toLowerCase() : command);
      if (fs.existsSync(candidate)) return candidate;
      if (process.platform === 'win32') {
        const upper = path.join(directory, command + extension.toUpperCase());
        if (fs.existsSync(upper)) return upper;
      }
    }
  }
  return undefined;
}

let controller: AideController | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  controller = new AideController(context);
  context.subscriptions.push(controller);
  await controller.activate();
}

export function deactivate(): void {
  controller?.dispose();
  controller = undefined;
}
