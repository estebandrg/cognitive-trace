"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/lib/actions/auth-actions";
import { PasswordStrengthIndicator } from "./password-strength-indicator";
import { Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function UpdatePasswordForm() {
    const t = useTranslations("auth.updatePassword");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const confirmPassword = formData.get("confirmPassword") as string;

        const result = await updatePassword({ password, confirmPassword });

        if (result.success) {
            router.push("/auth/login");
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
                    <Label htmlFor="password">{t("passwordLabel")}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <PasswordStrengthIndicator password={password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
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
                            <RefreshCw className="mr-2 h-4 w-4" /> {t("submitButton")}
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
