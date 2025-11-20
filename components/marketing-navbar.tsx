"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import {useTranslations} from 'next-intl';
import {Link as IntlLink} from '@/i18n/routing';

export default function MarketingNavbar() {
  const t = useTranslations('navbar');
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <IntlLink href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CognitiveTrace
          </span>
        </IntlLink>
        
        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <IntlLink href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t('faq')}
          </IntlLink>
          <Button asChild>
            <IntlLink href="/tests" className="group">{t('startTest')}</IntlLink>
          </Button>
          <ThemeSwitcher />
        </nav>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label={t('menuLabel')}>
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <IntlLink href="/faq" className="w-full">{t('faq')}</IntlLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <IntlLink href="/tests" className="w-full">{t('startTest')}</IntlLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
