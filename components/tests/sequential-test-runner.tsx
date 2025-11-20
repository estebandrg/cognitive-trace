'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TestType, TestResult, SARTResult, FlankerResult, NBackResult, PVTResult } from '@/lib/types/tests';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const SARTTest = dynamic(() => import('./sart-test'), { ssr: false });
const FlankerTest = dynamic(() => import('./flanker-test'), { ssr: false });
const NBackTest = dynamic(() => import('./nback-test'), { ssr: false });
const PVTTest = dynamic(() => import('./pvt-test'), { ssr: false });

interface SequentialTestRunnerProps {
  onComplete: (results: TestResult[]) => void;
  onBack: () => void;
}

const testSequence: TestType[] = ['sart', 'flanker', 'nback', 'pvt'];

const testInfo = {
  sart: { name: 'SART', description: 'Atención Sostenida', duration: 45 },
  flanker: { name: 'Flanker', description: 'Control Cognitivo', duration: 60 },
  nback: { name: 'N-Back', description: 'Memoria de Trabajo', duration: 50 },
  pvt: { name: 'PVT', description: 'Vigilancia Psicomotora', duration: 40 }
};

export default function SequentialTestRunner({ onComplete, onBack }: SequentialTestRunnerProps) {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [completedResults, setCompletedResults] = useState<TestResult[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  const currentTest = testSequence[currentTestIndex];
  const isLastTest = currentTestIndex === testSequence.length - 1;
  const totalTests = testSequence.length;
  const progress = (currentTestIndex / totalTests) * 100;

  const handleStartSequence = () => {
    setShowIntro(false);
    setIsTestActive(true);
  };

  const handleTestComplete = (result?: TestResult) => {
    if (result) {
      setCompletedResults(prev => [...prev, result]);
    }
    
    setIsTestActive(false);
    
    if (isLastTest) {
      // All tests completed
      onComplete(result ? [...completedResults, result] : completedResults);
    } else {
      // Move to next test after a brief pause
      setTimeout(() => {
        setCurrentTestIndex(prev => prev + 1);
        setIsTestActive(true);
      }, 1500);
    }
  };

  const renderTestComponent = () => {
    const TestComponent = {
      sart: SARTTest,
      flanker: FlankerTest,
      nback: NBackTest,
      pvt: PVTTest
    }[currentTest];

    return <TestComponent onComplete={handleTestComplete} />;
  };

  const renderIntro = () => (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <Badge className="inline-flex">Evaluación Completa</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Batería de Tests Cognitivos
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-2">
              Vas a realizar 4 tests cognitivos de manera secuencial. Cada test evalúa diferentes aspectos de tu rendimiento cognitivo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {testSequence.map((testType, index) => {
              const info = testInfo[testType];
              return (
                <Card key={testType} className="relative overflow-hidden">
                  <CardContent className="p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 mx-auto mb-2">
                      <span className="text-xs md:text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-xs md:text-sm mb-1">{info.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 hidden md:block">{info.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      ~{info.duration}s
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
              <h3 className="text-base md:text-lg font-semibold">Instrucciones Generales</h3>
              <ul className="text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-2 text-left">
                <li>• <strong>Duración:</strong> ~4-5 minutos</li>
                <li>• <strong>Ambiente:</strong> Lugar silencioso</li>
                <li>• <strong>Concentración:</strong> Mantén el foco</li>
                <li className="hidden md:block">• <strong>Descansos:</strong> Habrá breves pausas entre tests</li>
                <li>• <strong>Resultados:</strong> Reporte completo al final</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
            <Button onClick={onBack} variant="outline" size="lg" className="w-full md:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button onClick={handleStartSequence} size="lg" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              Comenzar Evaluación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransition = () => (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Progress indicator */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-muted-foreground">
                Test {currentTestIndex + 1} de {totalTests}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground">
                {Math.round(progress)}% completado
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Completed tests */}
          {completedResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold">Tests Completados</h3>
              <div className="flex justify-center gap-2 flex-wrap">
                {completedResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {testInfo[result.testType].name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next test info */}
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Siguiente: {testInfo[currentTest].name}
              </h2>
              <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
                {testInfo[currentTest].description}
              </p>
              <Badge variant="secondary" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Duración: ~{testInfo[currentTest].duration}s
              </Badge>
            </CardContent>
          </Card>

          <div className="text-xs md:text-sm text-muted-foreground">
            Preparándote para el siguiente test...
          </div>
        </div>
      </div>
    </div>
  );

  if (showIntro) {
    return renderIntro();
  }

  if (isTestActive) {
    return renderTestComponent();
  }

  return renderTransition();
}
