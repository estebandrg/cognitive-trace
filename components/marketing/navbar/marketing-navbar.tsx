import {useTranslations} from 'next-intl';
import {Link as IntlLink} from '@/i18n/routing';
import { NavbarAuthProvider } from "./navbar-auth-provider";

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
				
				{/* Single auth check for both desktop and mobile */}
				<NavbarAuthProvider />
			</div>
		</header>
	);
}
