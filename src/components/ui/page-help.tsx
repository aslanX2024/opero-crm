"use client";

import { useState, useEffect } from "react";
import { HelpCircle, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Sayfa yardım içerikleri
export const PAGE_HELP_CONTENT: Record<string, PageHelpData> = {
    "/dashboard": {
        title: "Dashboard Kullanımı",
        description: "Ana paneliniz - tüm verilerinizi tek bakışta görün",
        steps: [
            { title: "Özet Kartları", description: "Portföy, müşteri ve fırsat sayılarınızı takip edin" },
            { title: "Görevler", description: "Bugünkü ve yaklaşan görevlerinizi görün" },
            { title: "Son Aktiviteler", description: "En son yapılan işlemleri takip edin" },
            { title: "Hızlı Ekle", description: "Sağ üstteki + butonuyla hızlıca yeni kayıt ekleyin" },
        ],
    },
    "/dashboard/portfolio": {
        title: "Portföy Yönetimi",
        description: "Mülklerinizi ekleyin, düzenleyin ve yönetin",
        steps: [
            { title: "Yeni Mülk Ekle", description: "Sağ üstteki 'Yeni Mülk Ekle' butonunu kullanın" },
            { title: "Görünüm Seçimi", description: "Grid, liste veya harita görünümü arasında geçiş yapın" },
            { title: "Filtreleme", description: "Tip, durum ve fiyat aralığına göre filtreleyin" },
            { title: "PDF Rapor", description: "Filtrelenmiş mülkleri PDF olarak dışa aktarın" },
        ],
    },
    "/dashboard/customers": {
        title: "Müşteri Yönetimi",
        description: "Müşterilerinizi takip edin ve ilişkilerinizi yönetin",
        steps: [
            { title: "Lead Skoru", description: "Müşterilerin sıcaklık derecesini (Sıcak/Ilık/Soğuk) takip edin" },
            { title: "Tab'lar", description: "Alıcı, satıcı, kiracı ve yatırımcı gruplarını görün" },
            { title: "İletişim Takibi", description: "Son iletişim tarihini ve gecikmeleri izleyin" },
            { title: "Hızlı Aksiyonlar", description: "Arama, WhatsApp ve gösterim planlamayı kullanın" },
        ],
    },
    "/dashboard/pipeline": {
        title: "Satış Pipeline",
        description: "Fırsatlarınızı kanban tahtasında yönetin",
        steps: [
            { title: "Sürükle-Bırak", description: "Fırsatları aşamalar arasında sürükleyerek taşıyın" },
            { title: "Aşamalar", description: "İlk İletişim → Görüşme → Teklif → Müzakere → Kapandı" },
            { title: "Filtreler", description: "Danışman, zaman aralığı ve fiyat aralığına göre filtreleyin" },
            { title: "Detay Görünümü", description: "Kartlara tıklayarak detayları görün" },
        ],
    },
    "/dashboard/appointments": {
        title: "Randevu Yönetimi",
        description: "Gösterimlerinizi ve toplantılarınızı planlayın",
        steps: [
            { title: "Takvim Görünümü", description: "Günlük, haftalık veya aylık takvimde görüntüleyin" },
            { title: "Yeni Randevu", description: "Sağ üstteki butonu kullanarak yeni randevu oluşturun" },
            { title: "Randevu Türleri", description: "Gösterim, toplantı veya diğer etkinlik türlerini seçin" },
            { title: "Hatırlatmalar", description: "Otomatik bildirimler alın" },
        ],
    },
    "/dashboard/finance": {
        title: "Finans Yönetimi",
        description: "Gelir, gider ve komisyonlarınızı takip edin",
        steps: [
            { title: "Özet Kartları", description: "Toplam gelir, bekleyen ve tahsil edilen komisyonları görün" },
            { title: "Hedef Takibi", description: "Aylık hedeflerinize ne kadar yaklaştığınızı izleyin" },
            { title: "Son İşlemler", description: "En son komisyon ve ödeme kayıtlarını görün" },
        ],
    },
    "/dashboard/broker": {
        title: "Broker Dashboard",
        description: "Ofisinizi ve danışmanlarınızı yönetin",
        steps: [
            { title: "Ofis Metrikleri", description: "Toplam satış, aktif portföy ve danışman istatistiklerini görün" },
            { title: "Danışman Yönetimi", description: "Danışmanlarınızın performansını takip edin" },
            { title: "Ofis Finansı", description: "Ofis giderlerini ve gelirlerini yönetin" },
            { title: "Davet Linki", description: "Yeni danışmanları ofise davet edin" },
        ],
    },
    "/dashboard/broker/consultants": {
        title: "Danışman Yönetimi",
        description: "Ofisinize kayıtlı danışmanları görüntüleyin",
        steps: [
            { title: "Danışman Listesi", description: "Tüm danışmanlarınızı ve performanslarını görün" },
            { title: "Detay Görünümü", description: "Danışmana tıklayarak detaylarını inceleyin" },
            { title: "Sıralama", description: "İsim, satış veya mülk sayısına göre sıralayın" },
        ],
    },
    "/dashboard/broker/finance": {
        title: "Ofis Finansı",
        description: "Ofis giderlerinizi takip edin ve yönetin",
        steps: [
            { title: "Gider Ekle", description: "Kira, maaş, fatura gibi giderleri kaydedin" },
            { title: "Kategori Dağılımı", description: "Giderlerin kategori bazlı dağılımını görün" },
            { title: "Tekrarlı Giderler", description: "Aylık, 3 aylık veya yıllık tekrarlayan giderleri işaretleyin" },
            { title: "Durum Takibi", description: "Bekleyen ve ödenen giderleri ayırt edin" },
        ],
    },
};

interface PageHelpStep {
    title: string;
    description: string;
}

interface PageHelpData {
    title: string;
    description: string;
    steps: PageHelpStep[];
}

interface PageHelpProps {
    pageKey?: string;
    customContent?: PageHelpData;
}

const STORAGE_KEY_PREFIX = "opero_page_help_dismissed_";

export function PageHelp({ pageKey, customContent }: PageHelpProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDismissed, setIsDismissed] = useState(true); // Start as dismissed, check localStorage

    // Get help content
    const helpContent = customContent || (pageKey ? PAGE_HELP_CONTENT[pageKey] : null);

    useEffect(() => {
        if (!pageKey) return;

        const storageKey = `${STORAGE_KEY_PREFIX}${pageKey}`;
        const dismissed = localStorage.getItem(storageKey);

        if (!dismissed) {
            // First visit - show help badge pulse
            setIsDismissed(false);
        }
    }, [pageKey]);

    const handleDismiss = () => {
        if (pageKey) {
            const storageKey = `${STORAGE_KEY_PREFIX}${pageKey}`;
            localStorage.setItem(storageKey, "true");
        }
        setIsDismissed(true);
        setIsOpen(false);
    };

    if (!helpContent) return null;

    return (
        <>
            {/* Help Button */}
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "relative h-9 w-9 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    !isDismissed && "ring-2 ring-blue-400 ring-offset-2"
                )}
                onClick={() => setIsOpen(true)}
                title="Sayfa Yardımı"
            >
                <HelpCircle className="w-5 h-5 text-blue-600" />
                {!isDismissed && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                )}
            </Button>

            {/* Help Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <HelpCircle className="w-6 h-6 text-blue-600" />
                            {helpContent.title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        <p className="text-gray-600 dark:text-gray-400">
                            {helpContent.description}
                        </p>

                        <div className="space-y-3">
                            {helpContent.steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                                >
                                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                            {step.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <p className="text-sm text-gray-500">
                                Bu bildirim bir kez gösterilir.
                            </p>
                            <Button onClick={handleDismiss}>
                                Anladım
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
