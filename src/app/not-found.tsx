import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center px-4">
            <div className="max-w-lg text-center">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[12rem] font-black text-gray-200 dark:text-gray-800 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                            <Home className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Sayfa Bulunamadı
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Ana Sayfa
                    </Link>
                    <Link
                        href="/iletisim"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <Search className="w-5 h-5" />
                        İletişim
                    </Link>
                </div>

                {/* Popular Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 mb-4">Popüler Sayfalar</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {[
                            { label: "Özellikler", href: "/ozellikler" },
                            { label: "Fiyatlandırma", href: "/fiyatlandirma" },
                            { label: "Demo", href: "/demo" },
                            { label: "Yardım", href: "/yardim" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
