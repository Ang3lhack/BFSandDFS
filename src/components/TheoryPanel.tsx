import React from 'react';
import { AlgorithmType } from '../types';
import { CheckCircle2, XCircle, Waves, Compass, Info, GitBranch } from 'lucide-react';
import { DFS_PRESETS } from '../utils/algorithms';

interface TheoryPanelProps {
  algorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  isRunning: boolean;
  dfsStrategyIndex: number;
  onNextDfsStrategy: () => void;
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({
  algorithm,
  onSelectAlgorithm,
  isRunning,
  dfsStrategyIndex,
  onNextDfsStrategy
}) => {
  const isBFS = algorithm === 'BFS';
  const activeDfsPreset = DFS_PRESETS[Math.abs(dfsStrategyIndex) % DFS_PRESETS.length];

  return (
    <div id="tour-theory" className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      {/* Header and Algorithm Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600" />
          <div>
            <h2 className="text-sm font-black text-slate-800 font-sans tracking-tight">
              Estrategia del Algoritmo
            </h2>
            <p className="text-[11px] text-slate-500">
              Selecciona el algoritmo activo
            </p>
          </div>
        </div>

        {/* Algorithm Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => onSelectAlgorithm('BFS')}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              isBFS
                ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-300'
                : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>BFS (Amplitud)</span>
          </button>
          <button
            onClick={() => onSelectAlgorithm('DFS')}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
              !isBFS
                ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-300'
                : 'text-slate-600 hover:text-slate-900 disabled:opacity-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>DFS (Profundidad)</span>
          </button>
        </div>
      </div>

      {/* Description Cards */}
      {isBFS ? (
        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-sky-50 border-2 border-sky-200 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-200 text-sky-800 mt-0.5">
              <Waves className="w-4 h-4" />
            </div>
            <div className="text-xs text-sky-950 leading-relaxed font-sans">
              <strong className="text-sky-900 font-black block text-sm mb-0.5">
                Busqueda en Amplitud (BFS)
              </strong>
              Se expande en circulos concentricos nivel por nivel hacia todas las direcciones. Explora primero todas las casillas a distancia 1, luego a distancia 2, etc.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-emerald-800 uppercase font-black block">Camino Optimo</span>
                <span className="text-emerald-950 font-bold">Garantiza el mas corto</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black block">Estructura</span>
                <span className="text-slate-900 font-bold">Cola FIFO (Fila)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-orange-50 border-2 border-orange-200 flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-orange-200 text-orange-800 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div className="text-xs text-orange-950 leading-relaxed font-sans">
                <strong className="text-orange-900 font-black block text-sm mb-0.5">
                  Busqueda en Profundidad (DFS)
                </strong>
                Avanza a fondo a lo largo de un solo pasillo hasta chocar con un obstaculo. Depende fuertemente de la prioridad de giro.
              </div>
            </div>

            <button
              onClick={onNextDfsStrategy}
              disabled={isRunning}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-orange-900 bg-white hover:bg-orange-100 border border-orange-300 rounded-lg shadow-sm transition-all"
              title="Cambiar la prioridad de giro para descubrir otra ruta en este mismo laberinto"
            >
              <GitBranch className="w-3.5 h-3.5 text-orange-600" />
              <span>Alternar Ruta DFS</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="text-[10px] text-rose-800 uppercase font-black block">Camino Optimo</span>
                <span className="text-rose-950 font-bold">No siempre es el mas corto</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-black block">Variante Activa</span>
                <span className="text-slate-900 font-bold text-[11px]">{activeDfsPreset.label.split('(')[0].trim()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
