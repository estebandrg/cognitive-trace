import { InstructionsContent } from '@/lib/types/test-system';
import { Target, ArrowLeft, ArrowRight } from 'lucide-react';

export const flankerInstructions: InstructionsContent = {
  title: 'Flanker Task',
  subtitle: 'Cognitive Conflict & Inhibition Test',
  description: 'Mide tu control cognitivo y capacidad para resistir interferencias',
  icon: Target,
  iconColor: 'green',
  gradient: 'green-purple',
  
  demoCards: [
    {
      title: '1. Congruente',
      description: 'Todas las flechas apuntan igual',
      visual: (
        <div className="text-4xl font-mono tracking-wider">
          <span className="text-gray-400">→→</span>
          <span className="text-green-600 font-bold">→</span>
          <span className="text-gray-400">→→</span>
        </div>
      ),
      color: 'green',
      action: 'respond',
    },
    {
      title: '2. Incongruente',
      description: 'Flecha central diferente',
      visual: (
        <div className="text-4xl font-mono tracking-wider">
          <span className="text-gray-400">→→</span>
          <span className="text-orange-600 font-bold">←</span>
          <span className="text-gray-400">→→</span>
        </div>
      ),
      color: 'orange',
      action: 'withhold',
    },
    {
      title: '3. Enfoque',
      description: 'Ignora las flechas laterales',
      visual: (
        <div className="text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm font-bold text-blue-600">Solo el Centro</div>
        </div>
      ),
      color: 'blue',
      action: 'info',
    },
  ],
  
  doList: [
    'Enfócate <strong>solo en la flecha central</strong>',
    'Presiona <strong>←</strong> o <strong>toca IZQUIERDA</strong> si apunta izquierda',
    'Presiona <strong>→</strong> o <strong>toca DERECHA</strong> si apunta derecha',
    'Responde <strong>rápido y preciso</strong> (40 trials)',
  ],
  
  dontList: [
    '<strong>NO</strong> te distraigas con las flechas laterales',
    '<strong>NO</strong> respondas demasiado lento',
    '<strong>NO</strong> te apresures y sacrifiques precisión',
    '<strong>NO</strong> uses ambas manos (usa solo las flechas del teclado)',
  ],
};
