import { Metadata } from "next";
import { MarketingNavbar, MarketingFooter } from "@/components/marketing";

export const metadata: Metadata = {
    title: {
        default: "OPERO - Emlak Danışmanları için CRM",
        template: "%s | OPERO",
    },
    description:
        "Türkiye'nin lider emlak CRM platformu. Portföy yönetimi, müşteri takibi, satış pipeline ve ekip performansı tek platformda.",
    keywords: [
        "emlak crm",
        "gayrimenkul crm",
        "emlak yazılımı",
        "emlak danışmanı",
        "gayrimenkul yazılımı",
        "emlak ofisi yönetimi",
        "portföy yönetimi",
        "müşteri takibi",
    ],
    authors: [{ name: "OPERO" }],
    creator: "OPERO",
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: "https://opero.tr",
        siteName: "OPERO",
        title: "OPERO - Emlak Danışmanları için CRM",
        description:
            "Türkiye'nin lider emlak CRM platformu. Satışlarınızı 2x artırın.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "OPERO CRM",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "OPERO - Emlak Danışmanları için CRM",
        description: "Türkiye'nin lider emlak CRM platformu.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <MarketingNavbar />
            <main>{children}</main>
            <MarketingFooter />
        </div>
    );
}
