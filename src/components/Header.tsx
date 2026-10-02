import React from 'react';
import { GitCompare, Users, Compass, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenCompare: () => void;
  onOpenAuthors: () => void;
  onOpenTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCompare,
  onOpenAuthors,
  onOpenTour
}) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b-2 border-slate-200 sticky top-0 z-30 shadow-sm">
      {/* Brand logo & title - renamed as requested (no longer VisuAlgo CUCEI) */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-amber-950 font-black shadow-sm">
          <Compass className="w-5 h-5 text-amber-950" />
        </div>
        <div>
          <span className="text-base sm:text-lg font-black tracking-tight text-slate-800 font-sans">
            Explorador de Algoritmos <span className="text-amber-600">BFS y DFS</span>
          </span>
          <span className="hidden sm:inline text-xs font-bold text-slate-500 ml-2">
            · Simulador de Laberintos
          </span>
        </div>
      </div>

      {/* Action buttons in header */}
      <div className="flex items-center gap-2">
        {/* Botón de Guía / Tour interactivo */}
        <button
          onClick={onOpenTour}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all shadow-sm"
          title="Ver guia interactiva del simulador"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">Guia</span>
        </button>

        {/* Botón Comparar DFS vs BFS */}
        <button
          id="tour-compare"
          onClick={onOpenCompare}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-slate-900 bg-sky-200 hover:bg-sky-300 border border-sky-400 rounded-xl shadow-sm transition-all active:scale-95"
        >
          <GitCompare className="w-4 h-4 text-sky-800" />
          <span>Comparar BFS vs DFS</span>
        </button>

        {/* Botón simple de Autores / Créditos */}
        <button
          onClick={onOpenAuthors}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors shadow-sm"
          title="Ver creditos y autores del proyecto"
        >
          <Users className="w-4 h-4 text-slate-600" />
          <span>Creditos</span>
        </button>
      </div>
    </header>
  );
};
