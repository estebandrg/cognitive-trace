"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/actions/auth-actions";
import { OAuthButton } from "./oauth-button";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoginForm() {
    const t = useTranslations("auth.login");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn({ email, password });

        if (result.success) {
            router.push("/");
            router.refresh();
        } else {
            setError(result.error?.message || t("error"));
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t("title")}
                </h1>
                <p className="text-muted-foreground">
                    {t("subtitle")}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">{t("emailLabel")}</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="tu@email.com"
                            required
                            disabled={isLoading}
                            className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t("passwordLabel")}</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-primary hover:underline hover:text-blue-600 transition-colors"
                        >
                            {t("forgotPassword")}
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            disabled={isLoading}
                            className="pl-9 pr-9 bg-background/50 border-muted-foreground/20 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        t("loadingButton")
                    ) : (
                        <>
                            <LogIn className="mr-2 h-4 w-4" /> {t("submitButton")}
                        </>
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        {t("orContinueWith")}
                    </span>
                </div>
            </div>

            <OAuthButton provider="google" />

            <p className="text-center text-sm text-muted-foreground">
                {t("noAccount")}{" "}
                <Link href="/auth/signup" className="text-primary hover:underline font-medium transition-colors hover:text-blue-600">
                    {t("signUpLink")}
                </Link>
            </p>
        </div>
    );
}
