'use client';

import { useTestSession } from '@/hooks/use-test-session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Debug component to show session status
 * Only visible in development mode
 */
export function SessionDebugInfo() {
	const { currentSession, completedTests } = useTestSession();

	// Only show in development
	if (process.env.NODE_ENV !== 'development') {
		return null;
	}

	if (!currentSession) {
		return (
			<Card className="fixed bottom-4 right-4 w-80 opacity-80 hover:opacity-100 transition-opacity">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm flex items-center gap-2">
						<Database className="h-4 w-4" />
						Session Debug
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Badge variant="outline" className="gap-1">
						<XCircle className="h-3 w-3" />
						No active session
					</Badge>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="fixed bottom-4 right-4 w-80 opacity-80 hover:opacity-100 transition-opacity">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm flex items-center gap-2">
					<Database className="h-4 w-4" />
					Session Debug
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 text-xs">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Session ID:</span>
					<code className="text-xs bg-muted px-1 rounded">
						{currentSession.id.slice(-8)}
					</code>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">DB Session:</span>
					{currentSession.dbSessionId ? (
						<Badge variant="default" className="gap-1">
							<CheckCircle2 className="h-3 w-3" />
							Connected
						</Badge>
					) : (
						<Badge variant="secondary" className="gap-1">
							<XCircle className="h-3 w-3" />
							Local only
						</Badge>
					)}
				</div>

				{currentSession.dbSessionId && (
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">DB ID:</span>
						<code className="text-xs bg-muted px-1 rounded">
							{currentSession.dbSessionId.slice(-8)}
						</code>
					</div>
				)}

				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Type:</span>
					<Badge variant={currentSession.isSequential ? 'default' : 'outline'}>
						{currentSession.isSequential ? 'Sequential' : 'Individual'}
					</Badge>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-muted-foreground">Tests completed:</span>
					<span className="font-medium">{completedTests.length}</span>
				</div>

				{completedTests.length > 0 && (
					<div className="pt-2 border-t">
						<span className="text-muted-foreground">Completed:</span>
						<div className="flex flex-wrap gap-1 mt-1">
							{completedTests.map((test) => (
								<Badge key={test} variant="secondary" className="text-xs">
									{test.toUpperCase()}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
