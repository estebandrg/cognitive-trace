import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');
  
  return (
    <footer className="relative mt-12 border-t py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/40" />
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <p>{t('copyright', {year: new Date().getFullYear()})}</p>
        <nav className="flex items-center gap-4">
          <Link href="#como-funciona" className="hover:text-foreground">{t('navigation.howItWorks')}</Link>
          <Link href="#caracteristicas" className="hover:text-foreground">{t('navigation.features')}</Link>
          <Link href="#comenzar" className="hover:text-foreground">{t('navigation.start')}</Link>
        </nav>
      </div>
    </footer>
  );
}
