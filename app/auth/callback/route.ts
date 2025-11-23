import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const next = searchParams.get("next") ?? "/";
	const locale = searchParams.get("locale") ?? 'en';

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			const forwardedHost = request.headers.get("x-forwarded-host");
			const isLocalEnv = process.env.NODE_ENV === "development";
			// Ensure next path includes locale
			const nextPath = next.startsWith(`/${locale}`) ? next : `/${locale}${next}`;
			if (isLocalEnv) {
				return NextResponse.redirect(`${origin}${nextPath}`);
			} else if (forwardedHost) {
				return NextResponse.redirect(`https://${forwardedHost}${nextPath}`);
			} else {
				return NextResponse.redirect(`${origin}${nextPath}`);
			}
		}
	}

	// Return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/${locale}/auth/login?error=auth_callback_error`);
}
