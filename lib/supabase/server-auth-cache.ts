import { cache } from 'react';
import { createClient } from './server';
import type { User } from '@supabase/supabase-js';

/**
 * Cached auth user getter for server components and actions
 * Uses React's cache() to deduplicate auth checks within the same request
 * 
 * Benefits:
 * - If multiple server actions are called in the same request, auth is checked only once
 * - If multiple server components need user data, auth is checked only once
 * - Reduces redundant Supabase API calls
 * 
 * Usage in server actions:
 * ```typescript
 * import { getCachedUser } from '@/lib/supabase/server-auth-cache';
 * 
 * export async function myServerAction() {
 *   const user = await getCachedUser();
 *   if (!user) {
 *     return { success: false, error: 'Not authenticated' };
 *   }
 *   // ... rest of action
 * }
 * ```
 */
export const getCachedUser = cache(async (): Promise<User | null> => {
	try {
		const supabase = await createClient();
		const { data: { user }, error } = await supabase.auth.getUser();
		
		if (error) {
			console.error('Error getting cached user:', error);
			return null;
		}
		
		return user;
	} catch (error) {
		console.error('Unexpected error in getCachedUser:', error);
		return null;
	}
});
