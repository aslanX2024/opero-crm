import Link from "next/link";
import Image from "next/image";

const footerLinks = {
    urun: [
        { label: "Özellikler", href: "/ozellikler" },
        { label: "Fiyatlandırma", href: "/fiyatlandirma" },
        { label: "Demo Talep", href: "/demo" },
        { label: "SSS", href: "/sss" },
    ],
    sirket: [
        { label: "Hakkımızda", href: "/hakkimizda" },
        { label: "Blog", href: "/blog" },
        { label: "Referanslar", href: "/referanslar" },
        { label: "İletişim", href: "/iletisim" },
    ],
    destek: [
        { label: "Yardım Merkezi", href: "/yardim" },
        { label: "API Dokümantasyon", href: "/api" },
        { label: "Durum", href: "/status" },
    ],
    yasal: [
        { label: "Gizlilik Politikası", href: "/gizlilik" },
        { label: "Kullanım Koşulları", href: "/kosullar" },
        { label: "KVKK", href: "/kvkk" },
    ],
};

export function MarketingFooter() {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="py-12 lg:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {/* Brand */}
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="mb-4 inline-block">
                                <Image
                                    src="/logo-light.png"
                                    alt="OPERO"
                                    width={180}
                                    height={48}
                                    className="h-12 w-auto"
                                />
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Türkiye'nin lider emlak CRM platformu. Satışlarınızı artırın, müşterilerinizi takip edin.
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-4">
                                <a
                                    href="https://twitter.com/operotr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://linkedin.com/company/opero"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://instagram.com/operotr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Ürün</h4>
                            <ul className="space-y-3">
                                {footerLinks.urun.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Şirket</h4>
                            <ul className="space-y-3">
                                {footerLinks.sirket.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Destek</h4>
                            <ul className="space-y-3">
                                {footerLinks.destek.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Yasal</h4>
                            <ul className="space-y-3">
                                {footerLinks.yasal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2026 OPERO. Tüm hakları saklıdır.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                🇹🇷 Türkiye'de geliştirildi
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
