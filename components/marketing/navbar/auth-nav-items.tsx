import { createClient } from "@/lib/supabase/server";
import { AuthNavItemsClient } from "./auth-nav-items-client";

export async function AuthNavItems() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	return <AuthNavItemsClient user={user} />;
}
