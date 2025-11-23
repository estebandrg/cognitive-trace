export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
            {/* Animated gradient background - matching landing page style */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl" />
            </div>

            {/* Auth card with gradient border effect */}
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur opacity-75" />
                <div className="relative rounded-2xl border bg-card/95 p-8 shadow-2xl backdrop-blur-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
