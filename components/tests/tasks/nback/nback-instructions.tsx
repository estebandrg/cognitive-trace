import { InstructionsContent } from '@/lib/types/test-system';
import { Brain } from 'lucide-react';

export const nbackInstructions: InstructionsContent = {
  title: 'N-Back Task',
  subtitle: '2-Back Working Memory Test',
  description: 'Mide tu capacidad de memoria de trabajo y actualización continua',
  icon: Brain,
  iconColor: 'purple',
  gradient: 'purple-blue',
  
  demoCards: [
    {
      title: '1. Secuencia',
      description: 'Las letras aparecen una por una',
      visual: (
        <div className="flex items-center gap-2 text-2xl font-mono">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center font-bold">A</div>
          <span className="text-gray-400">→</span>
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded border flex items-center justify-center font-bold">B</div>
          <span className="text-gray-400">→</span>
          <div className="w-10 h-10 bg-blue-200 dark:bg-blue-800 rounded border flex items-center justify-center font-bold text-blue-600">?</div>
        </div>
      ),
      color: 'blue',
      action: 'info',
    },
    {
      title: '2. Memoria',
      description: 'Recuerda la letra de 2 posiciones atrás',
      visual: (
        <div className="text-center">
          <div className="text-4xl mb-2">🧠</div>
          <div className="text-sm font-bold text-purple-600">2 Atrás</div>
        </div>
      ),
      color: 'purple',
      action: 'info',
    },
    {
      title: '3. ¡Match!',
      description: 'Presiona ESPACIO si coinciden',
      visual: (
        <div className="flex items-center gap-2 text-2xl font-mono">
          <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded border flex items-center justify-center font-bold text-green-600">A</div>
          <span className="text-green-600 font-bold">=</span>
          <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded border flex items-center justify-center font-bold text-green-600">A</div>
        </div>
      ),
      color: 'green',
      action: 'respond',
    },
  ],
  
  doList: [
    'Recuerda la letra de <strong>2 posiciones atrás</strong>',
    'Presiona <strong>ESPACIO</strong> o <strong>toca la pantalla</strong> cuando haya match',
    'Mantén <strong>actualizada tu memoria</strong> constantemente',
    'Completa <strong>30 trials</strong> (~50 segundos)',
  ],
  
  dontList: [
    '<strong>NO</strong> respondas si no hay match',
    '<strong>NO</strong> confundas posiciones (debe ser exactamente 2 atrás)',
    '<strong>NO</strong> pierdas la concentración',
    '<strong>NO</strong> te apresures - piensa antes de responder',
  ],
};
