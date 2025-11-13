import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function CTA() {
  const t = useTranslations('cta');
  
  return (
    <section id="comenzar" className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur" />
          <Card className="relative">
            <CardContent className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{t('title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#">{t('startTest')}</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#como-funciona">{t('howItWorks')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
