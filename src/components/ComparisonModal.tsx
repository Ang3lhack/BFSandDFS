import React, { useMemo, useState } from 'react';
import { Coordinate } from '../types';
import { generateAlgorithmSteps, coordKey, areCoordsEqual, DFS_PRESETS } from '../utils/algorithms';
import { X, CheckCircle2, XCircle, GitCompare, Waves, Compass, GitBranch } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: number;
  cols: number;
  start: Coordinate;
  goal: Coordinate;
  walls: Set<string>;
  initialDfsStrategyIndex?: number;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  rows,
  cols,
  start,
  goal,
  walls,
  initialDfsStrategyIndex = 0
}) => {
  const [modalDfsStrategy, setModalDfsStrategy] = useState(initialDfsStrategyIndex);

  const { bfsPath, dfsPath, bfsVisited, dfsVisited } = useMemo(() => {
    if (!isOpen) {
      return {
        bfsPath: [],
        dfsPath: [],
        bfsVisited: new Set<string>(),
        dfsVisited: new Set<string>()
      };
    }

    const bSteps = generateAlgorithmSteps('BFS', rows, cols, start, goal, walls, 0);
    const dSteps = generateAlgorithmSteps('DFS', rows, cols, start, goal, walls, modalDfsStrategy);

    const lastBfs = bSteps[bSteps.length - 1];
    const lastDfs = dSteps[dSteps.length - 1];

    return {
      bfsPath: lastBfs?.finalPath || [],
      dfsPath: lastDfs?.finalPath || [],
      bfsVisited: lastBfs?.visitedSet || new Set<string>(),
      dfsVisited: lastDfs?.visitedSet || new Set<string>()
    };
  }, [isOpen, rows, cols, start, goal, walls, modalDfsStrategy]);

  if (!isOpen) return null;

  const bfsFound = bfsPath.length > 0;
  const dfsFound = dfsPath.length > 0;
  const pathDiff = dfsPath.length - bfsPath.length;
  const activeDfsPreset = DFS_PRESETS[Math.abs(modalDfsStrategy) % DFS_PRESETS.length];

  const handleNextDfsStrategy = () => {
    setModalDfsStrategy((prev) => (prev + 1) % DFS_PRESETS.length);
  };

  const renderMiniGrid = (
    title: string,
    algorithm: 'BFS' | 'DFS',
    path: Coordinate[],
    visited: Set<string>
  ) => {
    const pathSet = new Set(path.map(([r, c]) => coordKey(r, c)));

    return (
      <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex-1 min-w-[280px]">
        <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {algorithm === 'BFS' ? (
              <Waves className="w-5 h-5 text-sky-600" />
            ) : (
              <Compass className="w-5 h-5 text-orange-600" />
            )}
            <h3 className="text-sm font-black text-slate-800 font-sans">{title}</h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
            {algorithm === 'BFS' ? 'Cola FIFO' : 'Pila LIFO'}
          </span>
        </div>

        <div
          className="grid gap-[2px] w-full max-w-[220px] aspect-square p-2 bg-amber-100/60 rounded-xl border-2 border-amber-200 shadow-inner"
          style={{
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const key = coordKey(r, c);
              const isStart = areCoordsEqual([r, c], start);
              const isGoal = areCoordsEqual([r, c], goal);
              const isWall = walls.has(key);
              const isPath = pathSet.has(key);
              const isExplored = visited.has(key);

              let bg = 'bg-white border-slate-200';
              if (isStart) bg = 'bg-amber-400 border-amber-500 shadow-sm';
              else if (isGoal) bg = 'bg-rose-500 border-rose-600 shadow-sm';
              else if (isPath) bg = 'bg-emerald-500 border-emerald-600 shadow-sm animate-scale-in';
              else if (isExplored) bg = 'bg-sky-200 border-sky-300';
              else if (isWall) bg = 'bg-slate-300 border-slate-400';

              return (
                <div
                  key={key}
                  className={`rounded border ${bg} transition-colors`}
                  title={`(${r}, ${c})`}
                />
              );
            })
          )}
        </div>

        {/* Stats */}
        <div className="w-full mt-4 space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-200">
            <span className="text-slate-600 font-medium">Longitud del Camino:</span>
            <strong className={`font-mono text-sm ${algorithm === 'BFS' ? 'text-emerald-700' : 'text-orange-700'}`}>
              {path.length > 0 ? `${path.length} casillas` : 'Sin camino'}
            </strong>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-200">
            <span className="text-slate-600 font-medium">Casillas exploradas:</span>
            <strong className="font-mono text-slate-800">{visited.size}</strong>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-600 font-medium">Camino mas corto:</span>
            {algorithm === 'BFS' ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Si (Garantizado)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-600 font-black">
                <XCircle className="w-4 h-4 text-rose-600" /> No siempre
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 border-2 border-sky-200 text-sky-700">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 font-sans">
                Diferencia Fundamental: BFS vs DFS
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Comparacion directa ejecutada sobre la misma configuracion de laberinto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector de Ruta DFS dentro del comparador */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-orange-50/70 rounded-2xl border border-orange-200">
          <div className="text-xs text-orange-950 font-medium">
            <strong>Variante DFS en este laberinto:</strong> {activeDfsPreset.label}
          </div>
          <button
            onClick={handleNextDfsStrategy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-950 bg-white hover:bg-orange-100 border border-orange-300 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <GitBranch className="w-3.5 h-3.5 text-orange-700" />
            <span>Ver otra ruta DFS en este laberinto</span>
          </button>
        </div>

        {/* Side-by-Side Mini Grids */}
        <div className="flex flex-col md:flex-row gap-4">
          {renderMiniGrid('Busqueda en Amplitud (BFS)', 'BFS', bfsPath, bfsVisited)}
          {renderMiniGrid(`Busqueda en Profundidad (DFS - ${activeDfsPreset.name})`, 'DFS', dfsPath, dfsVisited)}
        </div>

        {/* Comparison Analogies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-2">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-sky-700" />
              <h4 className="text-sm font-black text-sky-900 font-sans">
                BFS busca como una onda de agua
              </h4>
            </div>
            <p className="text-xs text-sky-950 leading-relaxed font-sans">
              BFS se expande de forma radial en todas las direcciones nivel por nivel, como una onda de agua.
              Al evaluar primero todos los nodos a distancia 1, luego a distancia 2 y asi sucesivamente,{' '}
              <strong>siempre tiene garantizado encontrar el camino mas corto</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 space-y-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-700" />
              <h4 className="text-sm font-black text-orange-900 font-sans">
                DFS busca yendo lo mas profundo posible
              </h4>
            </div>
            <p className="text-xs text-orange-950 leading-relaxed font-sans">
              DFS avanza a lo largo de un unico camino hasta el fondo antes de retroceder.
              Encuentra una ruta valida,{' '}
              <strong>pero no necesariamente la mas corta</strong>. Al cambiar la prioridad de giro, puedes ver como toma otras ramas en este mismo laberinto.
            </p>
          </div>
        </div>

        {/* Result summary banner */}
        {bfsFound && dfsFound && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-xs font-semibold text-emerald-950 flex items-center gap-3">
            <div>
              {pathDiff === 0 ? (
                <span>
                  En esta variante particular ambos caminos alcanzaron la meta en {bfsPath.length} casillas. Prueba el boton de arriba para ver otra ruta DFS en este laberinto.
                </span>
              ) : (
                <span>
                  <strong>Resultado de la comparacion:</strong> BFS encontro el camino optimo en{' '}
                  <strong className="underline text-emerald-800">{bfsPath.length} casillas</strong>, mientras que DFS tomo una ruta de{' '}
                  <strong className="underline text-orange-800">{dfsPath.length} casillas</strong> ({pathDiff} casillas de diferencia).
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs shadow-md transition-all active:scale-95"
          >
            Volver al simulador
          </button>
        </div>
      </div>
    </div>
  );
};
