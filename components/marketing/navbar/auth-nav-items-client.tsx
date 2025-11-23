"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { User } from "@supabase/supabase-js";
import { LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth-actions";
import { useRouter } from "@/i18n/routing";

interface AuthNavItemsClientProps {
	user: User | null;
}

export function AuthNavItemsClient({ user }: AuthNavItemsClientProps) {
	const t = useTranslations("navbar");
	const router = useRouter();

	const handleLogout = async () => {
		await signOut();
		router.push("/");
		router.refresh();
	};

	if (user) {
		// Usuario autenticado
		return (
			<>
				<DropdownMenuItem asChild>
					<Link href="/dashboard" className="w-full flex items-center gap-2">
						<LayoutDashboard className="h-4 w-4" />
						{t("dashboard")}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem 
					onClick={handleLogout}
					className="flex items-center gap-2 cursor-pointer"
				>
					<LogOut className="h-4 w-4" />
					{t("logout")}
				</DropdownMenuItem>
			</>
		);
	}

	// Usuario NO autenticado
	return (
		<DropdownMenuItem asChild>
			<Link href="/auth/login" className="w-full flex items-center gap-2">
				<LogIn className="h-4 w-4" />
				{t("login")}
			</Link>
		</DropdownMenuItem>
	);
}
