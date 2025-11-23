"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/actions/auth-actions";
import { Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export function ForgotPasswordForm() {
    const t = useTranslations("auth.forgotPassword");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        const result = await resetPassword({ email });

        if (result.success) {
            setSuccess(
                result.data?.message ||
                t("success"),
            );
        } else {
            setError(
                result.error?.message || t("error"),
            );
        }

        setIsLoading(false);
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

                {success && (
                    <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 border border-green-500/20">
                        {success}
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

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        t("loadingButton")
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" /> {t("submitButton")}
                        </>
                    )}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                <Link href="/auth/login" className="text-primary hover:underline font-medium transition-colors hover:text-blue-600">
                    {t("backToLogin")}
                </Link>
            </p>
        </div>
    );
}
