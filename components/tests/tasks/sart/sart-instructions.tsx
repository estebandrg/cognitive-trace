import { InstructionsContent } from '@/lib/types/test-system';
import { Eye } from 'lucide-react';

export const sartInstructions: InstructionsContent = {
  title: 'SART Task',
  subtitle: 'Sustained Attention to Response Task',
  description: 'Mide tu capacidad para mantener atención sostenida y resistir respuestas automáticas',
  icon: Eye,
  iconColor: 'blue',
  gradient: 'blue-indigo',
  
  demoCards: [
    {
      title: '1. Números 0-9',
      description: 'Presiona ESPACIO o toca la pantalla',
      visual: <div className="text-6xl font-bold text-green-600">7</div>,
      color: 'green',
      action: 'respond',
    },
    {
      title: '2. ¡NO al 3!',
      description: 'NO presiones nada cuando veas el 3',
      visual: <div className="text-6xl font-bold text-red-600">3</div>,
      color: 'red',
      action: 'withhold',
    },
    {
      title: '3. Velocidad',
      description: 'Responde lo más rápido posible',
      visual: (
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">350ms</div>
          <div className="text-xs text-blue-500">¡Rápido!</div>
        </div>
      ),
      color: 'blue',
      action: 'info',
    },
  ],
  
  doList: [
    'Presiona <strong>ESPACIO</strong> o <strong>toca la pantalla</strong> para todos los números',
    'Responde <strong>rápidamente</strong> cuando veas 0, 1, 2, 4, 5, 6, 7, 8, 9',
    'Mantén tu <strong>concentración</strong> durante todo el test',
    'Completa <strong>45 trials</strong> (~45 segundos)',
  ],
  
  dontList: [
    '<strong>NO</strong> respondas cuando veas el número <strong>3</strong>',
    '<strong>NO</strong> te distraigas o pierdas la concentración',
    '<strong>NO</strong> respondas demasiado lento',
    '<strong>NO</strong> hagas respuestas múltiples por número',
  ],
};
