import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Trash2,
  Sliders,
  Pencil,
  Eraser,
  Star,
  Flag,
  Shuffle,
  GitBranch
} from 'lucide-react';
import { ToolMode, AlgorithmType } from '../types';
import { DFS_PRESETS } from '../utils/algorithms';

interface SimulationControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onResetSimulation: () => void;
  onClearWalls: () => void;
  onGenerateNewMaze: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
  onSeek: (step: number) => void;
  toolMode: ToolMode;
  onToolModeChange: (mode: ToolMode) => void;
  gridDimension: number;
  onGridDimensionChange: (dim: number) => void;
  status: 'idle' | 'running' | 'found' | 'not_found' | 'backtracking';
  algorithm: AlgorithmType;
  dfsStrategyIndex: number;
  onNextDfsStrategy: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onResetSimulation,
  onClearWalls,
  onGenerateNewMaze,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  onSeek,
  toolMode,
  onToolModeChange,
  gridDimension,
  onGridDimensionChange,
  status,
  algorithm,
  dfsStrategyIndex,
  onNextDfsStrategy
}) => {
  const isFinished = status === 'found' || status === 'not_found';
  const canStepForward = currentStep < totalSteps - 1;
  const canStepBackward = currentStep > 0;
  const currentDfsPreset = DFS_PRESETS[Math.abs(dfsStrategyIndex) % DFS_PRESETS.length];

  return (
    <div id="tour-controls" className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md space-y-3.5">
      {/* Primary Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={isPlaying || !canStepBackward}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-xl transition-all shadow-sm active:scale-95"
            title="Paso Anterior (Atajo: Flecha Izquierda)"
          >
            <SkipBack className="w-4 h-4" />
            <span className="hidden sm:inline">Paso Anterior</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 rounded border border-slate-300">←</kbd>
          </button>

          {/* Play / Pause Main Button */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-all duration-150 transform active:scale-95 ring-2 ring-amber-300"
              title="Pausar simulacion (Atajo: Barra Espaciadora)"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSAR</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/20 text-white rounded">Espacio</kbd>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isFinished && currentStep >= totalSteps - 1}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-xl shadow-md transition-all duration-150 transform active:scale-95 ring-2 ring-emerald-300"
              title="Iniciar simulacion (Atajo: Barra Espaciadora)"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isFinished ? 'REPETIR' : 'INICIAR'}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/20 text-white rounded">Espacio</kbd>
            </button>
          )}

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={isPlaying || !canStepForward}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded-xl transition-all shadow-sm active:scale-95"
            title="Siguiente Paso (Atajo: Flecha Derecha)"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 rounded border border-slate-300">→</kbd>
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Botón: Reiniciar Simulación (misma ruta y mismo mapa) */}
          <button
            onClick={onResetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all shadow-sm"
            title="Reiniciar simulacion al paso 0 (Atajo: Tecla R)"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Reiniciar</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-500 rounded border border-slate-300">R</kbd>
          </button>
        </div>

        {/* Timeline Slider and Counter */}
        <div className="flex-1 min-w-[180px] flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500">Paso:</span>
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <span className="text-xs font-mono font-bold text-slate-700 whitespace-nowrap min-w-[65px] text-right">
            <strong className="text-emerald-600">{currentStep}</strong> / {Math.max(0, totalSteps - 1)}
          </span>
        </div>

        {/* Speed Controller */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 px-1">Velocidad:</span>
          {[
            { label: '0.5x', val: 350 },
            { label: '1x', val: 180 },
            { label: '2x', val: 75 }
          ].map(({ label, val }) => (
            <button
              key={label}
              onClick={() => onSpeedChange(val)}
              className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
                speed === val
                  ? 'bg-white text-emerald-700 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Editing Tools, Alternate DFS Routes & Maze Generation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Cell Editing Tools */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-500 font-bold px-1.5">Herramienta:</span>
          <button
            onClick={() => onToolModeChange('wall')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              toolMode === 'wall'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dibujar Muros (arrastra en la cuadricula)"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Muro</span>
          </button>

          <button
            onClick={() => onToolModeChange('erase')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              toolMode === 'erase'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Borrar Muros"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Borrar</span>
          </button>

          <button
            onClick={() => onToolModeChange('start')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              toolMode === 'start'
                ? 'bg-amber-400 text-amber-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mover Inicio (Dorado)"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => onToolModeChange('goal')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              toolMode === 'goal'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mover Meta (Rojo)"
          >
            <Flag className="w-3.5 h-3.5 fill-current" />
            <span>Meta</span>
          </button>
        </div>

        {/* Opción específica solicitada: Probar otra ruta DFS en el MISMO laberinto */}
        {algorithm === 'DFS' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onNextDfsStrategy}
              disabled={isPlaying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 border-2 border-orange-300 font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Mantiene el mismo laberinto pero cambia la prioridad de direccion de DFS para tomar otra ruta"
            >
              <GitBranch className="w-4 h-4 text-orange-700" />
              <span>Cambiar Ruta DFS (Mismo Laberinto): <strong className="underline">{currentDfsPreset.label.split('(')[0].trim()}</strong></span>
            </button>
          </div>
        )}

        {/* Maze Actions */}
        <div className="flex items-center gap-2">
          {/* Botón: Nuevo laberinto completo */}
          <button
            onClick={onGenerateNewMaze}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black shadow-sm transition-all duration-150 disabled:opacity-50"
            title="Genera un laberinto completamente nuevo con muros y caminos distintos"
          >
            <Shuffle className="w-4 h-4" />
            <span>Nuevo Laberinto</span>
          </button>

          <button
            onClick={onClearWalls}
            disabled={isPlaying}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors disabled:opacity-50 font-semibold"
            title="Eliminar todos los muros"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>

        {/* Matrix Dimensions (3x3 to 10x10) */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-bold text-slate-600">Tamano:</span>
          <div className="flex items-center gap-1">
            {[3, 4, 5, 6, 8, 10].map((size) => (
              <button
                key={size}
                onClick={() => onGridDimensionChange(size)}
                disabled={isPlaying}
                className={`px-2 py-0.5 text-xs font-mono font-bold rounded-lg transition-all ${
                  gridDimension === size
                    ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
                    : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
                }`}
                title={`Matriz de ${size}x${size}`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
