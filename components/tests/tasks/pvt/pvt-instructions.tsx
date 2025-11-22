import { InstructionsContent } from '@/lib/types/test-system';
import { Zap } from 'lucide-react';

export const pvtInstructions: InstructionsContent = {
  title: 'PVT Task',
  subtitle: 'Psychomotor Vigilance Test',
  description: 'Mide tu tiempo de reacción y capacidad de mantener alerta sostenida',
  icon: Zap,
  iconColor: 'orange',
  gradient: 'orange-purple',
  
  demoCards: [
    {
      title: '1. Esperar',
      description: 'Mantente alerta durante 2-7 segundos',
      visual: (
        <div className="text-2xl font-bold text-gray-500 animate-pulse">
          Espera...
        </div>
      ),
      color: 'gray',
      action: 'info',
    },
    {
      title: '2. ¡Estímulo!',
      description: 'Círculo rojo aparece',
      visual: (
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/50" />
      ),
      color: 'red',
      action: 'respond',
    },
    {
      title: '3. Reaccionar',
      description: 'Presiona ESPACIO o TAP',
      visual: (
        <div className="text-center">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-sm font-bold text-orange-600">Lo más rápido posible</div>
        </div>
      ),
      color: 'orange',
      action: 'respond',
    },
  ],
  
  doList: [
    'Mantente <strong>concentrado</strong> durante toda la espera',
    'Responde <strong>inmediatamente</strong> cuando aparezca el círculo rojo',
    'Usa <strong>ESPACIO</strong> o <strong>toca la pantalla</strong>',
    'Completa <strong>8 trials</strong> (~40 segundos)',
  ],
  
  dontList: [
    '<strong>NO</strong> respondas antes de que aparezca el círculo',
    '<strong>NO</strong> pierdas la concentración durante la espera',
    '<strong>NO</strong> respondas demasiado lento',
    '<strong>NO</strong> uses múltiples dedos o manos',
  ],
};
