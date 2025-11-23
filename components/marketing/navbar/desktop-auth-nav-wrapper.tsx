import { createClient } from "@/lib/supabase/server";
import { DesktopAuthNav } from "./desktop-auth-nav";

export async function DesktopAuthNavWrapper() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	return <DesktopAuthNav user={user} />;
}
