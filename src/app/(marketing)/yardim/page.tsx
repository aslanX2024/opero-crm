import { Metadata } from "next";
import Link from "next/link";
import {
    Book,
    MessageCircle,
    Phone,
    Mail,
    FileText,
    Video,
    HelpCircle,
    ChevronRight,
    Search,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Yardım Merkezi",
    description: "OPERO CRM yardım merkezi. Sık sorulan sorular, kılavuzlar ve destek.",
};

const helpCategories = [
    {
        icon: Book,
        title: "Başlangıç Rehberi",
        description: "OPERO'yu kullanmaya başlamak için temel adımlar",
        links: [
            { title: "Hesap Oluşturma", href: "#" },
            { title: "İlk Portföy Ekleme", href: "#" },
            { title: "Müşteri Kaydı", href: "#" },
        ],
    },
    {
        icon: FileText,
        title: "Portföy Yönetimi",
        description: "Mülk ekleme, düzenleme ve yönetme",
        links: [
            { title: "Mülk Detayları", href: "#" },
            { title: "Fotoğraf Yükleme", href: "#" },
            { title: "Durum Güncelleme", href: "#" },
        ],
    },
    {
        icon: MessageCircle,
        title: "Müşteri İlişkileri",
        description: "Müşteri takibi ve iletişim yönetimi",
        links: [
            { title: "Müşteri Ekleme", href: "#" },
            { title: "Lead Puanlama", href: "#" },
            { title: "İletişim Geçmişi", href: "#" },
        ],
    },
    {
        icon: Video,
        title: "Video Eğitimler",
        description: "Adım adım video anlatımlar",
        links: [
            { title: "Hızlı Başlangıç (5 dk)", href: "#" },
            { title: "Pipeline Kullanımı", href: "#" },
            { title: "Raporlar", href: "#" },
        ],
    },
];

export default function YardimPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Yardım Merkezi
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        OPERO'yu en iyi şekilde kullanmak için ihtiyacınız olan tüm kaynaklar burada.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Ne arıyorsunuz?"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {helpCategories.map((category) => (
                            <div
                                key={category.title}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <category.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {category.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {category.links.map((link) => (
                                        <li key={link.title}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-1"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                                {link.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Hâlâ Yardıma mı İhtiyacınız Var?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Destek ekibimiz size yardımcı olmaktan mutluluk duyar.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:destek@opero.tr"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Mail className="w-5 h-5" />
                            destek@opero.tr
                        </a>
                        <a
                            href="tel:03128700800"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Phone className="w-5 h-5" />
                            0 312 870 0 800
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
