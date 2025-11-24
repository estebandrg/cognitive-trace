import { User } from "@supabase/supabase-js";

export type OAuthProvider = "google";

export interface AuthError {
    message: string;
    code?: string;
}

export interface AuthResponse {
    success: boolean;
    error?: AuthError;
    data?: {
        user?: User;
        message?: string;
        redirectUrl?: string;
    };
}

export interface SignUpData {
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export interface ResetPasswordData {
    email: string;
}

export interface UpdatePasswordData {
    password: string;
    confirmPassword: string;
}

export interface AuthFormState {
    isLoading: boolean;
    error: string | null;
    success: string | null;
}
