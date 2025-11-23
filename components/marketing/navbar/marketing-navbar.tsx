import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme-switcher";
import {useTranslations} from 'next-intl';
import {Link as IntlLink} from '@/i18n/routing';
import { MobileMenu } from "./mobile-menu";
import { AuthNavItems } from "./auth-nav-items";
import { DesktopAuthNavWrapper } from "./desktop-auth-nav-wrapper";

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
          
          <DesktopAuthNavWrapper />
          <ThemeSwitcher />
        </nav>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <MobileMenu>
            <AuthNavItems />
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
