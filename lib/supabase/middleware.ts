import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest, response?: NextResponse) {
  let supabaseResponse = response ?? NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname if present
  const localeMatch = pathname.match(/^\/(en|es)\//);
  const locale = localeMatch ? localeMatch[1] : 'en';

  // Check if the path is an auth path (either root or localized)
  const isAuthPath = pathname.startsWith("/auth") ||
    pathname.match(/^\/(?:en|es)\/auth/);

  // Check if the path is a public path (root, localized root, or tests)
  const isPublicPath = pathname === "/" ||
    pathname.match(/^\/(?:en|es)$/) ||
    pathname.startsWith("/tests") ||
    pathname.match(/^\/(?:en|es)\/tests/) ||
    pathname.startsWith("/faq") ||
    pathname.match(/^\/(?:en|es)\/faq/);

  // Only check auth for dashboard routes (most restrictive approach)
  // Tests work in local mode without auth
  // Auth routes handle their own logic
  // Public/marketing routes don't need auth
  const isDashboardPath = pathname.match(/^\/(?:en|es)?\/dashboard/);
  
  let user = null;
  if (isDashboardPath) {
    try {
      // Use getUser() instead of getClaims() - simpler and faster
      const { data: { user: authUser } } = await supabase.auth.getUser();
      user = authUser;
    } catch (error) {
      // Silently handle - user will be redirected if needed
      console.error('Error getting user:', error);
    }
  }

  if (isDashboardPath && !user) {
    // Redirect to login only for dashboard routes
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
