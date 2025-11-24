'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createTestSession } from '@/lib/actions/session-actions';
import { createClient } from '@/lib/supabase/client';
import { Database, CheckCircle, XCircle, Loader2, User } from 'lucide-react';

export function DbTestButton() {
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [message, setMessage] = useState('');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userEmail, setUserEmail] = useState('');

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const supabase = createClient();
			const { data: { user } } = await supabase.auth.getUser();
			setIsAuthenticated(!!user);
			setUserEmail(user?.email || 'Not logged in');
		} catch (error) {
			setIsAuthenticated(false);
			setUserEmail('Error checking auth');
		}
	};

	const testDbConnection = async () => {
		setStatus('loading');
		setMessage('Testing database connection...');

		try {
			const result = await createTestSession(false);
			
			if (result.success) {
				setStatus('success');
				setMessage(`✅ Session created! ID: ${result.data?.id?.substring(0, 8)}...`);
				console.log('DB Test Success:', result);
			} else {
				setStatus('error');
				setMessage(`❌ ${result.error}`);
				console.error('DB Test Error:', result);
			}
		} catch (error: any) {
			setStatus('error');
			setMessage(`❌ ${error.message}`);
			console.error('DB Test Exception:', error);
		}
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm border border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-2 mb-3">
					<Database className="h-5 w-5 text-blue-600" />
					<h3 className="font-semibold text-sm">DB Connection Test</h3>
				</div>

				{/* Auth Status */}
				<div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
					<User className={`h-4 w-4 ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`} />
					<div className="flex-1">
						<div className="font-medium">{isAuthenticated ? '✓ Authenticated' : '✗ Not Authenticated'}</div>
						<div className="text-gray-500 truncate">{userEmail}</div>
					</div>
				</div>
				
				<Button
					onClick={testDbConnection}
					disabled={status === 'loading' || !isAuthenticated}
					className="w-full mb-2"
					size="sm"
					variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'outline'}
				>
					{status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{status === 'success' && <CheckCircle className="mr-2 h-4 w-4" />}
					{status === 'error' && <XCircle className="mr-2 h-4 w-4" />}
					{status === 'loading' ? 'Testing...' : 'Test Create Session'}
				</Button>

				{message && (
					<div className={`text-xs p-2 rounded ${
						status === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 
						status === 'error' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 
						'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-400'
					}`}>
						{message}
					</div>
				)}

				{!isAuthenticated && (
					<p className="text-xs text-amber-600 dark:text-amber-400 mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
						⚠️ Login required to test DB
					</p>
				)}

				<p className="text-xs text-gray-500 mt-2">
					Tests RLS policies and DB connection
				</p>
			</div>
		</div>
	);
}
