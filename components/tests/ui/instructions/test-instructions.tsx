import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InstructionsContent } from '@/lib/types/test-system';
import { InstructionHeader } from './instruction-header';
import { DemoCard } from './demo-card';
import { InstructionsList } from './instructions-list';

interface TestInstructionsProps {
  content: InstructionsContent;
  onStart: () => void;
}

export function TestInstructions({ content, onStart }: TestInstructionsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <InstructionHeader
        icon={content.icon}
        title={content.title}
        subtitle={content.subtitle}
        description={content.description}
        gradient={content.gradient}
      />

      {/* Visual Demo */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r from-${content.gradient.split('-')[0]}-500/5 to-${content.gradient.split('-')[1]}-500/5`} />
        <CardContent className="relative p-8">
          <h3 className={`text-2xl font-bold text-center mb-6 bg-gradient-to-r from-${content.gradient.split('-')[0]}-600 to-${content.gradient.split('-')[1]}-600 bg-clip-text text-transparent`}>
            ¿Cómo Funciona?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.demoCards.map((card, index) => (
              <DemoCard key={index} {...card} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InstructionsList
          title="Qué Hacer"
          items={content.doList}
          type="do"
        />
        <InstructionsList
          title="Qué Evitar"
          items={content.dontList}
          type="dont"
        />
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button
          onClick={onStart}
          size="lg"
          className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <content.icon className="w-5 h-5 mr-2" />
          Comenzar Test {content.title}
        </Button>
      </div>
    </div>
  );
}
