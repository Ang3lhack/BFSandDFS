export type Coordinate = [number, number];

export type AlgorithmType = 'BFS' | 'DFS';

export type ToolMode = 'wall' | 'start' | 'goal' | 'erase';

export interface StepSnapshot {
  stepIndex: number;
  current: Coordinate | null;
  visited: Coordinate[];
  visitedSet: Set<string>;
  frontier: Coordinate[]; // Stack (DFS) or Queue (BFS)
  parents: Record<string, Coordinate | null>;
  finalPath: Coordinate[];
  status: 'idle' | 'running' | 'found' | 'not_found' | 'backtracking';
  codeLine: number; // 1-indexed Python code line
  explanation: string;
  simpleExplanation: string; // Explicación sencilla para niños / principiantes
  action: 'init' | 'pop' | 'inspect' | 'push' | 'goal' | 'backtrack' | 'exhausted';
}

export interface AlgorithmStats {
  visitedCount: number;
  pathLength: number;
  maxStructureSize: number;
  isOptimal: boolean;
  totalSteps: number;
}

export interface GridConfig {
  rows: number;
  cols: number;
  start: Coordinate;
  goal: Coordinate;
  walls: Set<string>;
}
