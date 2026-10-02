import React from 'react';
import { X, Play, SkipForward, SkipBack, Sparkles, Pencil, MapPin, Target } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white font-sans">
            Guía de Uso del Simulador VisuAlgo CUCEI
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">
              1. Código de Colores Oficial
            </h3>
            <ul className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
              <li className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-400" />
                <span>Azul: Punto de Inicio</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                <span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-500" />
                <span>Rojo: La Meta</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                <span className="w-3.5 h-3.5 rounded bg-slate-600 border border-slate-500" />
                <span>Gris: Obstáculos / Muros</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                <span className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-700" />
                <span>Verde: Camino explorado</span>
              </li>
              <li className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 col-span-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-300" />
                <span>Verde Brillante: Camino final reconstruido</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">
              2. Laberinto con ≥2 Caminos Garantizados
            </h3>
            <p>
              Al presionar el botón <strong>&quot;Generar Laberinto (≥2 Caminos)&quot;</strong>, el algoritmo
              talla dos corredores independientes entre el Inicio y la Meta y añade obstáculos aleatorios en
              las celdas restantes. De esta forma, siempre habrá al menos dos rutas posibles para que puedas
              evaluar cómo se desvían BFS y DFS.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">
              3. Controles Didácticos de Reproducción
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li><strong>Play / Pausar:</strong> Inicia o detiene la animación paso a paso.</li>
              <li><strong>Step Forward / Backward:</strong> Avanza o retrocede exactamente un micro-paso en la línea de código Python.</li>
              <li><strong>Barra de tiempo:</strong> Desplaza el cursor para viajar en el tiempo a cualquier instante de la ejecución.</li>
              <li><strong>Pila / Cola en vivo:</strong> Observa en tiempo real cómo los nodos entran y salen de la estructura de datos.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-1">
              4. Edición de la Cuadrícula
            </h3>
            <p>
              Usa la herramienta <strong>Muro</strong> para hacer clic y arrastrar creando obstáculos personalizados.
              Usa <strong>Inicio</strong> o <strong>Meta</strong> para reubicar los puntos clave en la matriz.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
