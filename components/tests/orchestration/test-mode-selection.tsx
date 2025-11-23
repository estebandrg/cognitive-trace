'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Grid3X3, Clock, Target } from 'lucide-react';
import { startTestSession } from '@/lib/helpers/test-session-helpers';
import { useStore } from '@/store';

interface TestModeSelectionProps {
  onModeSelect?: (mode: 'sequential' | 'dashboard') => void; // Made optional for backward compatibility
}

export default function TestModeSelection({ onModeSelect }: TestModeSelectionProps) {
  const t = useTranslations();
  const router = useRouter();
  const { startSession } = useStore();
  const [isLoading, setIsLoading] = useState<'sequential' | 'individual' | null>(null);

  const handleModeSelect = async (mode: 'sequential' | 'dashboard') => {
    if (onModeSelect) {
      // Use callback if provided (backward compatibility)
      onModeSelect(mode);
      return;
    }
    
    // Create session in DB first
    const isSequential = mode === 'sequential';
    setIsLoading(isSequential ? 'sequential' : 'individual');
    
    try {
      const result = await startTestSession(isSequential, startSession);
      
      if (!result.success) {
        alert(`Error: ${result.error}`);
        return;
      }
      
      // Navigate to specific route
      if (mode === 'sequential') {
        router.push('/tests/sequential');
      } else {
        router.push('/tests/individual');
      }
    } catch (error: any) {
      console.error('Error starting session:', error);
      alert('Error al iniciar los tests. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients matching landing page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-24">
        <div className="text-center mb-8 md:mb-16 space-y-4 md:space-y-6">
          <Badge className="inline-flex">Evaluación Cognitiva</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tests Cognitivos
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl mx-auto px-2">
            Elige cómo quieres realizar los tests cognitivos: todos de manera secuencial para una evaluación completa, o accede al dashboard para hacerlos individualmente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          {/* Sequential Mode */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative pb-3 md:pb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                  <PlayCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-500" />
                </span>
                <div>
                  <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Evaluación Completa
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-muted-foreground">
                    Todos los tests de manera secuencial
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative space-y-3 md:space-y-4 pt-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  ~4-5 min
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Recomendado
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed hidden md:block">
                Realiza todos los tests cognitivos uno tras otro para obtener una evaluación completa de tu rendimiento cognitivo. Incluye SART, Flanker, N-Back y PVT.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed md:hidden">
                Evaluación completa con todos los tests cognitivos.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 md:p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200 text-sm md:text-base">Incluye:</h4>
                <ul className="text-xs md:text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• SART (Atención sostenida)</li>
                  <li>• Flanker (Control cognitivo)</li>
                  <li>• N-Back (Memoria de trabajo)</li>
                  <li>• PVT (Vigilancia psicomotora)</li>
                </ul>
              </div>

              <Button 
                onClick={() => handleModeSelect('sequential')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                size="lg"
                disabled={isLoading !== null}
              >
                {isLoading === 'sequential' ? 'Iniciando...' : 'Comenzar Evaluación Completa'}
              </Button>
            </CardContent>
            
            {/* Bottom gradient line */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
          </Card>

          {/* Dashboard Mode */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative pb-3 md:pb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <span className="inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-600/10 to-purple-600/10">
                  <Grid3X3 className="h-5 w-5 md:h-6 md:w-6 text-green-600 dark:text-green-500" />
                </span>
                <div>
                  <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                    Dashboard Individual
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-muted-foreground">
                    Elige tests específicos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative space-y-3 md:space-y-4 pt-0">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Flexible
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Personalizable
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed hidden md:block">
                Accede al dashboard para elegir y realizar tests específicos según tus necesidades. Perfecto para entrenar habilidades cognitivas particulares.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed md:hidden">
                Elige y realiza tests específicos según tus necesidades.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium mb-2 text-green-800 dark:text-green-200 text-sm md:text-base">Ventajas:</h4>
                <ul className="text-xs md:text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Elige tests específicos</li>
                  <li>• Repite tests individuales</li>
                  <li>• Controla tu ritmo</li>
                  <li>• Enfoque en áreas específicas</li>
                </ul>
              </div>

              <Button 
                onClick={() => handleModeSelect('dashboard')}
                className="w-full bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 text-white border-0"
                size="lg"
                disabled={isLoading !== null}
              >
                {isLoading === 'individual' ? 'Iniciando...' : 'Ir al Dashboard'}
              </Button>
            </CardContent>
            
            {/* Bottom gradient line */}
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-green-600/30 to-transparent" />
          </Card>
        </div>

        <div className="mt-8 md:mt-16 text-center">
          <Card className="relative overflow-hidden max-w-2xl mx-auto">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur" />
            <CardContent className="relative p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recomendaciones
              </h3>
              <ul className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-2 text-left">
                <li className="hidden md:block">• <strong>Evaluación Completa:</strong> Ideal para obtener un perfil cognitivo completo</li>
                <li className="hidden md:block">• <strong>Dashboard Individual:</strong> Perfecto para entrenar habilidades específicas</li>
                <li className="md:hidden">• <strong>Completa:</strong> Perfil cognitivo completo</li>
                <li className="md:hidden">• <strong>Individual:</strong> Entrenar habilidades específicas</li>
                <li>• Busca un ambiente silencioso libre de distracciones</li>
                <li>• Asegúrate de tener una conexión a internet estable</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
