import { BrainCircuit, Clock, Gauge, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {useTranslations} from 'next-intl';

type Methodology = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

export default function ScientificValidation() {
  const t = useTranslations('scientificValidation');
  
  const methodologies: Methodology[] = [
    {
      name: t('methodologies.sart.name'),
      description: t('methodologies.sart.description'),
      icon: <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
    {
      name: t('methodologies.stroopFlanker.name'),
      description: t('methodologies.stroopFlanker.description'),
      icon: <Gauge className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
    {
      name: t('methodologies.nBack.name'),
      description: t('methodologies.nBack.description'),
      icon: <Zap className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
    {
      name: t('methodologies.pvt.name'),
      description: t('methodologies.pvt.description'),
      icon: <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
    },
  ];

  return (
    <section id="base-cientifica" className="py-20">
      <div className="pointer-events-none absolute inset-x-0 -z-10 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">{t('badge')}</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        </div>
        <p className="mb-8 max-w-3xl text-muted-foreground">
          {t('description')}
        </p>
        
        <div className="grid gap-6 sm:grid-cols-2">
          {methodologies.map((methodology, index) => (
            <Card
              key={index}
              className="relative overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                    {methodology.icon}
                  </span>
                  <CardTitle className="text-base">{methodology.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{methodology.description}</p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
