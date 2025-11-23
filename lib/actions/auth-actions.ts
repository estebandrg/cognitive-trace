"use server";

import { createClient } from "@/lib/supabase/server";
import type {
    AuthResponse,
    SignUpData,
    SignInData,
    ResetPasswordData,
    UpdatePasswordData,
    OAuthProvider,
} from "@/lib/types/auth-types";
import { headers } from "next/headers";

function validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: "La contraseña debe tener al menos 8 caracteres" };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "La contraseña debe incluir al menos una mayúscula" };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "La contraseña debe incluir al menos una minúscula" };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "La contraseña debe incluir al menos un número" };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: "La contraseña debe incluir al menos un carácter especial" };
    }
    return { valid: true };
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
    try {
        const supabase = await createClient();

        // Validate passwords match
        if (data.confirmPassword && data.password !== data.confirmPassword) {
            return {
                success: false,
                error: {
                    message: "Las contraseñas no coinciden",
                    code: "passwords_mismatch",
                },
            };
        }

        // Validate password strength
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
            return {
                success: false,
                error: {
                    message: passwordValidation.message || "Contraseña inválida",
                    code: "weak_password",
                },
            };
        }

        const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        });

        if (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        return {
            success: true,
            data: {
                user: authData.user ?? undefined,
                message: "Cuenta creada exitosamente. Por favor verifica tu email.",
            },
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: "Error inesperado durante el registro",
            },
        };
    }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
    try {
        const supabase = await createClient();

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        return {
            success: true,
            data: {
                user: authData.user,
                message: "Inicio de sesión exitoso",
            },
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: "Error inesperado durante el inicio de sesión",
            },
        };
    }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
    try {
        const supabase = await createClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        return {
            success: true,
            data: {
                message: "Sesión cerrada exitosamente",
            },
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: "Error inesperado al cerrar sesión",
            },
        };
    }
}

/**
 * Sign in with OAuth provider (Google)
 */
export async function signInWithOAuth(
    provider: OAuthProvider,
): Promise<AuthResponse> {
    try {
        const supabase = await createClient();
        const headersList = await headers();
        const origin = headersList.get("origin");
        const referer = headersList.get("referer");

        // Extract locale from referer URL
        let locale = 'en';
        if (referer) {
            const refererUrl = new URL(referer);
            const localeMatch = refererUrl.pathname.match(/^\/(en|es)\//);
            if (localeMatch) {
                locale = localeMatch[1];
            }
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${origin}/auth/callback?locale=${locale}`,
            },
        });

        if (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        if (data.url) {
            return {
                success: true,
                data: {
                    redirectUrl: data.url,
                },
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: "Error inesperado durante la autenticación con OAuth",
            },
        };
    }
}

/**
 * Request a password reset email
 */
export async function resetPassword(
    data: ResetPasswordData,
): Promise<AuthResponse> {
    try {
        const supabase = await createClient();
        const headersList = await headers();
        const origin = headersList.get("origin");
        const referer = headersList.get("referer");

        // Extract locale from referer URL
        let locale = 'en';
        if (referer) {
            const refererUrl = new URL(referer);
            const localeMatch = refererUrl.pathname.match(/^\/(en|es)\//);
            if (localeMatch) {
                locale = localeMatch[1];
            }
        }

        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${origin}/auth/update-password?locale=${locale}`,
        });

        if (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        return {
            success: true,
            data: {
                message:
                    "Se ha enviado un email con instrucciones para restablecer tu contraseña",
            },
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: "Error inesperado al solicitar el restablecimiento de contraseña",
            },
        };
    }
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(
    data: UpdatePasswordData,
): Promise<AuthResponse> {
    try {
        const supabase = await createClient();

        // Validate passwords match
        if (data.password !== data.confirmPassword) {
            return {
                success: false,
                error: {
                    message: "Las contraseñas no coinciden",
                    code: "passwords_mismatch",
                },
            };
        }

        // Validate password strength
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
            return {
                success: false,
                error: {
                    message: passwordValidation.message || "Contraseña inválida",
                    code: "weak_password",
                },
            };
        }

        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }

        return {
            success: true,
            data: {
                message: "Contraseña actualizada exitosamente",
            },
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: "Error inesperado al actualizar la contraseña",
            },
        };
    }
}
