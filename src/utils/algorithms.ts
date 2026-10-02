import { Coordinate, StepSnapshot, AlgorithmType } from '../types';

export const coordKey = (r: number, c: number): string => `${r},${c}`;
export const keyToCoord = (key: string): Coordinate => {
  const [r, c] = key.split(',').map(Number);
  return [r, c];
};

export const areCoordsEqual = (a: Coordinate | null, b: Coordinate | null): boolean => {
  if (!a || !b) return false;
  return a[0] === b[0] && a[1] === b[1];
};

// Direcciones ordenadas para BFS: Arriba, Derecha, Abajo, Izquierda
export const BFS_DIRECTIONS: { dr: number; dc: number; name: string }[] = [
  { dr: -1, dc: 0, name: 'arriba' },
  { dr: 0, dc: 1, name: 'la derecha' },
  { dr: 1, dc: 0, name: 'abajo' },
  { dr: 0, dc: -1, name: 'la izquierda' }
];

// Variantes de exploración para DFS: permiten encontrar rutas diferentes en el MISMO laberinto
// según el orden de prioridad con el que se apilan las ramas.
export interface DfsPreset {
  id: number;
  name: string;
  label: string;
  directions: { dr: number; dc: number; name: string }[];
}

export const DFS_PRESETS: DfsPreset[] = [
  {
    id: 0,
    name: 'derecha-abajo',
    label: 'Ruta A (Prioridad: Derecha primero)',
    // Apilado: abajo, izquierda, arriba, derecha -> El tope es derecha
    directions: [
      { dr: 1, dc: 0, name: 'abajo' },
      { dr: 0, dc: -1, name: 'la izquierda' },
      { dr: -1, dc: 0, name: 'arriba' },
      { dr: 0, dc: 1, name: 'la derecha' }
    ]
  },
  {
    id: 1,
    name: 'abajo-derecha',
    label: 'Ruta B (Prioridad: Abajo primero)',
    // Apilado: derecha, arriba, izquierda, abajo -> El tope es abajo
    directions: [
      { dr: 0, dc: 1, name: 'la derecha' },
      { dr: -1, dc: 0, name: 'arriba' },
      { dr: 0, dc: -1, name: 'la izquierda' },
      { dr: 1, dc: 0, name: 'abajo' }
    ]
  },
  {
    id: 2,
    name: 'arriba-derecha',
    label: 'Ruta C (Prioridad: Arriba primero)',
    // Apilado: abajo, izquierda, derecha, arriba -> El tope es arriba
    directions: [
      { dr: 1, dc: 0, name: 'abajo' },
      { dr: 0, dc: -1, name: 'la izquierda' },
      { dr: 0, dc: 1, name: 'la derecha' },
      { dr: -1, dc: 0, name: 'arriba' }
    ]
  },
  {
    id: 3,
    name: 'izquierda-abajo',
    label: 'Ruta D (Prioridad: Izquierda primero)',
    // Apilado: derecha, arriba, abajo, izquierda -> El tope es izquierda
    directions: [
      { dr: 0, dc: 1, name: 'la derecha' },
      { dr: -1, dc: 0, name: 'arriba' },
      { dr: 1, dc: 0, name: 'abajo' },
      { dr: 0, dc: -1, name: 'la izquierda' }
    ]
  }
];

export const getNeighbors = (
  r: number,
  c: number,
  rows: number,
  cols: number,
  walls: Set<string>,
  directions: { dr: number; dc: number; name: string }[]
): { coord: Coordinate; dirName: string }[] => {
  const neighbors: { coord: Coordinate; dirName: string }[] = [];
  for (const { dr, dc, name } of directions) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      if (!walls.has(coordKey(nr, nc))) {
        neighbors.push({ coord: [nr, nc], dirName: name });
      }
    }
  }
  return neighbors;
};

