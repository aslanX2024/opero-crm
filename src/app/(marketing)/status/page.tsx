import { Metadata } from "next";
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity } from "lucide-react";

export const metadata: Metadata = {
    title: "Sistem Durumu",
    description: "OPERO CRM sistem durumu ve servis sağlığı.",
};

const services = [
    { name: "Web Uygulaması", status: "operational", uptime: "99.99%" },
    { name: "API Servisleri", status: "operational", uptime: "99.98%" },
    { name: "Veritabanı", status: "operational", uptime: "99.99%" },
    { name: "Dosya Depolama", status: "operational", uptime: "99.97%" },
    { name: "E-posta Servisi", status: "operational", uptime: "99.95%" },
    { name: "Bildirim Sistemi", status: "operational", uptime: "99.96%" },
];

const recentIncidents = [
    {
        date: "10 Ocak 2026",
        title: "Planlı Bakım",
        description: "Sistem güncellemeleri için kısa süreli bakım yapıldı.",
        status: "resolved",
        duration: "15 dakika",
    },
];

function getStatusIcon(status: string) {
    switch (status) {
        case "operational":
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case "degraded":
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case "outage":
            return <XCircle className="w-5 h-5 text-red-500" />;
        default:
            return <Clock className="w-5 h-5 text-gray-500" />;
    }
}

function getStatusText(status: string) {
    switch (status) {
        case "operational":
            return "Çalışıyor";
        case "degraded":
            return "Yavaşlama";
        case "outage":
            return "Kesinti";
        default:
            return "Bilinmiyor";
    }
}

export default function StatusPage() {
    const allOperational = services.every((s) => s.status === "operational");

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${allOperational
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-yellow-100 dark:bg-yellow-900/30"
                            }`}
                    >
                        {allOperational ? (
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        ) : (
                            <AlertTriangle className="w-10 h-10 text-yellow-600" />
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {allOperational ? "Tüm Sistemler Çalışıyor" : "Bazı Sistemlerde Sorun Var"}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Son güncelleme: {new Date().toLocaleString("tr-TR")}
                    </p>
                </div>
            </section>

            {/* Services Status */}
            <section className="py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Servis Durumu
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {services.map((service) => (
                                <div
                                    key={service.name}
                                    className="flex items-center justify-between p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(service.status)}
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {service.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">
                                            Uptime: {service.uptime}
                                        </span>
                                        <span
                                            className={`text-sm font-medium ${service.status === "operational"
                                                    ? "text-green-600"
                                                    : service.status === "degraded"
                                                        ? "text-yellow-600"
                                                        : "text-red-600"
                                                }`}
                                        >
                                            {getStatusText(service.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Uptime Chart Placeholder */}
            <section className="py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Son 90 Gün Uptime
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-1">
                            {Array.from({ length: 90 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 h-8 bg-green-500 rounded-sm"
                                    title={`${90 - i} gün önce: 100% uptime`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>90 gün önce</span>
                            <span>Bugün</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Incidents */}
            <section className="py-8 px-4 pb-20">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        Son Olaylar
                    </h2>
                    {recentIncidents.length === 0 ? (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center">
                            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                            <p className="text-green-800 dark:text-green-400">
                                Son 90 günde herhangi bir olay yaşanmadı.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentIncidents.map((incident, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {incident.title}
                                        </h3>
                                        <span className="text-sm text-gray-500">{incident.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {incident.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-green-600 font-medium">
                                            ✓ Çözüldü
                                        </span>
                                        <span className="text-gray-500">
                                            Süre: {incident.duration}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
