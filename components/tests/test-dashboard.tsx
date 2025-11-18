'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestConfig, TestType, TestResult } from '@/lib/types/tests';
import { Brain, Eye, Zap, Target, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const SARTTest = dynamic(() => import('./sart-test'), { ssr: false });
const FlankerTest = dynamic(() => import('./flanker-test'), { ssr: false });
const NBackTest = dynamic(() => import('./nback-test'), { ssr: false });
const PVTTest = dynamic(() => import('./pvt-test'), { ssr: false });

const testConfigs: TestConfig[] = [
  {
    testType: 'sart',
    title: 'SART Task',
    description: 'Sustained Attention to Response Task',
    duration: 45,
    icon: 'eye',
    color: 'bg-blue-500'
  },
  {
    testType: 'flanker',
    title: 'Flanker Task',
    description: 'Cognitive Conflict & Inhibition',
    duration: 60,
    icon: 'target',
    color: 'bg-green-500'
  },
  {
    testType: 'nback',
    title: 'N-Back Task',
    description: 'Working Memory Assessment',
    duration: 50,
    icon: 'brain',
    color: 'bg-purple-500'
  },
  {
    testType: 'pvt',
    title: 'PVT Task',
    description: 'Psychomotor Vigilance Test',
    duration: 40,
    icon: 'zap',
    color: 'bg-orange-500'
  }
];

const iconMap = {
  eye: Eye,
  target: Target,
  brain: Brain,
  zap: Zap
};

interface TestDashboardProps {
  onBack?: () => void;
  onTestComplete?: (result: TestResult) => void;
}

export default function TestDashboard({ onBack, onTestComplete }: TestDashboardProps) {
  const t = useTranslations();
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [isTestActive, setIsTestActive] = useState(false);

  const handleStartTest = (testType: TestType) => {
    setSelectedTest(testType);
    setIsTestActive(true);
  };

  const handleTestComplete = (result?: TestResult) => {
    setIsTestActive(false);
    setSelectedTest(null);
    
    if (result && onTestComplete) {
      onTestComplete(result);
    }
  };

  if (isTestActive && selectedTest) {
    const TestComponent = {
      sart: SARTTest,
      flanker: FlankerTest,
      nback: NBackTest,
      pvt: PVTTest
    }[selectedTest];

    return <TestComponent onComplete={handleTestComplete} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients matching landing page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-6">
          {onBack && (
            <div className="flex justify-start mb-8">
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          )}
          <Badge className="inline-flex">Evaluación Cognitiva</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tests Cognitivos
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Elige entre tests cognitivos validados científicamente para evaluar diferentes aspectos de tu atención y rendimiento cognitivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testConfigs.map((config) => {
            const IconComponent = iconMap[config.icon as keyof typeof iconMap];
            
            return (
              <Card 
                key={config.testType} 
                className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    </span>
                    <div>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {config.title}
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        {config.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      ~{config.duration}s
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Científico
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {config.testType === 'sart' && 
                      'Mide la atención sostenida y los lapsos atencionales a través de tareas de reconocimiento numérico.'
                    }
                    {config.testType === 'flanker' && 
                      'Evalúa el control cognitivo y la capacidad de resistir interferencias de estímulos distractores.'
                    }
                    {config.testType === 'nback' && 
                      'Evalúa la capacidad de memoria de trabajo y el manejo de carga cognitiva.'
                    }
                    {config.testType === 'pvt' && 
                      'Prueba el tiempo de reacción y la vigilancia a través de tareas de respuesta simples.'
                    }
                  </p>

                  <Button 
                    onClick={() => handleStartTest(config.testType)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    size="lg"
                  >
                    Comenzar {config.title}
                  </Button>
                </CardContent>
                
                {/* Bottom gradient line */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="relative overflow-hidden max-w-2xl mx-auto">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur" />
            <CardContent className="relative p-8">
              <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Antes de Comenzar
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li>• Busca un ambiente silencioso libre de distracciones</li>
                <li>• Asegúrate de tener una conexión a internet estable</li>
                <li>• Usa auriculares si están disponibles para mejor concentración</li>
                <li>• Completa los tests cuando te sientas alerta y enfocado</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
