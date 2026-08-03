export interface AideHeading {
  level: number;
  title: string;
  line: number;
}

export interface AideReport {
  path: string;
  verdict: string | null;
  date: string | null;
  observeLevel: ObserveLevel;
}

export type ObserveLevel = 'light' | 'strict';
export type ObserveLevelSource = 'declared' | 'default';

export interface AideLane {
  topic: string;
  path: string;
  observeLevel: ObserveLevel;
  observeLevelSource: ObserveLevelSource;
  headings: AideHeading[];
  report: AideReport | null;
  stale: boolean;
}

export interface AidePoolEntry {
  id: string;
  lane: string;
  section: string;
  accepted: string;
  report: string;
  observeLevel: ObserveLevel;
}

export interface AideStatus {
  schemaVersion: 1;
  initialized: boolean;
  root: string;
  master: { path: string; exists: boolean; bytes: number };
  lanes: AideLane[];
  pool: { path: string; count: number; entries: AidePoolEntry[] };
  archive: { path: string; count: number; integrated: number; bounced: number };
}

export type LaneVisualKind = 'watching' | 'stale' | 'pass' | 'fail' | 'unobserved';

export interface LaneVisual {
  kind: LaneVisualKind;
  description: string;
  icon: string;
}
