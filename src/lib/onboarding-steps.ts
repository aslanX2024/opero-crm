import { DriveStep } from "driver.js";

export const DASHBOARD_STEPS: DriveStep[] = [
    {
        element: "#dashboard-header",
        popover: {
            title: "Hoş Geldiniz! 👋",
            description: "OPERO CRM Dashboard'una hoş geldiniz. Hızlı bir tura ne dersiniz?",
            side: "bottom",
            align: "start",
        },
    },
    {
        element: "#stats-cards",
        popover: {
            title: "Genel Bakış",
            description: "Burada portföyünüzün durumu, aktif müşterileriniz ve bekleyen işleriniz hakkında anlık bilgi alabilirsiniz.",
            side: "bottom",
            align: "start",
        },
    },
    {
        element: "#quick-actions",
        popover: {
            title: "Hızlı İşlemler",
            description: "Yeni mülk veya müşteri eklemek için bu butonları kullanabilirsiniz.",
            side: "left",
            align: "start",
        },
    },
    {
        element: "#pipeline-summary",
        popover: {
            title: "Satış Hunisi",
            description: "Devam eden satışlarınızın hangi aşamada olduğunu buradan takip edebilirsiniz.",
            side: "top",
            align: "start",
        },
    },
    {
        element: "#recent-activity",
        popover: {
            title: "Son Aktiviteler",
            description: "Ekibinizin ve sizin son yaptığınız işlemleri buradan görebilirsiniz.",
            side: "top",
            align: "start",
        },
    },
];

export const PORTFOLIO_STEPS: DriveStep[] = [
    {
        element: "#portfolio-header",
        popover: {
            title: "Portföy Yönetimi",
            description: "Tüm mülklerinizi buradan yönetebilir, filtreleyebilir ve düzenleyebilirsiniz.",
            side: "bottom",
            align: "start",
        },
    },
    {
        element: "#view-toggles",
        popover: {
            title: "Görünüm Seçenekleri",
            description: "Mülklerinizi liste, grid veya harita üzerinde görüntüleyebilirsiniz.",
            side: "bottom",
            align: "start",
        },
    },
    {
        element: "#export-btn",
        popover: {
            title: "Raporlama",
            description: "Seçili mülklerin veya tüm portföyün PDF raporunu buradan alabilirsiniz.",
            side: "left",
            align: "start",
        },
    },
];
