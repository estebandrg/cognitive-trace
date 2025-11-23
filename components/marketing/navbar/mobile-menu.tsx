"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

interface MobileMenuProps {
	children: ReactNode;
}

export function MobileMenu({ children }: MobileMenuProps) {
	const t = useTranslations("navbar");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" aria-label={t("menuLabel")}>
					<Menu className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem asChild>
					<Link href="/faq" className="w-full">
						{t("faq")}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/tests" className="w-full">
						{t("startTest")}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