export const reconstructPath = (
  parents: Record<string, Coordinate | null>,
  goal: Coordinate
): Coordinate[] => {
  const path: Coordinate[] = [];
  let curr: Coordinate | null = goal;
  while (curr) {
    path.push(curr);
    const key = coordKey(curr[0], curr[1]);
    curr = parents[key] ?? null;
  }
  return path.reverse();
};

export const generateAlgorithmSteps = (
  algorithm: AlgorithmType,
  rows: number,
  cols: number,
  start: Coordinate,
  goal: Coordinate,
  walls: Set<string>,
  dfsStrategyIndex: number = 0
): StepSnapshot[] => {
  const steps: StepSnapshot[] = [];
  const startKey = coordKey(start[0], start[1]);

  const frontier: Coordinate[] = [start];
  const visitedList: Coordinate[] = [start];
  const visitedSet = new Set<string>([startKey]);
  const parents: Record<string, Coordinate | null> = { [startKey]: null };

  const isBFS = algorithm === 'BFS';
  const activePreset = DFS_PRESETS[Math.abs(dfsStrategyIndex) % DFS_PRESETS.length];
  const directions = isBFS ? BFS_DIRECTIONS : activePreset.directions;

  // Paso inicial
  steps.push({
    stepIndex: steps.length,
    current: null,
    visited: [...visitedList],
    visitedSet: new Set(visitedSet),
    frontier: [...frontier],
    parents: { ...parents },
    finalPath: [],
    status: 'running',
    codeLine: isBFS ? 3 : 2,
    explanation: isBFS
      ? `Inicializando BFS: Se inserta el nodo inicio (${start[0]}, ${start[1]}) en la cola FIFO.`
      : `Inicializando DFS (${activePreset.label}): Se inserta el nodo inicio (${start[0]}, ${start[1]}) en la pila LIFO.`,
    simpleExplanation: isBFS
      ? `Comenzamos en la casilla dorada (${start[0]}, ${start[1]}). La colocamos al frente de la fila para iniciar la busqueda.`
      : `Comenzamos en la casilla dorada (${start[0]}, ${start[1]}). Iniciando exploracion con ${activePreset.label}.`,
    action: 'init'
  });

  let goalFound = false;

  while (frontier.length > 0) {
    // Evaluación del ciclo while
    steps.push({
      stepIndex: steps.length,
      current: null,
      visited: [...visitedList],
      visitedSet: new Set(visitedSet),
      frontier: [...frontier],
      parents: { ...parents },
      finalPath: [],
      status: 'running',
      codeLine: isBFS ? 6 : 5,
      explanation: isBFS
        ? `Evaluando condicion: Hay ${frontier.length} elementos en la cola FIFO. Continuando busqueda.`
        : `Evaluando condicion: Hay ${frontier.length} elementos en la pila LIFO. Continuando busqueda.`,
      simpleExplanation: isBFS
        ? `Revisamos si quedan casillas esperando en la fila. Quedan ${frontier.length} casillas por explorar.`
        : `Revisamos si quedan casillas pendientes en la torre. Quedan ${frontier.length} casillas por explorar.`,
      action: 'inspect'
    });

    // Extracción según estructura: BFS extrae del frente (shift), DFS extrae del tope (pop)
    const current = isBFS ? frontier.shift()! : frontier.pop()!;

    steps.push({
      stepIndex: steps.length,
      current,
      visited: [...visitedList],
      visitedSet: new Set(visitedSet),
      frontier: [...frontier],
      parents: { ...parents },
      finalPath: [],
      status: 'running',
      codeLine: isBFS ? 7 : 6,
      explanation: isBFS
        ? `Desencolando: actual = cola.popleft() -> Se procesa el nodo (${current[0]}, ${current[1]}).`
        : `Desapilando: actual = pila.pop() -> Se procesa el nodo (${current[0]}, ${current[1]}).`,
      simpleExplanation: isBFS
        ? `Tomamos la primera casilla de la fila (${current[0]}, ${current[1]}) para explorar a su alrededor.`
        : `Tomamos la casilla del tope de la torre (${current[0]}, ${current[1]}) para profundizar por ese camino.`,
      action: 'pop'
    });

    // Verificación de meta
    const reached = areCoordsEqual(current, goal);
    steps.push({
      stepIndex: steps.length,
      current,
      visited: [...visitedList],
      visitedSet: new Set(visitedSet),
      frontier: [...frontier],
      parents: { ...parents },
      finalPath: [],
      status: 'running',
      codeLine: isBFS ? 8 : 7,
      explanation: reached
        ? `Meta alcanzada: El nodo (${current[0]}, ${current[1]}) coincide con el objetivo final.`
        : `Verificando objetivo: (${current[0]}, ${current[1]}) no es la meta. Explorando vecinos disponibles.`,
      simpleExplanation: reached
        ? `La casilla actual coincide con la meta roja. Procedemos a reconstruir la ruta encontrada.`
        : `Comprobamos si esta casilla es la meta. Como no lo es, revisamos sus casillas contiguas.`,
      action: reached ? 'goal' : 'inspect'
    });

    if (reached) {
      goalFound = true;
      const finalPath = reconstructPath(parents, goal);
      steps.push({
        stepIndex: steps.length,
        current,
        visited: [...visitedList],
        visitedSet: new Set(visitedSet),
        frontier: [...frontier],
        parents: { ...parents },
        finalPath,
        status: 'found',
        codeLine: isBFS ? 9 : 8,
        explanation: isBFS
          ? `Ruta BFS completada: Camino optimo de ${finalPath.length} casillas reconstruido mediante punteros de padres.`
          : `Ruta DFS completada (${activePreset.label}): Camino de ${finalPath.length} casillas encontrado mediante descenso a profundidad.`,
        simpleExplanation: isBFS
          ? `Ruta encontrada con exito. BFS garantiza que este camino de ${finalPath.length} pasos es el mas corto posible.`
          : `Ruta encontrada con exito. DFS hallo este camino de ${finalPath.length} pasos siguiendo la estrategia ${activePreset.label}.`,
        action: 'goal'
      });
      break;
    }

    // Obtener vecinos según el orden del algoritmo
    const neighborsWithDir = getNeighbors(current[0], current[1], rows, cols, walls, directions);

    steps.push({
      stepIndex: steps.length,
      current,
      visited: [...visitedList],
      visitedSet: new Set(visitedSet),
      frontier: [...frontier],
      parents: { ...parents },
      finalPath: [],
      status: 'running',
      codeLine: isBFS ? 10 : 9,
      explanation: `Obteniendo vecinos de (${current[0]}, ${current[1]}): ${neighborsWithDir.length} casillas libres de muros encontradas.`,
      simpleExplanation: `Miramos alrededor de (${current[0]}, ${current[1]}): hay ${neighborsWithDir.length} casillas transitables sin pared.`,
      action: 'inspect'
    });

    for (const { coord: neighbor, dirName } of neighborsWithDir) {
      const neighborKey = coordKey(neighbor[0], neighbor[1]);

      if (!visitedSet.has(neighborKey)) {
        visitedSet.add(neighborKey);
        visitedList.push(neighbor);
        parents[neighborKey] = current;
        frontier.push(neighbor);

        steps.push({
          stepIndex: steps.length,
          current,
          visited: [...visitedList],
          visitedSet: new Set(visitedSet),
          frontier: [...frontier],
          parents: { ...parents },
          finalPath: [],
          status: 'running',
          codeLine: isBFS ? 14 : 13,
          explanation: isBFS
            ? `Vecino (${neighbor[0]}, ${neighbor[1]}) no visitado -> Se marca visitado y se encola al final (FIFO).`
            : `Vecino (${neighbor[0]}, ${neighbor[1]}) no visitado -> Se marca visitado y se apila en el tope (LIFO).`,
          simpleExplanation: isBFS
            ? `Revisamos la casilla hacia ${dirName} (${neighbor[0]}, ${neighbor[1]}). Al estar libre, se agrega al final de la fila.`
            : `Revisamos la casilla hacia ${dirName} (${neighbor[0]}, ${neighbor[1]}). Al estar libre, se coloca en el tope de la torre para profundizar en ella.`,
          action: 'push'
        });
      }
    }
  }

  if (!goalFound) {
    steps.push({
      stepIndex: steps.length,
      current: null,
      visited: [...visitedList],
      visitedSet: new Set(visitedSet),
      frontier: [],
      parents: { ...parents },
      finalPath: [],
      status: 'not_found',
      codeLine: isBFS ? 15 : 14,
      explanation: `No existe ningun camino transitable entre el punto de inicio y la meta.`,
      simpleExplanation: `Se han revisado todas las casillas accesibles y ninguna pared permite llegar a la meta.`,
      action: 'exhausted'
    });
  }

  return steps;
};

