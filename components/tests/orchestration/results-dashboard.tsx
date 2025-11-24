'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestResult, TestType } from '@/lib/types/tests';
import { getTestMetadata } from '@/store/utils/test-metadata';
import { calculateOverallScore } from '@/store/utils/score-calculator';
import { Brain, Eye, Zap, Target, Trophy, Clock, CheckCircle, AlertCircle, ArrowRight, Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const iconMap = {
  sart: Eye,
  flanker: Target,
  nback: Brain,
  pvt: Zap
};

interface ResultsDashboardProps {
  completedResult: TestResult;
  completedTests: TestType[];
  missingTests: TestType[];
  onStartTest: (testType: TestType) => void;
  onReturnHome: () => void;
}

export default function ResultsDashboard({
  completedResult,
  completedTests,
  missingTests,
  onStartTest,
  onReturnHome
}: ResultsDashboardProps) {
  const t = useTranslations();
  const [loadingTest, setLoadingTest] = useState<TestType | null>(null);
  const [loadingAction, setLoadingAction] = useState<'continue' | null>(null);
  
  const testMetadata = getTestMetadata(completedResult.testType);
  const IconComponent = iconMap[completedResult.testType];
  
  // Calculate performance level
  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (accuracy >= 80) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (accuracy >= 70) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  // Memoize expensive calculations
  const performance = useMemo(() => getPerformanceLevel(completedResult.accuracy), [completedResult.accuracy]);
  const overallScore = useMemo(() => calculateOverallScore([completedResult]), [completedResult]);

  // Prepare chart data
  const reactionTimeData = useMemo(() => {
    return completedResult.responses.map((response, index) => ({
      trial: index + 1,
      responseTime: response.responseTime,
      correct: response.correct
    }));
  }, [completedResult.responses]);

  const accuracyData = useMemo(() => [
    {
      name: 'Accuracy',
      value: completedResult.accuracy,
      fill: '#3b82f6'
    }
  ], [completedResult.accuracy]);

  const responseDistribution = useMemo(() => {
    const correct = completedResult.responses.filter(r => r.correct).length;
    const incorrect = completedResult.responses.length - correct;
    return [
      { name: 'Correct', value: correct, fill: '#10b981' },
      { name: 'Incorrect', value: incorrect, fill: '#ef4444' }
    ];
  }, [completedResult.responses]);

  // Handle test start with loading state
  const handleStartTest = async (testType: TestType) => {
    setLoadingTest(testType);
    try {
      await onStartTest(testType);
    } finally {
      setLoadingTest(null);
    }
  };

  // Handle continue with loading state
  const handleContinue = async () => {
    setLoadingAction('continue');
    try {
      await onReturnHome();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradients - optimized for dark mode */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 dark:from-green-400/10 dark:to-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 dark:from-purple-400/10 dark:to-pink-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-green-500/10 dark:from-blue-400/5 dark:to-green-400/5 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Clean Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
              <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {t('tests.resultsDashboard.title', { testName: testMetadata.name })}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('tests.resultsDashboard.subtitle', { testFullName: testMetadata.fullName })}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Performance Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <Card className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {Math.round(completedResult.accuracy)}%
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {t('tests.resultsDashboard.metrics.accuracy')}
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                  {Math.round(completedResult.averageReactionTime)}ms
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {t('tests.resultsDashboard.metrics.avgTime')}
                </div>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                  {completedResult.responses.filter(r => r.correct).length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {t('tests.resultsDashboard.metrics.correct')}
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="text-center">
                <Badge className={`${performance.bgColor} ${performance.color} text-xs sm:text-sm px-2 sm:px-3 py-1 mb-1`}>
                  {performance.level}
                </Badge>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {t('tests.resultsDashboard.metrics.performance')}
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reaction Time Trend */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Response Time Trend</CardTitle>
                </div>
                <CardDescription>Performance across all trials</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reactionTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="trial" 
                      label={{ value: 'Trial', position: 'insideBottom', offset: -5 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Response Time']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={4} 
                            fill={payload.correct ? '#10b981' : '#ef4444'}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Incorrect</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accuracy & Distribution */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">Response Distribution</CardTitle>
                </div>
                <CardDescription>Correct vs incorrect responses</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={responseDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [value, 'Responses']}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {responseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {responseDistribution[0].value}
                    </div>
                    <div className="text-xs text-muted-foreground">Correct</div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {responseDistribution[1].value}
                    </div>
                    <div className="text-xs text-muted-foreground">Incorrect</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Remaining Tests */}
          {missingTests.length > 0 ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {t('tests.resultsDashboard.continueAssessment.title')}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {t('tests.resultsDashboard.continueAssessment.description')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {missingTests.map((testType) => {
                  const metadata = getTestMetadata(testType);
                  const TestIcon = iconMap[testType];
                  
                  // Define gradient colors for each test (memoized for performance)
                  const testStyles = useMemo(() => ({
                    gradientColors: {
                      sart: 'from-blue-500/20 via-purple-500/20 to-blue-500/20',
                      flanker: 'from-green-500/20 via-blue-500/20 to-green-500/20',
                      nback: 'from-purple-500/20 via-pink-500/20 to-purple-500/20',
                      pvt: 'from-orange-500/20 via-red-500/20 to-orange-500/20'
                    },
                    iconColors: {
                      sart: 'text-blue-600',
                      flanker: 'text-green-600',
                      nback: 'text-purple-600',
                      pvt: 'text-orange-600'
                    },
                    buttonGradients: {
                      sart: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
                      flanker: 'from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700',
                      nback: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
                      pvt: 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                    }
                  }), []);

                  return (
                    <Card 
                      key={testType} 
                      className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                    >
                      {/* Gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${testStyles.gradientColors[testType]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Gradient border effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${testStyles.gradientColors[testType]} rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300`} />
                      
                      <CardContent className="relative p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-br ${testStyles.gradientColors[testType]} backdrop-blur-sm`}>
                            <TestIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${testStyles.iconColors[testType]}`} />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className={`text-base sm:text-lg font-semibold bg-gradient-to-r ${testStyles.buttonGradients[testType].split(' ')[0]} ${testStyles.buttonGradients[testType].split(' ')[1]} bg-clip-text text-transparent`}>
                                {metadata.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {metadata.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {metadata.description} • {metadata.duration}
                              </p>
                            </div>
                            
                            <Button
                              onClick={() => handleStartTest(testType)}
                              disabled={loadingTest === testType}
                              className={`w-full bg-gradient-to-r ${testStyles.buttonGradients[testType]} text-white border-0 transition-all duration-300 text-sm sm:text-base disabled:opacity-50`}
                              aria-label={t('tests.resultsDashboard.startTest', { testName: metadata.name })}
                            >
                              {loadingTest === testType ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                <>
                                  {t('tests.resultsDashboard.startTest', { testName: metadata.name })}
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {/* Bottom gradient line */}
                        <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${testStyles.gradientColors[testType]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="relative">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4" />
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-lg" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {t('tests.resultsDashboard.allComplete.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('tests.resultsDashboard.allComplete.description')}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={loadingAction === 'continue'}
              className="flex items-center gap-2 w-full sm:w-auto disabled:opacity-50"
              aria-label={t('tests.resultsDashboard.buttons.continue')}
            >
              {t('tests.resultsDashboard.buttons.continue')}
              {loadingAction === 'continue' ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
