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

export default function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CognitiveTrace
          </span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Preguntas Frecuentes
          </Link>
          <Button asChild>
            <Link href="/test" className="group">Start test</Link>
          </Button>
          <ThemeSwitcher />
        </nav>

        {/* Mobile menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menú de navegación">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/faq" className="w-full">Preguntas Frecuentes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/test" className="w-full">Start test</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
