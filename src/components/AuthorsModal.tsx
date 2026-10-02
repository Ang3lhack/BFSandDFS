import React from 'react';
import { X, GraduationCap, Building, Users } from 'lucide-react';

interface AuthorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorsModal: React.FC<AuthorsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-amber-400 px-6 py-4 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/40 text-amber-950 font-black">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-950 font-sans">
                Creditos Academicos
              </h2>
              <p className="text-xs font-semibold text-amber-900">
                Visualizador Didactico BFS vs DFS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-amber-500/40 hover:bg-amber-500/60 text-amber-950 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with exact requested text and corrected spelling */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-slate-800 text-sm leading-relaxed font-sans shadow-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <Building className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="font-bold text-slate-900">
                Institucion: Centro Universitario de Ciencias Exactas e Ingenierias (CUCEI).
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Users className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="font-bold text-slate-900">
                Alumnado: Angel Gael Garcia Ramos, Valeria Martin Llamas, Maricarmen Hernandez Gomez.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center font-medium">
            Desarrollado para la ensenanza interactiva y didactica de algoritmos de busqueda en grafos y laberintos.
          </p>

          <div className="flex justify-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md transition-all active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
