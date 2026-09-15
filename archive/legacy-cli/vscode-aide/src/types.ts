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

export type LaneProposalStatus = 'pending' | 'deferred' | 'created' | 'continued' | 'rejected';

export interface AideLaneProposal {
  id: string;
  topic: string;
  title: string;
  status: LaneProposalStatus;
  reason: string;
  goal: string;
  scope: string;
  dependencies: string[];
  createdAt: string;
  decidedAt: string;
  childLane: string;
  line: number;
}

export interface AideLane {
  topic: string;
  path: string;
  observeLevel: ObserveLevel;
  observeLevelSource: ObserveLevelSource;
  headings: AideHeading[];
  report: AideReport | null;
  stale: boolean;
  proposals: AideLaneProposal[];
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
