"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { User } from "@supabase/supabase-js";

interface DesktopAuthNavProps {
	user: User | null;
}

export function DesktopAuthNav({ user }: DesktopAuthNavProps) {
	const t = useTranslations("navbar");

	if (user) {
		// Usuario autenticado - mostrar dashboard
		return (
			<Button asChild>
				<Link href="/dashboard">
					{t("dashboard")}
				</Link>
			</Button>
		);
	}

	// Usuario NO autenticado - mostrar login y signup
	return (
		<div className="flex gap-3 items-center">
			<Button variant="outline" asChild>
				<Link href="/auth/login">
					{t("login")}
				</Link>
			</Button>
			<Button asChild>
				<Link href="/auth/signup">
					{t("signup")}
				</Link>
			</Button>
		</div>
	);
}