// Generador de laberinto que asegura multiples corredores independientes
// para que DFS pueda tomar caminos claramente diferentes en el MISMO mapa al cambiar su prioridad
export const generateGuaranteedMaze = (
  rows: number,
  cols: number,
  start: Coordinate,
  goal: Coordinate,
  obstacleDensity: number = 0.26
): Set<string> => {
  const walls = new Set<string>();

  const buildCorridor = (waypoints: Coordinate[]): Coordinate[] => {
    const corridor: Coordinate[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      let [cr, cc] = waypoints[i];
      const [tr, tc] = waypoints[i + 1];

      while (cc !== tc) {
        corridor.push([cr, cc]);
        cc += cc < tc ? 1 : -1;
      }
      while (cr !== tr) {
        corridor.push([cr, cc]);
        cr += cr < tr ? 1 : -1;
      }
    }
    corridor.push(waypoints[waypoints.length - 1]);
    return corridor;
  };

  const protectedCells = new Set<string>();

  // Corredor Superior / Derecho: Start -> (0, cols-1) -> Goal
  const upperRightCorner: Coordinate = [0, cols - 1];
  const corridorUpper = buildCorridor([start, upperRightCorner, goal]);
  corridorUpper.forEach(([r, c]) => protectedCells.add(coordKey(r, c)));

  // Corredor Inferior / Izquierdo: Start -> (rows-1, 0) -> Goal
  const lowerLeftCorner: Coordinate = [rows - 1, 0];
  const corridorLower = buildCorridor([start, lowerLeftCorner, goal]);
  corridorLower.forEach(([r, c]) => protectedCells.add(coordKey(r, c)));

  // Corredor Central Directo (si la cuadrícula es de al menos 4x4)
  if (rows >= 4 && cols >= 4) {
    const midR = Math.floor((start[0] + goal[0]) / 2);
    const midC = Math.floor((start[1] + goal[1]) / 2);
    const corridorCenter = buildCorridor([start, [midR, midC], goal]);
    corridorCenter.forEach(([r, c]) => protectedCells.add(coordKey(r, c)));
  }

  // Asegurar celdas de inicio y meta
  protectedCells.add(coordKey(start[0], start[1]));
  protectedCells.add(coordKey(goal[0], goal[1]));

  // Llenar obstáculos aleatorios en las celdas restantes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = coordKey(r, c);
      if (!protectedCells.has(key)) {
        if (Math.random() < obstacleDensity) {
          walls.add(key);
        }
      }
    }
  }

  // Verificación estricta: asegurar que siempre exista camino
  const hasPath = (): boolean => {
    const queue: Coordinate[] = [start];
    const visited = new Set<string>([coordKey(start[0], start[1])]);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (areCoordsEqual(curr, goal)) return true;

      const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
      for (const [dr, dc] of directions) {
        const nr = curr[0] + dr;
        const nc = curr[1] + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const nKey = coordKey(nr, nc);
          if (!walls.has(nKey) && !visited.has(nKey)) {
            visited.add(nKey);
            queue.push([nr, nc]);
          }
        }
      }
    }
    return false;
  };

  if (!hasPath()) {
    for (const key of protectedCells) {
      walls.delete(key);
    }
  }

  return walls;
};
