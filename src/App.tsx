import React, { useState, useEffect, useMemo } from 'react';
import { Coordinate, AlgorithmType, ToolMode, StepSnapshot } from './types';
import {
  coordKey,
  areCoordsEqual,
  generateAlgorithmSteps,
  generateGuaranteedMaze,
  DFS_PRESETS
} from './utils/algorithms';
import { Header } from './components/Header';
import { TheoryPanel } from './components/TheoryPanel';
import { CodeViewer } from './components/CodeViewer';
import { DataStructureVisualizer } from './components/DataStructureVisualizer';
import { GridMatrix } from './components/GridMatrix';
import { SimulationControls } from './components/SimulationControls';
import { ComparisonModal } from './components/ComparisonModal';
import { AuthorsModal } from './components/AuthorsModal';
import { TourOverlay } from './components/TourOverlay';
import { CheckCircle2, AlertTriangle, GitCompare, GitBranch } from 'lucide-react';

export default function App() {
  // Cuadrícula inicial didáctica de 5x5
  const [gridDimension, setGridDimension] = useState<number>(5);
  const rows = gridDimension;
  const cols = gridDimension;

  // Coordenadas de Inicio y Meta
  const [start, setStart] = useState<Coordinate>([0, 0]);
  const [goal, setGoal] = useState<Coordinate>([rows - 1, cols - 1]);

  // Conjunto de obstáculos (muros) con camino garantizado
  const [walls, setWalls] = useState<Set<string>>(() => {
    return generateGuaranteedMaze(5, 5, [0, 0], [4, 4], 0.25);
  });

  // Algoritmo activo y herramienta de edición
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('BFS');
  const [toolMode, setToolMode] = useState<ToolMode>('wall');

  // Estrategia / variante de ruta para DFS en el MISMO laberinto
  const [dfsStrategyIndex, setDfsStrategyIndex] = useState<number>(0);

  // Estado de reproducción
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(180); // Velocidad normal

  // Modales
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  // Generar todos los pasos del algoritmo seleccionado (teniendo en cuenta la variante DFS)
  const steps: StepSnapshot[] = useMemo(() => {
    return generateAlgorithmSteps(algorithm, rows, cols, start, goal, walls, dfsStrategyIndex);
  }, [algorithm, rows, cols, start, goal, walls, dfsStrategyIndex]);

  // Paso activo en la línea de tiempo
  const activeStep: StepSnapshot = useMemo(() => {
    if (steps.length === 0) {
      return {
        stepIndex: 0,
        current: null,
        visited: [],
        visitedSet: new Set<string>(),
        frontier: [],
        parents: {},
        finalPath: [],
        status: 'idle',
        codeLine: 1,
        explanation: 'Preparado para comenzar.',
        simpleExplanation: 'Presiona Iniciar para ver el recorrido paso a paso.',
        action: 'init'
      };
    }
    const safeIndex = Math.min(currentStepIndex, steps.length - 1);
    return steps[safeIndex];
  }, [steps, currentStepIndex]);

  // Ciclo de animación
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          setIsPlaying(false);
        }
        return next;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Atajos de teclado globales: Espacio (Play/Pausa), Flechas (Paso Anterior/Siguiente), R (Reiniciar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está interactuando con un campo de formulario que no sea slider
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
      ) {
        if (target.getAttribute('type') !== 'range') {
          return;
        }
      }

      // Si hay un modal abierto, permitir cerrar con Escape y evitar activar controles
      if (isCompareOpen || isAuthorsOpen || isTourOpen) {
        if (e.key === 'Escape') {
          setIsCompareOpen(false);
          setIsAuthorsOpen(false);
          setIsTourOpen(false);
        }
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => {
          if (!prev) {
            // Si ya terminó, reiniciar desde el paso 0 al presionar espacio
            setCurrentStepIndex((curr) => (curr >= steps.length - 1 ? 0 : curr));
            return true;
          }
          return false;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length, isCompareOpen, isAuthorsOpen, isTourOpen]);

  // Cambiar dimensiones de la cuadrícula (de 3x3 a 10x10)
  const handleGridDimensionChange = (newDim: number) => {
    setIsPlaying(false);
    setGridDimension(newDim);
    const newStart: Coordinate = [0, 0];
    const newGoal: Coordinate = [newDim - 1, newDim - 1];
    setStart(newStart);
    setGoal(newGoal);
    const newWalls = generateGuaranteedMaze(newDim, newDim, newStart, newGoal, 0.25);
    setWalls(newWalls);
    setCurrentStepIndex(0);
  };

  // Botón 1: Reiniciar Simulación (mantiene el MISMO laberinto y la MISMA ruta desde el paso 0)
  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Botón 2: Cambiar a OTRA ruta DFS en el MISMO laberinto (sin alterar los muros)
  const handleNextDfsStrategy = () => {
    setIsPlaying(false);
    setDfsStrategyIndex((prev) => (prev + 1) % DFS_PRESETS.length);
    setCurrentStepIndex(0);
  };

  // Botón 3: Reiniciar por completo / Nuevo Laberinto (genera otra distribución con rutas distintas)
  const handleGenerateNewMaze = () => {
    setIsPlaying(false);
    const newWalls = generateGuaranteedMaze(rows, cols, start, goal, 0.28);
    setWalls(newWalls);
    setCurrentStepIndex(0);
  };

  // Limpiar todos los muros
  const handleClearWalls = () => {
    setIsPlaying(false);
    setWalls(new Set<string>());
    setCurrentStepIndex(0);
  };

  // Cambiar algoritmo (BFS <-> DFS)
  const handleAlgorithmChange = (newAlgo: AlgorithmType) => {
    setIsPlaying(false);
    setAlgorithm(newAlgo);
    setCurrentStepIndex(0);
  };

  // Alternar o pintar muros
  const handleToggleWall = (coord: Coordinate, forceState?: boolean) => {
    if (isPlaying) return;
    const key = coordKey(coord[0], coord[1]);
    setWalls((prev) => {
      const next = new Set(prev);
      const shouldAdd = forceState !== undefined ? forceState : !next.has(key);
      if (shouldAdd) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
    setCurrentStepIndex(0);
  };

  // Ubicar Inicio o Meta con el clic
  const handleCellClick = (coord: Coordinate) => {
    if (isPlaying) return;
    const key = coordKey(coord[0], coord[1]);

    if (toolMode === 'start') {
      if (areCoordsEqual(coord, goal)) return;
      setStart(coord);
      setWalls((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setCurrentStepIndex(0);
    } else if (toolMode === 'goal') {
      if (areCoordsEqual(coord, start)) return;
      setGoal(coord);
      setWalls((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setCurrentStepIndex(0);
    }
  };

  // Controles de reproducción
  const handlePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSeek = (step: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(step, steps.length - 1)));
  };

  const isGoalReached = activeStep.status === 'found';
  const isExhausted = activeStep.status === 'not_found';
  const activeDfsPreset = DFS_PRESETS[Math.abs(dfsStrategyIndex) % DFS_PRESETS.length];

  return (
    <div className="min-h-screen bg-amber-50/40 text-slate-800 flex flex-col font-sans">
      {/* Barra superior con selector de tour y créditos */}
      <Header
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAuthors={() => setIsAuthorsOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* Dashboard principal de una sola pantalla */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Barra de estado con indicador de algoritmo y variante */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isGoalReached
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 ring-2 ring-emerald-200'
                  : isExhausted
                  ? 'bg-rose-100 text-rose-700 border border-rose-300 ring-2 ring-rose-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isGoalReached ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
                  {algorithm === 'BFS'
                    ? 'Busqueda en Amplitud (BFS)'
                    : `Busqueda en Profundidad (DFS - ${activeDfsPreset.label.split('(')[0].trim()})`}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-slate-600">
                  {isGoalReached
                    ? algorithm === 'BFS'
                      ? 'Meta alcanzada (Camino mas corto garantizado)'
                      : 'Meta alcanzada (Ruta encontrada por profundidad)'
                    : isExhausted
                    ? 'Sin camino accesible (bloqueado por muros)'
                    : isPlaying
                    ? 'Simulando paso a paso...'
                    : 'Pausado'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Paso actual: <strong className="text-slate-800 font-mono">{currentStepIndex}</strong> de{' '}
                <span className="font-mono">{Math.max(0, steps.length - 1)}</span> · Casillas exploradas:{' '}
                <strong className="text-sky-700 font-mono">{activeStep.visited.length}</strong>
                {activeStep.finalPath.length > 0 && (
                  <>
                    {' '}· Longitud de la ruta final:{' '}
                    <strong className="text-emerald-700 font-mono">
                      {activeStep.finalPath.length} casillas
                    </strong>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {algorithm === 'DFS' && (
              <button
                onClick={handleNextDfsStrategy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-950 bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 rounded-xl transition-all shadow-sm active:scale-95"
                title="Cambiar la ruta de DFS en este mismo laberinto"
              >
                <GitBranch className="w-4 h-4 text-orange-700" />
                <span>Alternar Ruta DFS</span>
              </button>
            )}

            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-sky-900 bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <GitCompare className="w-4 h-4 text-sky-700" />
              <span>Comparar BFS vs DFS</span>
            </button>
          </div>
        </div>

        {/* Distribución 2 Zonas: Izquierda = Matriz, Derecha = Código y Explicación */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Columna Izquierda: Matriz del Laberinto */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-3 shadow-sm flex flex-col items-center justify-center">
              <GridMatrix
                rows={rows}
                cols={cols}
                start={start}
                goal={goal}
                walls={walls}
                visitedSet={activeStep.visitedSet}
                finalPath={activeStep.finalPath}
                currentCell={activeStep.current}
                toolMode={toolMode}
                onCellClick={handleCellClick}
                onToggleWall={handleToggleWall}
                isRunning={isPlaying}
              />
            </div>
          </div>

          {/* Columna Derecha: Selector de Teoría, Código, Explicación y Estructura */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* Teoría y Selector */}
            <TheoryPanel
              algorithm={algorithm}
              onSelectAlgorithm={handleAlgorithmChange}
              isRunning={isPlaying}
              dfsStrategyIndex={dfsStrategyIndex}
              onNextDfsStrategy={handleNextDfsStrategy}
            />

            {/* Visor de Código Python con caja de Explicación */}
            <div className="min-h-[340px]">
              <CodeViewer
                algorithm={algorithm}
                activeLine={activeStep.codeLine}
                currentExplanation={activeStep.explanation}
                simpleExplanation={activeStep.simpleExplanation}
              />
            </div>

            {/* Estructura de Datos en Vivo */}
            <DataStructureVisualizer
              algorithm={algorithm}
              items={activeStep.frontier}
            />
          </div>
        </div>

        {/* Zona Inferior: Controles de Reproducción tipo Video */}
        <div className="pt-1">
          <SimulationControls
            isPlaying={isPlaying}
            onPlay={handlePlay}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onResetSimulation={handleResetSimulation}
            onClearWalls={handleClearWalls}
            onGenerateNewMaze={handleGenerateNewMaze}
            speed={speed}
            onSpeedChange={setSpeed}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onSeek={handleSeek}
            toolMode={toolMode}
            onToolModeChange={setToolMode}
            gridDimension={gridDimension}
            onGridDimensionChange={handleGridDimensionChange}
            status={activeStep.status}
            algorithm={algorithm}
            dfsStrategyIndex={dfsStrategyIndex}
            onNextDfsStrategy={handleNextDfsStrategy}
          />
        </div>
      </main>

      {/* Modal de Comparación BFS vs DFS */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        rows={rows}
        cols={cols}
        start={start}
        goal={goal}
        walls={walls}
        initialDfsStrategyIndex={dfsStrategyIndex}
      />

      {/* Modal de Créditos Académicos (CUCEI) */}
      <AuthorsModal
        isOpen={isAuthorsOpen}
        onClose={() => setIsAuthorsOpen(false)}
      />

      {/* Tour Guiado Interactivo */}
      <TourOverlay
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />
    </div>
  );
}
