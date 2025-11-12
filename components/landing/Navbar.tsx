"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-base font-semibold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CognitiveTrace
          </span>
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
        </Link>
        {/* Desktop navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground">Cómo funciona</Link>
            <Link href="#caracteristicas" className="text-muted-foreground hover:text-foreground">Características</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="#comenzar">Comenzar test</Link>
            </Button>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-screen h-screen">
              <DropdownMenuItem asChild>
                <Link href="#como-funciona">Cómo funciona</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#caracteristicas">Características</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="#comenzar">Comenzar test</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
