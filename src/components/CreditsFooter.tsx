import React from 'react';
import { GraduationCap, Award, Compass } from 'lucide-react';

export const CreditsFooter: React.FC = () => {
  return (
    <footer id="creditos" className="border-t border-slate-900 bg-slate-950/90 py-6 px-6 mt-12 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* University & Academic Identification */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">
              Universidad de Guadalajara · CUCEI
            </p>
            <p className="text-slate-500 text-[11px] font-mono">
              Estructuras de Datos y Algoritmos Avanzados
            </p>
          </div>
        </div>

        {/* Required Credit Text */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl shadow-md text-center md:text-right">
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            <strong className="text-emerald-400 font-medium">Autores:</strong> Alumnos del Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI) -{' '}
            <span className="text-slate-100 font-semibold">Angel Gael Garci Ramos</span>,{' '}
            <span className="text-slate-100 font-semibold">Valeria Martin Llamas</span>,{' '}
            <span className="text-slate-100 font-semibold">Maricarmen Hernández Gómez</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
