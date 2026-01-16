"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Building2,
    UserCheck,
    TrendingUp,
    Search,
    ChevronRight,
    Phone,
    Mail,
    ArrowUpDown,
    UserPlus,
    Link as LinkIcon,
    Copy,
    Check,
    Crown,
    Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getBrokerConsultants, ConsultantDetail } from "@/services/broker-consultant-service";
import { useAuth } from "@/context/auth-context";

// Roller
type TeamRole = "danisman" | "mudur" | "broker";

const ROLE_LABELS: Record<TeamRole, { label: string; color: string; icon: typeof Users }> = {
    broker: { label: "Broker", color: "bg-amber-100 text-amber-700", icon: Crown },
    mudur: { label: "Müdür", color: "bg-purple-100 text-purple-700", icon: Shield },
    danisman: { label: "Danışman", color: "bg-blue-100 text-blue-700", icon: Users },
};

// XP'den seviye çıkar
function getLevel(xp: number): string {
    if (xp >= 10000) return "Master";
    if (xp >= 5000) return "Uzman";
    if (xp >= 2000) return "Danışman";
    return "Çaylak";
}

// Para formatla
function formatCurrency(value: number): string {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function TeamPage() {
    const { user } = useAuth();
    const [consultants, setConsultants] = useState<ConsultantDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "sales" | "properties">("sales");
    const [copied, setCopied] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<TeamRole>("danisman");

    useEffect(() => {
        async function loadConsultants() {
            if (!user) return;
            setLoading(true);
            const data = await getBrokerConsultants(user.id);
            setConsultants(data);
            setLoading(false);
        }
        loadConsultants();
    }, [user]);

    // Davet linki oluştur
    const getInviteLink = () => {
        const brokerEmail = user?.email || "";
        return `${window.location.origin}/register?broker=${encodeURIComponent(brokerEmail)}&role=${inviteRole}`;
    };

    // Linki kopyala
    const handleCopyLink = () => {
        navigator.clipboard.writeText(getInviteLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // E-posta ile davet gönder (placeholder - gerçek implementasyon için backend gerekli)
    const handleSendInvite = () => {
        if (!inviteEmail) {
            alert("E-posta adresi gerekli");
            return;
        }
        // TODO: Backend'e davet isteği gönder
        alert(`Davet ${inviteEmail} adresine gönderildi`);
        setInviteEmail("");
        setShowInviteDialog(false);
    };

    // Filtreleme ve sıralama
    const filteredConsultants = consultants
        .filter((c) =>
            c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return (a.full_name || "").localeCompare(b.full_name || "");
                case "sales":
                    return (b.totalSales || 0) - (a.totalSales || 0);
                case "properties":
                    return (b.propertyCount || 0) - (a.propertyCount || 0);
                default:
                    return 0;
            }
        });

    // Toplam istatistikler
    const totalStats = {
        consultants: consultants.length,
        properties: consultants.reduce((sum, c) => sum + (c.propertyCount || 0), 0),
        customers: consultants.reduce((sum, c) => sum + (c.customerCount || 0), 0),
        sales: consultants.reduce((sum, c) => sum + (c.totalSales || 0), 0),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-7 h-7 text-blue-600" />
                        Ekip Yönetimi
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Ekibinizdeki üyeleri yönetin ve performanslarını takip edin
                    </p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Ekip Üyesi Ekle
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Yeni Ekip Üyesi Davet Et</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                {/* Rol Seçimi */}
                                <div>
                                    <Label>Rol</Label>
                                    <Select
                                        value={inviteRole}
                                        onValueChange={(v) => setInviteRole(v as TeamRole)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="danisman">Danışman</SelectItem>
                                            <SelectItem value="mudur">Müdür</SelectItem>
                                            <SelectItem value="broker">Broker / Yönetici</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Davet Linki */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <LinkIcon className="w-4 h-4 text-blue-600" />
                                        <span className="font-medium text-blue-900 dark:text-blue-100">Davet Linki</span>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                        Bu linki paylaşarak yeni ekip üyesi ekleyebilirsiniz
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            value={getInviteLink()}
                                            className="text-xs bg-white dark:bg-gray-900"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleCopyLink}
                                            className="shrink-0"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* E-posta ile Davet */}
                                <div className="border-t pt-4">
                                    <Label>E-posta ile Davet</Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            type="email"
                                            placeholder="ornek@email.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                        />
                                        <Button onClick={handleSendInvite} className="shrink-0">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Gönder
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/broker">
                            ← Dashboard
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Davet Linki Banner */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium text-blue-900 dark:text-blue-100">
                                Hızlı Davet Linki
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                Bu linki paylaşarak yeni danışman ekleyebilirsiniz
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => {
                            setInviteRole("danisman");
                            handleCopyLink();
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Kopyalandı
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" />
                                Linki Kopyala
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalStats.consultants}</p>
                                <p className="text-sm text-gray-500">Ekip Üyesi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalStats.properties}</p>
                                <p className="text-sm text-gray-500">Toplam İlan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <UserCheck className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{totalStats.customers}</p>
                                <p className="text-sm text-gray-500">Toplam Müşteri</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                <TrendingUp className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{formatCurrency(totalStats.sales)}</p>
                                <p className="text-sm text-gray-500">Toplam Satış</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtreleme */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle>Ekip Listesi</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Ekip üyesi ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 w-64"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <ArrowUpDown className="w-4 h-4 mr-2" />
                                        Sırala
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSortBy("sales")}>
                                        Satışa Göre
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("properties")}>
                                        İlan Sayısına Göre
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                                        İsme Göre
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredConsultants.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">Henüz ekip üyesi bulunmuyor</p>
                            <p className="text-sm mb-4">
                                Yukarıdaki "Ekip Üyesi Ekle" butonunu kullanarak yeni üye davet edebilirsiniz
                            </p>
                            <Button onClick={() => setShowInviteDialog(true)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                İlk Ekip Üyesini Davet Et
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredConsultants.map((consultant) => (
                                <div
                                    key={consultant.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={consultant.avatar_url} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {consultant.full_name?.slice(0, 2).toUpperCase() || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{consultant.full_name || "İsimsiz"}</p>
                                                <Badge className={ROLE_LABELS[consultant.role as TeamRole]?.color || ROLE_LABELS.danisman.color}>
                                                    {ROLE_LABELS[consultant.role as TeamRole]?.label || "Danışman"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{consultant.email}</p>
                                        </div>
                                        <Badge variant="outline" className="ml-2">
                                            {getLevel(consultant.xp || 0)}
                                        </Badge>
                                    </div>

                                    <div className="hidden md:flex items-center gap-8 text-sm">
                                        <div className="text-center">
                                            <p className="font-semibold">{consultant.propertyCount}</p>
                                            <p className="text-gray-500">İlan</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{consultant.customerCount}</p>
                                            <p className="text-gray-500">Müşteri</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold">{formatCurrency(consultant.totalSales || 0)}</p>
                                            <p className="text-gray-500">Satış</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={`mailto:${consultant.email}`}>
                                                <Mail className="w-4 h-4" />
                                            </a>
                                        </Button>
                                        {consultant.phone && (
                                            <Button variant="ghost" size="icon" asChild>
                                                <a href={`tel:${consultant.phone}`}>
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        <Link href={`/dashboard/broker/consultants/${consultant.id}`}>
                                            <Button variant="ghost" size="icon">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
