import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {useTranslations} from 'next-intl';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  
  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <Badge className="hidden sm:inline-flex">{t('badge')}</Badge>
          <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[{
            title: t('steps.preparation.title'),
            text: t('steps.preparation.description'),
          }, {
            title: t('steps.stimulusTasks.title'),
            text: t('steps.stimulusTasks.description'),
          }, {
            title: t('steps.results.title'),
            text: t('steps.results.description'),
          }].map((s, i) => (
            <Card key={s.title} className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40" />
              <CardContent className="pt-8">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-xs font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
