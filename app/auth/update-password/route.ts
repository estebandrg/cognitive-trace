import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const locale = searchParams.get("locale") ?? 'en';

	// Redirect to the localized update-password page
	return NextResponse.redirect(`${origin}/${locale}/auth/update-password`);
}
