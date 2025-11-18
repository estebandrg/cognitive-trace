'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestResult, SARTResult, FlankerResult, NBackResult, PVTResult } from '@/lib/types/tests';
import { Trophy, Clock, Target, Brain, Eye, Zap, RotateCcw, Home } from 'lucide-react';

interface SequentialResultsProps {
  results: TestResult[];
  onRetry: () => void;
  onHome: () => void;
}

export default function SequentialResults({ results, onRetry, onHome }: SequentialResultsProps) {
  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'sart': return Eye;
      case 'flanker': return Target;
      case 'nback': return Brain;
      case 'pvt': return Zap;
      default: return Target;
    }
  };

  const getTestName = (testType: string) => {
    switch (testType) {
      case 'sart': return 'SART';
      case 'flanker': return 'Flanker';
      case 'nback': return 'N-Back';
      case 'pvt': return 'PVT';
      default: return testType.toUpperCase();
    }
  };

  const getTestDescription = (testType: string) => {
    switch (testType) {
      case 'sart': return 'Atención Sostenida';
      case 'flanker': return 'Control Cognitivo';
      case 'nback': return 'Memoria de Trabajo';
      case 'pvt': return 'Vigilancia Psicomotora';
      default: return '';
    }
  };

  const getPerformanceLevel = (accuracy: number, avgRT: number, testType: string) => {
    // Simple performance categorization based on accuracy and reaction time
    if (accuracy >= 0.9 && avgRT < 400) return { level: 'Excelente', color: 'text-green-600' };
    if (accuracy >= 0.8 && avgRT < 500) return { level: 'Bueno', color: 'text-blue-600' };
    if (accuracy >= 0.7 && avgRT < 600) return { level: 'Regular', color: 'text-orange-600' };
    return { level: 'Necesita Mejora', color: 'text-red-600' };
  };

  const calculateOverallScore = () => {
    const totalAccuracy = results.reduce((sum, result) => sum + result.accuracy, 0) / results.length;
    const avgReactionTime = results.reduce((sum, result) => sum + result.averageReactionTime, 0) / results.length;
    
    // Normalize scores (accuracy is already 0-1, RT needs normalization)
    const normalizedAccuracy = totalAccuracy;
    const normalizedRT = Math.max(0, 1 - (avgReactionTime - 200) / 800); // 200-1000ms range
    
    return Math.round(((normalizedAccuracy + normalizedRT) / 2) * 100);
  };

  const overallScore = calculateOverallScore();
  const totalDuration = results.reduce((sum, result) => sum + result.duration, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 md:space-y-4">
            <Badge className="inline-flex">Evaluación Completada</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Resultados de la Evaluación Cognitiva
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-2">
              Has completado todos los tests cognitivos. Aquí tienes un resumen completo de tu rendimiento.
            </p>
          </div>

          {/* Overall Score */}
          <Card className="relative overflow-hidden">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur" />
            <CardContent className="relative p-4 md:p-8 text-center">
              <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                <h2 className="text-xl md:text-2xl font-bold">Puntuación General</h2>
              </div>
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {overallScore}
              </div>
              <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
                Puntuación basada en precisión y velocidad de respuesta
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Duración total: {Math.round(totalDuration / 1000 / 60)} min</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{results.length} tests completados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Test Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {results.map((result, index) => {
              const IconComponent = getTestIcon(result.testType);
              const performance = getPerformanceLevel(result.accuracy, result.averageReactionTime, result.testType);
              
              return (
                <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="pb-3 md:pb-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                        <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-500" />
                      </span>
                      <div>
                        <CardTitle className="text-base md:text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {getTestName(result.testType)}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {getTestDescription(result.testType)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 md:space-y-4 pt-0">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-green-600">
                          {(result.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Precisión</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-blue-600">
                          {result.averageReactionTime.toFixed(0)}ms
                        </div>
                        <div className="text-xs text-muted-foreground">Tiempo Promedio</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="outline" className={performance.color}>
                        {performance.level}
                      </Badge>
                    </div>

                    {/* Test-specific metrics */}
                    {result.testType === 'sart' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">{(result as SARTResult).omissions}</div>
                          <div className="text-muted-foreground">Omisiones</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">{(result as SARTResult).commissions}</div>
                          <div className="text-muted-foreground">Comisiones</div>
                        </div>
                      </div>
                    )}

                    {result.testType === 'flanker' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">{(result as FlankerResult).congruentRT.toFixed(0)}ms</div>
                          <div className="text-muted-foreground">RT Congruente</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">+{(result as FlankerResult).interferenceEffect.toFixed(0)}ms</div>
                          <div className="text-muted-foreground">Interferencia</div>
                        </div>
                      </div>
                    )}

                    {result.testType === 'nback' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{(result as NBackResult).hits}</div>
                          <div className="text-muted-foreground">Aciertos</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-red-600">{(result as NBackResult).falsePositives}</div>
                          <div className="text-muted-foreground">Falsos Positivos</div>
                        </div>
                      </div>
                    )}

                    {result.testType === 'pvt' && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-semibold text-green-600">{(result as PVTResult).minRT.toFixed(0)}ms</div>
                          <div className="text-muted-foreground">RT Mínimo</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-orange-600">{(result as PVTResult).lapses}</div>
                          <div className="text-muted-foreground">Lapsos</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary and Recommendations */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resumen y Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm md:text-base">Fortalezas Identificadas</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    {results.filter(r => r.accuracy >= 0.8).map(r => (
                      <li key={r.testType}>• Buen rendimiento en {getTestDescription(r.testType)}</li>
                    ))}
                    {results.filter(r => r.averageReactionTime < 400).length > 0 && (
                      <li>• Tiempos de reacción rápidos</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm md:text-base">Áreas de Mejora</h4>
                  <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                    {results.filter(r => r.accuracy < 0.7).map(r => (
                      <li key={r.testType}>• Practicar {getTestDescription(r.testType)}</li>
                    ))}
                    {results.filter(r => r.averageReactionTime > 600).length > 0 && (
                      <li>• Trabajar en velocidad de respuesta</li>
                    )}
                    <li>• Mantener práctica regular para mejorar consistencia</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
            <Button onClick={onHome} variant="outline" size="lg" className="w-full md:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
            <Button onClick={onRetry} size="lg" className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              <RotateCcw className="w-4 h-4 mr-2" />
              Repetir Evaluación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
