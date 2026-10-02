import React from 'react';
import { AlgorithmType, Coordinate } from '../types';
import { Users, Layers, ArrowDown } from 'lucide-react';

interface DataStructureVisualizerProps {
  algorithm: AlgorithmType;
  items: Coordinate[];
}

export const DataStructureVisualizer: React.FC<DataStructureVisualizerProps> = ({
  algorithm,
  items
}) => {
  const isBFS = algorithm === 'BFS';

  return (
    <div id="tour-structure" className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
        <div className="flex items-center gap-2">
          {isBFS ? (
            <div className="p-1 rounded-lg bg-sky-100 text-sky-700">
              <Users className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 rounded-lg bg-orange-100 text-orange-700">
              <Layers className="w-4 h-4" />
            </div>
          )}
          <div>
            <span className="text-xs font-black text-slate-800 font-sans block">
              {isBFS ? 'Fila de Espera (Cola / Queue)' : 'Torre de Bloques (Pila / Stack)'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {isBFS ? 'Regla FIFO: El primero en entrar es el primero en salir' : 'Regla LIFO: El ultimo en entrar es el primero en salir'}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          En espera: <strong className="text-emerald-700 font-mono">{items.length}</strong>
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-3 text-center text-xs text-slate-400 font-medium italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
          (No hay casillas en espera en este momento)
        </div>
      ) : isBFS ? (
        /* BFS: La Fila (Horizontal) */
        <div className="space-y-1.5 bg-sky-50/60 p-2.5 rounded-xl border border-sky-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-sky-800 uppercase px-1">
            <span>Salida (Frente de la fila)</span>
            <span>Entrada (Final de la fila)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
            {items.map((coord, idx) => {
              const isFront = idx === 0;
              return (
                <div
                  key={`${coord[0]}-${coord[1]}-${idx}`}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all shadow-sm ${
                    isFront
                      ? 'bg-amber-400 text-slate-950 border-2 border-amber-500 ring-2 ring-amber-300 scale-105'
                      : 'bg-white text-slate-700 border-2 border-sky-200'
                  }`}
                  title={isFront ? 'Esta casilla sera la siguiente en explorarse' : 'En espera'}
                >
                  {isFront && <span className="text-[10px] block text-amber-950 font-black">SIGUIENTE</span>}
                  ({coord[0]}, {coord[1]})
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* DFS: La Torre de Bloques (Pila Vertical) */
        <div className="space-y-1.5 bg-orange-50/60 p-2.5 rounded-xl border border-orange-100">
          <div className="text-[10px] font-black text-orange-800 text-center uppercase tracking-wide flex items-center justify-center gap-1">
            <ArrowDown className="w-3 h-3" />
            <span>TOPE DE LA TORRE (Entrada y Salida)</span>
            <ArrowDown className="w-3 h-3" />
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-lg border border-orange-200 scrollbar-thin">
            {[...items].reverse().map((coord, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={`${coord[0]}-${coord[1]}-${idx}`}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
                    isTop
                      ? 'bg-orange-500 text-white border-2 border-orange-600 ring-2 ring-orange-300 scale-105'
                      : 'bg-orange-50 text-slate-700 border border-orange-200'
                  }`}
                  title={isTop ? 'Tope de la torre' : 'Bloque inferior'}
                >
                  {isTop && <span className="text-[9px] block font-black leading-none mb-0.5">TOPE</span>}
                  ({coord[0]}, {coord[1]})
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
