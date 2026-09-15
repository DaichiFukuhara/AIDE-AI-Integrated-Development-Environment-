import * as path from 'node:path';
import { AideStatus, AideLane, LaneVisual } from './types';

export function resolveDesignRoot(workspaceRoot: string, configured: string): string {
  const value = configured.trim() || 'design';
  if (path.isAbsolute(value)) {
    throw new Error('aide.designRoot はワークスペースからの相対パスで指定してください');
  }
  const resolved = path.resolve(workspaceRoot, value);
  const relative = path.relative(workspaceRoot, resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error('aide.designRoot はワークスペース内を指定してください');
  }
  return resolved;
}

export function parseStatusJson(output: string): AideStatus {
  let value: unknown;
  try {
    value = JSON.parse(output.trim());
  } catch (error) {
    throw new Error(`AIDE statusのJSONを解釈できません: ${(error as Error).message}`);
  }
  if (!value || typeof value !== 'object') throw new Error('AIDE statusがオブジェクトではありません');
  const status = value as Partial<AideStatus>;
  if (status.schemaVersion !== 1) throw new Error(`未対応のAIDE status schema: ${String(status.schemaVersion)}`);
  if (typeof status.initialized !== 'boolean' || typeof status.root !== 'string') {
    throw new Error('AIDE statusに必須フィールドがありません');
  }
  if (!status.master || !Array.isArray(status.lanes) || !status.pool || !status.archive) {
    throw new Error('AIDE statusの構造が不正です');
  }
  return status as AideStatus;
}

export function laneVisual(lane: AideLane, watching: boolean): LaneVisual {
  const level = lane.observeLevel || 'strict';
  if (watching) return { kind: 'watching', description: 'AI対話中', icon: 'sync~spin' };
  if (lane.stale) return { kind: 'stale', description: `観察後に編集あり · ${level}`, icon: 'warning' };
  if (!lane.report) return { kind: 'unobserved', description: `未観察 · ${level}`, icon: 'circle-outline' };
  const reportLevel = lane.report.observeLevel || 'strict';
  if (lane.report.verdict === 'pass') return { kind: 'pass', description: `pass · ${reportLevel}`, icon: 'pass-filled' };
  return { kind: 'fail', description: `${lane.report.verdict || 'fail'} · ${reportLevel}`, icon: 'error' };
}

export function safeTopic(value: string): string {
  return value.trim().replace(/[\\/:*?"<>|\s]+/g, '-');
}

export function errorTail(stderr: string, code: number | null): string {
  return stderr.trim().split(/\r?\n/).filter(Boolean).pop() || `exit ${code ?? 'unknown'}`;
}

export class Debouncer {
  private timer: NodeJS.Timeout | undefined;

  constructor(private readonly delayMs: number, private readonly callback: () => void) {}

  schedule(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.callback();
    }, this.delayMs);
  }

  dispose(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
