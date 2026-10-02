import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-grid',
    title: '1. Matriz del Laberinto',
    description:
      'Esta es la cuadricula interactiva de exploracion. El punto dorado representa el inicio, el punto rojo es la meta y las casillas grises son obstaculos. Puedes hacer clic o arrastrar el cursor para dibujar y borrar muros.'
  },
  {
    targetId: 'tour-theory',
    title: '2. Selector de Algoritmo',
    description:
      'Aqui puedes alternar entre Búsqueda en Amplitud (BFS) y Búsqueda en Profundidad (DFS) para comparar sus conceptos clave y estrategias de busqueda.'
  },
  {
    targetId: 'tour-code',
    title: '3. Codigo Python y Explicacion',
    description:
      'Muestra el codigo real en Python del algoritmo activo. Conforme la simulacion avanza, la linea en ejecucion se resalta e inmediatamente abajo la caja de Explicacion describe que esta ocurriendo paso a paso.'
  },
  {
    targetId: 'tour-structure',
    title: '4. Estructura de Datos en Vivo',
    description:
      'Observa en tiempo real como entran y salen los nodos: una Fila FIFO para BFS (el primero en llegar es el primero en ser atendido) o una Torre LIFO para DFS (el ultimo en entrar es el primero en salir).'
  },
  {
    targetId: 'tour-controls',
    title: '5. Controles de Reproduccion',
    description:
      'Controla la simulacion como un reproductor de video: Iniciar, Pausar, Paso Siguiente, Paso Anterior, barra de tiempo y selector de velocidad. Puedes usar atajos de teclado: Espacio para Play/Pausa, Flechas Izquierda/Derecha para avanzar o retroceder paso a paso, y tecla R para reiniciar.'
  },
  {
    targetId: 'tour-compare',
    title: '6. Comparar BFS vs DFS',
    description:
      'Usa este boton para abrir una vista comparativa simultanea. Podras ver como BFS encuentra el camino optimo mas corto mientras que DFS toma desvios largos por profundizar en una sola rama.'
  }
];

interface TourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
      setCurrentStepIndex(0);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 font-mono">
              Guia Rapida · Paso {currentStepIndex + 1} de {TOUR_STEPS.length}
            </span>
            <h3 className="text-base font-black text-slate-800 font-sans mt-0.5">
              {currentStep.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            title="Cerrar guia"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-medium">
            {currentStep.description}
          </p>
        </div>

        {/* Dots progress indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-6 bg-amber-500'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Ir al paso ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Saltar guia
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>{isLast ? 'Finalizar' : 'Siguiente'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
