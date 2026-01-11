"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Globe,
    Link2,
    Link2Off,
    RefreshCw,
    Settings,
    Eye,
    MessageSquare,
    Check,
    X,
    AlertCircle,
    Clock,
    ExternalLink,
    Upload,
    Download,
    Building2,
    ChevronDown,
    ChevronUp,
    Key,
    Loader2,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
    Portal,
    PortalListing,
    SyncLog,
    DEMO_PORTALS,
    DEMO_PORTAL_LISTINGS,
    DEMO_SYNC_LOGS,
    PORTAL_STATUSES,
    LISTING_STATUSES,
    SYNC_FREQUENCIES,
    SyncFrequency,
} from "@/types/portal";

export default function PortalsPage() {
    const [portals, setPortals] = useState<Portal[]>(DEMO_PORTALS);
    const [listings, setListings] = useState<PortalListing[]>(DEMO_PORTAL_LISTINGS);
    const [syncLogs, setSyncLogs] = useState<SyncLog[]>(DEMO_SYNC_LOGS);
    const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [connectingPortal, setConnectingPortal] = useState<Portal | null>(null);
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionSuccess, setConnectionSuccess] = useState<boolean | null>(null);
    const [syncing, setSyncing] = useState<string | null>(null);
    const [showListings, setShowListings] = useState(false);

    // Portal bağlantı kurma
    const openConnectModal = (portal: Portal) => {
        setConnectingPortal(portal);
        setApiKeyInput("");
        setConnectionSuccess(null);
        setConnectModalOpen(true);
    };

    // Bağlantı test et
    const testConnection = async () => {
        if (!apiKeyInput.trim()) return;

        setTestingConnection(true);
        // Simüle API testi
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Demo: API key "test" ile bağlantı hatalı, diğerleri başarılı
        const success = apiKeyInput !== "test";
        setConnectionSuccess(success);
        setTestingConnection(false);
    };

    // Bağlantı kaydet
    const saveConnection = () => {
        if (!connectingPortal || !connectionSuccess) return;

        setPortals(prev => prev.map(p =>
            p.id === connectingPortal.id
                ? { ...p, status: "connected", api_key: apiKeyInput, last_sync: new Date().toISOString() }
                : p
        ));
        setConnectModalOpen(false);
        setConnectingPortal(null);
    };

    // Bağlantı kes
    const disconnectPortal = (portalId: string) => {
        if (confirm("Bu portalın bağlantısını kesmek istediğinizden emin misiniz?")) {
            setPortals(prev => prev.map(p =>
                p.id === portalId
                    ? { ...p, status: "disconnected", api_key: undefined, auto_sync: false }
                    : p
            ));
        }
    };

    // Manuel senkronizasyon
    const syncPortal = async (portalId: string) => {
        setSyncing(portalId);
        await new Promise(resolve => setTimeout(resolve, 3000));

        setPortals(prev => prev.map(p =>
            p.id === portalId
                ? { ...p, last_sync: new Date().toISOString() }
                : p
        ));

        setSyncing(null);
        alert("Senkronizasyon tamamlandı!");
    };

    // Ayarları güncelle
    const updatePortalSettings = (portalId: string, updates: Partial<Portal>) => {
        setPortals(prev => prev.map(p =>
            p.id === portalId ? { ...p, ...updates } : p
        ));
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Portal Entegrasyonları</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Emlak portallarına ilan yayını yapın
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        CSV İçe Aktar
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Dışa Aktar
                    </Button>
                </div>
            </div>

            {/* Portal Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portals.map((portal) => (
                    <PortalCard
                        key={portal.id}
                        portal={portal}
                        syncing={syncing === portal.id}
                        onConnect={() => openConnectModal(portal)}
                        onDisconnect={() => disconnectPortal(portal.id)}
                        onSync={() => syncPortal(portal.id)}
                        onSettings={() => setSelectedPortal(portal)}
                        onUpdateSettings={(updates) => updatePortalSettings(portal.id, updates)}
                    />
                ))}
            </div>

            {/* İlan Eşleştirme Bölümü */}
            <Card>
                <CardHeader
                    className="cursor-pointer"
                    onClick={() => setShowListings(!showListings)}
                >
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            İlan Eşleştirme Tablosu
                        </span>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{listings.length} eşleşme</Badge>
                            {showListings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                    </CardTitle>
                </CardHeader>
                {showListings && (
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mülk</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Portal</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">İlan No</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görüntülenme</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Güncelleme</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {listings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="px-4 py-4">
                                                <Link href={`/dashboard/portfolio/${listing.property_id}`} className="font-medium text-sm hover:text-blue-600">
                                                    {listing.property_title}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-sm">{listing.portal_name}</td>
                                            <td className="px-4 py-4">
                                                {listing.portal_listing_id ? (
                                                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                        {listing.portal_listing_id}
                                                    </code>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge className={LISTING_STATUSES[listing.status].color}>
                                                    {LISTING_STATUSES[listing.status].label}
                                                </Badge>
                                                {listing.error_message && (
                                                    <p className="text-xs text-red-500 mt-1">{listing.error_message}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                {listing.views ? (
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {listing.views}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-blue-600">
                                                            <MessageSquare className="w-3 h-3" />
                                                            {listing.inquiries}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                {listing.last_updated
                                                    ? new Date(listing.last_updated).toLocaleDateString("tr-TR")
                                                    : "-"
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Senkronizasyon Logları */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Son Senkronizasyon Logları
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {syncLogs.slice(0, 5).map((log) => {
                            const portal = portals.find(p => p.id === log.portal_id);
                            return (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {log.status === "success" ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">{portal?.name}</p>
                                            <p className="text-sm text-gray-500">{log.message}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(log.timestamp).toLocaleString("tr-TR")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Bağlantı Kurma Modal */}
            {connectModalOpen && connectingPortal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setConnectModalOpen(false)} />
                    <Card className="relative w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5" />
                                {connectingPortal.name} Bağlantısı
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-500">{connectingPortal.description}</p>

                            <div className="space-y-2">
                                <Label htmlFor="apiKey">API Anahtarı</Label>
                                <div className="relative">
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        placeholder="API anahtarınızı girin..."
                                        value={apiKeyInput}
                                        onChange={(e) => {
                                            setApiKeyInput(e.target.value);
                                            setConnectionSuccess(null);
                                        }}
                                        className="pr-10"
                                    />
                                    <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Test sonucu */}
                            {connectionSuccess !== null && (
                                <div className={cn(
                                    "p-3 rounded-lg flex items-center gap-2",
                                    connectionSuccess
                                        ? "bg-green-50 text-green-700 dark:bg-green-900/20"
                                        : "bg-red-50 text-red-700 dark:bg-red-900/20"
                                )}>
                                    {connectionSuccess ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Bağlantı başarılı!</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            <span>Bağlantı başarısız. API anahtarını kontrol edin.</span>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={testConnection}
                                    disabled={!apiKeyInput || testingConnection}
                                    className="flex-1"
                                >
                                    {testingConnection ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                    )}
                                    Test Et
                                </Button>
                                <Button
                                    onClick={saveConnection}
                                    disabled={!connectionSuccess}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Kaydet
                                </Button>
                            </div>

                            <Button variant="ghost" className="w-full" onClick={() => setConnectModalOpen(false)}>
                                İptal
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Portal kartı
function PortalCard({
    portal,
    syncing,
    onConnect,
    onDisconnect,
    onSync,
    onSettings,
    onUpdateSettings,
}: {
    portal: Portal;
    syncing: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
    onSync: () => void;
    onSettings: () => void;
    onUpdateSettings: (updates: Partial<Portal>) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const statusInfo = PORTAL_STATUSES[portal.status];
    const isConnected = portal.status === "connected";

    return (
        <Card className={cn(
            "transition-all",
            !portal.is_available && "opacity-60"
        )}>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* Portal Logo Placeholder */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                            <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {portal.name}
                                <a href={portal.website} target="_blank" rel="noopener" className="text-gray-400 hover:text-blue-600">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </CardTitle>
                            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        </div>
                    </div>
                    {isConnected ? (
                        <Link2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Link2Off className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {isConnected ? (
                    <>
                        {/* İstatistikler */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{portal.active_listings}</p>
                                <p className="text-xs text-gray-500">Aktif İlan</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{portal.total_listings}</p>
                                <p className="text-xs text-gray-500">Toplam</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {portal.last_sync
                                        ? new Date(portal.last_sync).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })
                                        : "-"
                                    }
                                </p>
                                <p className="text-xs text-gray-500">Son Senkron</p>
                            </div>
                        </div>

                        {/* Aksiyonlar */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={onSync}
                                disabled={syncing}
                            >
                                {syncing ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                )}
                                Senkronize Et
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setExpanded(!expanded)}
                            >
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Ayarlar (genişletilmiş) */}
                        {expanded && (
                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Otomatik Senkronizasyon</Label>
                                        <p className="text-xs text-gray-500">İlanları otomatik güncelle</p>
                                    </div>
                                    <Switch
                                        checked={portal.auto_sync}
                                        onCheckedChange={(checked) => onUpdateSettings({ auto_sync: checked })}
                                    />
                                </div>

                                {portal.auto_sync && (
                                    <div className="space-y-2">
                                        <Label>Senkron Sıklığı</Label>
                                        <Select
                                            value={portal.sync_frequency}
                                            onValueChange={(v) => onUpdateSettings({ sync_frequency: v as SyncFrequency })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(SYNC_FREQUENCIES).map(([key, { label }]) => (
                                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-red-600 hover:bg-red-50"
                                    onClick={onDisconnect}
                                >
                                    <Link2Off className="w-4 h-4 mr-1" />
                                    Bağlantıyı Kes
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-500">{portal.description}</p>

                        {portal.is_available ? (
                            <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                onClick={onConnect}
                            >
                                <Link2 className="w-4 h-4 mr-2" />
                                Bağlantı Kur
                            </Button>
                        ) : (
                            <Button className="w-full" disabled>
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Partner Başvurusu Gerekli
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
