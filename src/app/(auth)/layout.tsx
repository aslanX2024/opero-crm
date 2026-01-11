// Auth sayfaları için ortak layout
// Giriş yapılmamış kullanıcılar için basit arka plan
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Dekoratif arka plan elementleri */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
            </div>

            {/* Sayfa içeriği */}
            <div className="relative z-10 w-full max-w-md px-4">
                {children}
            </div>
        </div>
    );
}
