"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({
    password,
}: PasswordStrengthIndicatorProps) {
    const t = useTranslations("auth.passwordStrength");

    const requirements = [
        {
            id: "minChars",
            label: t("minChars"),
            test: (p: string) => p.length >= 8,
        },
        {
            id: "uppercase",
            label: t("uppercase"),
            test: (p: string) => /[A-Z]/.test(p),
        },
        {
            id: "lowercase",
            label: t("lowercase"),
            test: (p: string) => /[a-z]/.test(p),
        },
        {
            id: "number",
            label: t("number"),
            test: (p: string) => /[0-9]/.test(p),
        },
        {
            id: "specialChar",
            label: t("specialChar"),
            test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
        },
    ];

    const strength = requirements.reduce((acc, req) => {
        return acc + (req.test(password) ? 1 : 0);
    }, 0);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-muted";
        if (score <= 2) return "bg-red-500";
        if (score <= 4) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="space-y-2 mt-2">
            <div className="flex gap-1 h-1 w-full">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-full w-full rounded-full transition-all duration-300 ${strength >= level ? getStrengthColor(strength) : "bg-muted/30"
                            }`}
                    />
                ))}
            </div>
            <ul className="space-y-1">
                {requirements.map((req) => {
                    const isMet = req.test(password);
                    return (
                        <li
                            key={req.id}
                            className={`text-xs flex items-center gap-2 transition-colors duration-300 ${isMet ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                                }`}
                        >
                            {isMet ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                <X className="h-3 w-3" />
                            )}
                            {req.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
