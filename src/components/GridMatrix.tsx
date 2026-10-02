import React, { useRef } from 'react';
import { Coordinate, ToolMode } from '../types';
import { coordKey, areCoordsEqual } from '../utils/algorithms';
import { Star, Flag, BrickWall } from 'lucide-react';

interface GridMatrixProps {
  rows: number;
  cols: number;
  start: Coordinate;
  goal: Coordinate;
  walls: Set<string>;
  visitedSet: Set<string>;
  finalPath: Coordinate[];
  currentCell: Coordinate | null;
  toolMode: ToolMode;
  onCellClick: (coord: Coordinate) => void;
  onToggleWall: (coord: Coordinate, forceState?: boolean) => void;
  isRunning: boolean;
}

export const GridMatrix: React.FC<GridMatrixProps> = ({
  rows,
  cols,
  start,
  goal,
  walls,
  visitedSet,
  finalPath,
  currentCell,
  toolMode,
  onCellClick,
  onToggleWall,
  isRunning
}) => {
  const isMouseDownRef = useRef(false);
  const dragWallStateRef = useRef<boolean>(true);

  const pathIndexMap = new Map(finalPath.map(([r, c], idx) => [coordKey(r, c), idx + 1]));
  const isSmallGrid = rows <= 5;

  const handleMouseDown = (r: number, c: number) => {
    if (isRunning) return;
    isMouseDownRef.current = true;

    if (toolMode === 'start' || toolMode === 'goal') {
      onCellClick([r, c]);
    } else if (toolMode === 'wall') {
      const key = coordKey(r, c);
      const isStart = areCoordsEqual([r, c], start);
      const isGoal = areCoordsEqual([r, c], goal);
      if (!isStart && !isGoal) {
        const nextState = !walls.has(key);
        dragWallStateRef.current = nextState;
        onToggleWall([r, c], nextState);
      }
    } else if (toolMode === 'erase') {
      onToggleWall([r, c], false);
    }
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isRunning || !isMouseDownRef.current) return;

    const isStart = areCoordsEqual([r, c], start);
    const isGoal = areCoordsEqual([r, c], goal);
    if (isStart || isGoal) return;

    if (toolMode === 'wall') {
      onToggleWall([r, c], dragWallStateRef.current);
    } else if (toolMode === 'erase') {
      onToggleWall([r, c], false);
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const getCellClasses = (r: number, c: number) => {
    const key = coordKey(r, c);
    const isStart = areCoordsEqual([r, c], start);
    const isGoal = areCoordsEqual([r, c], goal);
    const isCurrent = areCoordsEqual([r, c], currentCell);
    const isWall = walls.has(key);
    const isPath = pathIndexMap.has(key);
    const isVisited = visitedSet.has(key);

    if (isStart) {
      return 'bg-amber-400 text-amber-950 font-black border-amber-500 shadow-md ring-4 ring-amber-300/80 z-20 scale-105';
    }
    if (isGoal) {
      return 'bg-rose-500 text-white font-black border-rose-600 shadow-md ring-4 ring-rose-300/80 z-20 scale-105 animate-bounce-soft';
    }
    if (isCurrent) {
      return 'bg-amber-300 text-slate-900 font-bold border-amber-500 ring-4 ring-amber-400 shadow-lg z-30 scale-110 transition-transform';
    }
    if (isPath) {
      return 'bg-emerald-500 text-white font-black border-emerald-600 shadow-md ring-2 ring-emerald-300 z-10 animate-scale-in';
    }
    if (isVisited) {
      return 'bg-sky-200 text-sky-900 border-sky-300 hover:bg-sky-300 transition-colors duration-150';
    }
    if (isWall) {
      return 'bg-slate-300 border-slate-400 shadow-inner text-slate-500';
    }

    return 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition-colors';
  };

  return (
    <div
      id="tour-grid"
      className="flex flex-col items-center justify-center p-2 select-none w-full"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3 text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm w-full">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 shadow-sm inline-block" />
          <span>Inicio (Dorado)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600 shadow-sm inline-block" />
          <span>Meta (Rojo)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-300 border border-slate-400 inline-block" />
          <span>Muro (Gris)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-sky-200 border border-sky-300 inline-block" />
          <span>Explorado (Azul cielo)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 shadow-sm inline-block" />
          <span>Camino Final (Verde)</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="w-full max-w-[540px] aspect-square p-2.5 bg-amber-100/60 rounded-2xl border-4 border-amber-300/80 shadow-lg relative flex items-center justify-center">
        <div
          className="grid gap-[3px] w-full h-full"
          style={{
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const isStart = areCoordsEqual([r, c], start);
              const isGoal = areCoordsEqual([r, c], goal);
              const isWall = walls.has(coordKey(r, c));
              const pathIndex = pathIndexMap.get(coordKey(r, c));

              return (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  className={`relative flex items-center justify-center rounded-lg border-2 cursor-pointer transition-all duration-100 ${getCellClasses(
                    r,
                    c
                  )}`}
                  title={`Casilla (${r}, ${c})`}
                >
                  {isStart && (
                    <div className="flex flex-col items-center justify-center text-center">
                      <Star className={`${isSmallGrid ? 'w-8 h-8' : 'w-4 h-4'} fill-amber-300 stroke-amber-900 drop-shadow`} />
                      {rows <= 6 && (
                        <span className="text-[9px] font-black tracking-tight leading-none text-amber-950 mt-0.5">
                          INICIO
                        </span>
                      )}
                    </div>
                  )}

                  {isGoal && (
                    <div className="flex flex-col items-center justify-center text-center">
                      <Flag className={`${isSmallGrid ? 'w-8 h-8' : 'w-4 h-4'} fill-white stroke-rose-900 drop-shadow`} />
                      {rows <= 6 && (
                        <span className="text-[9px] font-black tracking-tight leading-none text-white mt-0.5">
                          META
                        </span>
                      )}
                    </div>
                  )}

                  {isWall && (
                    <BrickWall className={`${isSmallGrid ? 'w-6 h-6' : 'w-3.5 h-3.5'} text-slate-400 opacity-60`} />
                  )}

                  {pathIndex !== undefined && !isStart && !isGoal && (
                    <span className={`font-black text-white drop-shadow ${isSmallGrid ? 'text-base' : 'text-xs'}`}>
                      {pathIndex}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
