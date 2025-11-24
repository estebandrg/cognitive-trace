import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BarChart3, MousePointerClick, Smartphone } from "lucide-react";
import {useTranslations} from 'next-intl';


export default function FeatureGrid() {
  const t = useTranslations('features');
  
  const features = [
    {
      title: t('stimulusTests.title'),
      description: t('stimulusTests.description'),
      icon: Brain,
    },
    {
      title: t('clearResults.title'),
      description: t('clearResults.description'),
      icon: MousePointerClick,
    },
    {
      title: t('progressTracking.title'),
      description: t('progressTracking.description'),
      icon: BarChart3,
    },
    {
      title: t('multiDevice.title'),
      description: t('multiDevice.description'),
      icon: Smartphone,
    },
  ];
  
  return (
    <section id="caracteristicas" className="py-20">
      <div className="pointer-events-none absolute inset-x-0 -z-10 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">{t('badge')}</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="relative overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                    <f.icon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </span>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
