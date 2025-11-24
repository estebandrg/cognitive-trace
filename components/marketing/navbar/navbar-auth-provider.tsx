import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import ThemeSwitcher from "@/components/theme-switcher";
import { DesktopAuthNav } from "./desktop-auth-nav";
import { AuthNavItemsClient } from "./auth-nav-items-client";
import { MobileMenu } from "./mobile-menu";
import { useTranslations } from 'next-intl';
import { Link as IntlLink } from '@/i18n/routing';

interface NavbarAuthContentProps {
	user: User | null;
}

function NavbarAuthContent({ user }: NavbarAuthContentProps) {
	const t = useTranslations('navbar');
	
	return (
		<>
			{/* Desktop navigation */}
			<nav className="hidden items-center gap-6 md:flex">
				<IntlLink href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
					{t('faq')}
				</IntlLink>
				<DesktopAuthNav user={user} />
				<ThemeSwitcher />
			</nav>

			{/* Mobile menu */}
			<div className="flex items-center gap-2 md:hidden">
				<ThemeSwitcher />
				<MobileMenu>
					<AuthNavItemsClient user={user} />
				</MobileMenu>
			</div>
		</>
	);
}

export async function NavbarAuthProvider() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	return <NavbarAuthContent user={user} />;
}
