"use client";

import { Button } from "@/components/ui/button";
import { signInWithOAuth } from "@/lib/actions/auth-actions";
import type { OAuthProvider } from "@/lib/types/auth-types";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface OAuthButtonProps {
    provider: OAuthProvider;
}

const GoogleIcon = () => (
    <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
    >
        <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        />
    </svg>
);

const providerConfig = {
    google: {
        name: "Google",
        icon: GoogleIcon,
    },
};

export function OAuthButton({ provider }: OAuthButtonProps) {
    const t = useTranslations("auth.oauth");
    const [isLoading, setIsLoading] = useState(false);
    const config = providerConfig[provider];
    const Icon = config.icon;

    const handleOAuth = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithOAuth(provider);
            if (result.success && result.data?.redirectUrl) {
                // Redirect to OAuth provider
                window.location.href = result.data.redirectUrl;
            } else if (!result.success && result.error) {
                console.error("OAuth error:", result.error);
                alert(result.error.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("OAuth error:", error);
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full bg-background/50 hover:bg-background/80 transition-all duration-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={handleOAuth}
            disabled={isLoading}
        >
            <Icon />
            {isLoading
                ? t("redirecting")
                : t("continueWith", { provider: config.name })}
        </Button>
    );
}
