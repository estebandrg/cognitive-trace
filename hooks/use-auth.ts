'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

let cachedUser: User | null = null;
let lastCheck = 0;
const CACHE_DURATION = 5000; // 5 seconds

export function useAuth() {
	const [user, setUser] = useState<User | null>(cachedUser);
	const [loading, setLoading] = useState(!cachedUser);

	useEffect(() => {
		const checkAuth = async () => {
			const now = Date.now();
			
			// Use cache if recent
			if (cachedUser && now - lastCheck < CACHE_DURATION) {
				setUser(cachedUser);
				setLoading(false);
				return;
			}

			try {
				const supabase = createClient();
				const { data: { user: currentUser } } = await supabase.auth.getUser();
				
				cachedUser = currentUser;
				lastCheck = now;
				setUser(currentUser);
			} catch (error) {
				console.error('Auth check error:', error);
				cachedUser = null;
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();

		// Listen to auth changes
		const supabase = createClient();
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			cachedUser = session?.user ?? null;
			lastCheck = Date.now();
			setUser(cachedUser);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return { user, loading, isAuthenticated: !!user };
}
