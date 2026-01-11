"use client";

import { useState } from "react";
import {
    Users,
    UserPlus,
    Mail,
    Link as LinkIcon,
    Copy,
    Check,
    MoreVertical,
    Trash2,
    Shield,
    Crown,
    AlertTriangle,
} from "lucide-react";
import { useWorkspace } from "@/context/workspace-context";
import { DemoRestriction } from "@/components/demo/demo-restriction";
import { DEMO_AGENTS } from "@/lib/demo-data";
import { ROLE_PERMISSIONS, WorkspaceRole } from "@/types/workspace";

// Demo ekip üyeleri
const DEMO_TEAM_MEMBERS = [
    {
        id: "user-1",
        name: "Demo Kullanıcı",
        email: "demo@opero.tr",
        role: "broker" as WorkspaceRole,
        avatar: null,
        joinedAt: "2025-06-15",
        status: "active",
        stats: { properties: 12, customers: 38, sales: 8 },
    },
    {
        id: "user-2",
        name: "Ali Yılmaz",
        email: "ali@opero.tr",
        role: "danisman" as WorkspaceRole,
        avatar: null,
        joinedAt: "2025-08-20",
        status: "active",
        stats: { properties: 18, customers: 45, sales: 12 },
    },
    {
        id: "user-3",
        name: "Zeynep Kaya",
        email: "zeynep@opero.tr",
        role: "danisman" as WorkspaceRole,
        avatar: null,
        joinedAt: "2025-09-10",
        status: "active",
        stats: { properties: 8, customers: 22, sales: 3 },
    },
    {
        id: "user-4",
        name: "Mehmet Demir",
        email: "mehmet@opero.tr",
        role: "danisman" as WorkspaceRole,
        avatar: null,
        joinedAt: "2025-11-05",
        status: "pending",
        stats: { properties: 0, customers: 0, sales: 0 },
    },
];

export default function TeamSettingsPage() {
    const { workspace, isBroker, isDemoMode, canManageMembers } = useWorkspace();
    const [members] = useState(DEMO_TEAM_MEMBERS);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<WorkspaceRole>("danisman");
    const [copied, setCopied] = useState(false);

    // Davet linkini kopyala
    const handleCopyLink = () => {
        const inviteLink = `${window.location.origin}/join?code=demo-invite-code`;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Yetki kontrolü
    if (!isBroker) {
        return (
            <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Erişim Yok</h2>
                <p className="text-muted-foreground">
                    Bu sayfaya sadece broker/yönetici erişebilir.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Ekip Yönetimi</h2>
                    <p className="text-muted-foreground text-sm">
                        Ekip üyelerini yönetin ve yeni danışman ekleyin
                    </p>
                </div>
                <DemoRestriction action="invite">
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <UserPlus className="h-4 w-4" />
                        Davet Et
                    </button>
                </DemoRestriction>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-2xl font-bold">{members.length}</div>
                    <div className="text-sm text-muted-foreground">Toplam Üye</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-2xl font-bold">
                        {members.filter((m) => m.status === "active").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Aktif</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-2xl font-bold">
                        {members.filter((m) => m.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Bekleyen</div>
                </div>
            </div>

            {/* Invite Link */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                        <div>
                            <div className="font-medium text-blue-900 dark:text-blue-100">
                                Davet Linki
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                Bu linki paylaşarak yeni danışman ekleyebilirsiniz
                            </div>
                        </div>
                    </div>
                    <DemoRestriction action="invite">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Kopyalandı
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Linki Kopyala
                                </>
                            )}
                        </button>
                    </DemoRestriction>
                </div>
            </div>

            {/* Members List */}
            <div className="border rounded-lg divide-y">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                                {member.name.charAt(0)}
                            </div>

                            {/* Info */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{member.name}</span>
                                    {member.role === "broker" && (
                                        <Crown className="h-4 w-4 text-amber-500" />
                                    )}
                                    {member.status === "pending" && (
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                            Bekliyor
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {member.email}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="text-center">
                                <div className="font-medium text-foreground">
                                    {member.stats.properties}
                                </div>
                                <div className="text-xs">Portföy</div>
                            </div>
                            <div className="text-center">
                                <div className="font-medium text-foreground">
                                    {member.stats.customers}
                                </div>
                                <div className="text-xs">Müşteri</div>
                            </div>
                            <div className="text-center">
                                <div className="font-medium text-foreground">
                                    {member.stats.sales}
                                </div>
                                <div className="text-xs">Satış</div>
                            </div>
                        </div>

                        {/* Role Badge */}
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-xs px-2 py-1 rounded ${member.role === "broker"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {ROLE_PERMISSIONS[member.role].label}
                            </span>

                            {/* Actions */}
                            {member.role !== "broker" && (
                                <DemoRestriction action="delete">
                                    <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </DemoRestriction>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Yeni Üye Davet Et</h3>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    E-posta Adresi
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="ornek@email.com"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Rol</label>
                                <select
                                    value={inviteRole}
                                    onChange={(e) =>
                                        setInviteRole(e.target.value as WorkspaceRole)
                                    }
                                    className="w-full px-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="danisman">Danışman</option>
                                    <option value="broker">Broker / Yönetici</option>
                                </select>
                            </div>

                            {/* Demo Warning */}
                            {isDemoMode && (
                                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                        Demo modunda davet gönderilemez
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                                İptal
                            </button>
                            <DemoRestriction action="invite">
                                <button
                                    disabled={!inviteEmail}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    Davet Gönder
                                </button>
                            </DemoRestriction>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
