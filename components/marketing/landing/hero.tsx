import { Button } from "@/components/ui/button";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import { Target, Zap, Brain, Clock } from 'lucide-react';

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
              <Link href="/tests">{t('startTest')}</Link>
            </Button>
            <Button variant="secondary" asChild size="lg">
              <Link href="#como-funciona">{t('learnMore')}</Link>
            </Button>
          </div>
          <ul className="mt-2 text-sm text-muted-foreground grid gap-1">
            <li>{t('features.trackProgress')}</li>
            <li>{t('features.stimulusBased')}</li>
            <li>{t('features.multiDevice')}</li>
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur animate-pulse" />
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-card shadow-2xl backdrop-blur-sm">
            {/* Mock browser header */}
            <div className="h-8 w-full border-b bg-muted/60 flex items-center px-3 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-4 bg-muted/40 rounded-sm w-32" />
              </div>
            </div>
            
            {/* Mock app content */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tests Cognitivos
                </span>
              </div>
              
              {/* Test cards grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* SART Test Card */}
                <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 p-3 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">SART</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">Atención sostenida</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">~45s</span>
                    </div>
                  </div>
                </div>
                
                {/* Flanker Test Card */}
                <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-green-50/50 to-purple-50/50 dark:from-green-950/20 dark:to-purple-950/20 p-3 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">Flanker</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">Control cognitivo</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">~60s</span>
                    </div>
                  </div>
                </div>
                
                {/* N-Back Test Card */}
                <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 p-3 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">N-Back</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">Memoria de trabajo</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">~50s</span>
                    </div>
                  </div>
                </div>
                
                {/* PVT Test Card */}
                <div className="group relative overflow-hidden rounded-lg border bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20 p-3 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs font-medium text-orange-700 dark:text-orange-300">PVT</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">Vigilancia psicomotora</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">~40s</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mock button */}
              <div className="pt-2">
                <div className="h-8 w-28 rounded-md bg-gradient-to-r from-blue-600/30 to-purple-600/30 animate-pulse" />
              </div>
            </div>
            
            {/* Floating elements for extra visual appeal */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500/40 animate-ping" />
            <div className="absolute bottom-6 left-4 w-1.5 h-1.5 rounded-full bg-purple-500/40 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
