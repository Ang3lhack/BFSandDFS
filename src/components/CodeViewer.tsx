import React, { useState } from 'react';
import { AlgorithmType } from '../types';
import { Copy, Check, Terminal, FileCode, Info } from 'lucide-react';

interface CodeViewerProps {
  algorithm: AlgorithmType;
  activeLine: number;
  currentExplanation: string;
  simpleExplanation: string;
}

const BFS_CODE_LINES = [
  'from collections import deque',
  'def bfs(matriz, inicio, meta):',
  '    cola = deque([inicio])  # Fila FIFO',
  '    visitados = {inicio}',
  '    padres = {inicio: None}',
  '    while cola:',
  '        actual = cola.popleft()  # Sale el primero',
  '        if actual == meta:',
  '            return reconstruir_camino(padres, meta)',
  '        for vecino in obtener_vecinos(actual, matriz):',
  '            if vecino not in visitados:',
  '                visitados.add(vecino)',
  '                padres[vecino] = actual',
  '                cola.append(vecino)  # Se forma al final',
  '    return None  # Sin camino'
];

const DFS_CODE_LINES = [
  'def dfs(matriz, inicio, meta):',
  '    pila = [inicio]  # Torre/Pila LIFO',
  '    visitados = {inicio}',
  '    padres = {inicio: None}',
  '    while pila:',
  '        actual = pila.pop()  # Sale el de arriba',
  '        if actual == meta:',
  '            return reconstruir_camino(padres, meta)',
  '        for vecino in obtener_vecinos(actual, matriz):',
  '            if vecino not in visitados:',
  '                visitados.add(vecino)',
  '                padres[vecino] = actual',
  '                pila.append(vecino)  # Se pone en el tope',
  '    return None  # Sin camino'
];

export const CodeViewer: React.FC<CodeViewerProps> = ({
  algorithm,
  activeLine,
  currentExplanation,
  simpleExplanation
}) => {
  const [copied, setCopied] = useState(false);
  const lines = algorithm === 'BFS' ? BFS_CODE_LINES : DFS_CODE_LINES;

  const handleCopy = () => {
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="tour-code" className="flex flex-col h-full bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-md">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 font-mono">
            {algorithm === 'BFS' ? 'algoritmo_bfs.py' : 'algoritmo_dfs.py'}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-1">
            Python 3
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors"
          title="Copiar codigo Python"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area with Active Line Highlight */}
      <div className="p-3 overflow-y-auto max-h-[200px] font-mono text-xs leading-relaxed select-text space-y-0.5 bg-slate-50/50">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-150 ${
                isActive
                  ? 'bg-amber-100 text-amber-950 font-bold border-l-4 border-amber-500 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="w-6 shrink-0 text-right select-none text-[11px] text-slate-400 font-medium flex items-center justify-end gap-1">
                {isActive && <span className="text-amber-600 text-xs">▶</span>}
                <span>{lineNumber}</span>
              </div>
              <pre className="whitespace-pre overflow-x-auto scrollbar-thin">
                <code>{line}</code>
              </pre>
            </div>
          );
        })}
      </div>

      {/* Panel de Explicación (Renombrado según solicitud: "el nombre de caja de traduccion cambialo a explicacion, las explicacion sin emojis") */}
      <div className="p-4 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 border-t-2 border-amber-200 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 font-sans">
                Explicacion
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              Linea {activeLine || 1}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug font-sans">
              {simpleExplanation || 'Presiona Iniciar o Siguiente Paso para comenzar la simulacion.'}
            </p>
          </div>
        </div>

        {/* Explicación Técnica */}
        <div className="mt-2 pt-2 border-t border-amber-200/50 flex items-start gap-1.5 text-[11px] text-slate-500">
          <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">
            <strong>Traza tecnica:</strong> {currentExplanation || 'Inicializando entorno de ejecucion.'}
          </p>
        </div>
      </div>
    </div>
  );
};
