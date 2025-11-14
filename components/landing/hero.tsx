import { Button } from "@/components/ui/button";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Hero() {
  const t = useTranslations('hero');
  
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 grid gap-14 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">{t('badge')}</span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('description')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#comenzar">{t('startTest')}</Link>
            </Button>
            <Button variant="secondary" asChild size="lg">
              <Link href="#como-funciona">{t('learnMore')}</Link>
            </Button>
          </div>
          <ul className="mt-2 text-sm text-muted-foreground grid gap-1">
            <li>{t('features.noRegistration')}</li>
            <li>{t('features.stimulusBased')}</li>
            <li>{t('features.multiDevice')}</li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur" />
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="h-8 w-full border-b bg-muted/60" />
            <div className="p-6 grid gap-4">
              <div className="h-8 w-1/2 rounded-md bg-muted" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded-lg bg-muted" />
                <div className="h-24 rounded-lg bg-muted" />
                <div className="h-24 rounded-lg bg-muted" />
              </div>
              <div className="h-10 w-32 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
