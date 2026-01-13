import { Metadata } from "next";
import Link from "next/link";
import { Code, Book, Lock, Zap, ExternalLink, FileJson } from "lucide-react";

export const metadata: Metadata = {
    title: "API Dokümantasyon",
    description: "OPERO CRM API dokümantasyonu. REST API ile entegrasyon yapın.",
};

const apiEndpoints = [
    {
        method: "GET",
        path: "/api/v1/properties",
        description: "Tüm mülkleri listele",
    },
    {
        method: "POST",
        path: "/api/v1/properties",
        description: "Yeni mülk oluştur",
    },
    {
        method: "GET",
        path: "/api/v1/customers",
        description: "Tüm müşterileri listele",
    },
    {
        method: "POST",
        path: "/api/v1/customers",
        description: "Yeni müşteri ekle",
    },
    {
        method: "GET",
        path: "/api/v1/deals",
        description: "Pipeline fırsatlarını listele",
    },
];

export default function ApiDocsPage() {
    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Code className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        API Dokümantasyon
                    </h1>
                    <p className="text-lg text-gray-400 mb-8">
                        OPERO REST API ile kendi uygulamalarınızı entegre edin.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <span className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-mono">
                            v1.0 Stable
                        </span>
                        <span className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg text-sm font-mono">
                            REST API
                        </span>
                    </div>
                </div>
            </section>

            {/* Coming Soon Notice */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
                        <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            API Yakında Kullanıma Açılıyor
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
                            OPERO API şu anda geliştirme aşamasındadır. Enterprise planına sahip kullanıcılar için
                            yakında erişime açılacaktır. Bildirim almak için aşağıya e-posta adresinizi bırakın.
                        </p>
                        <div className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="E-posta adresiniz"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            />
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium">
                                Bildir
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Preview Endpoints */}
            <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Planlanan Endpoint'ler
                    </h2>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {apiEndpoints.map((endpoint, index) => (
                                <div key={index} className="flex items-center gap-4 p-4">
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${endpoint.method === "GET"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            }`}
                                    >
                                        {endpoint.method}
                                    </span>
                                    <code className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                                        {endpoint.path}
                                    </code>
                                    <span className="ml-auto text-sm text-gray-500">
                                        {endpoint.description}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6">
                            <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Güvenli Kimlik Doğrulama
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                OAuth 2.0 ve API key tabanlı güvenlik
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <FileJson className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                JSON Formatı
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Standart JSON request/response
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <Book className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Detaylı Dokümantasyon
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Örneklerle zenginleştirilmiş rehberler
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
