"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import type { Workspace, WorkspaceMember, WorkspaceRole, PlanType, BillingMode } from "@/types/workspace";
import { DEMO_WORKSPACE, DEMO_AGENTS, isDemoMode } from "@/lib/demo-data";

// Context tipi
interface WorkspaceContextType {
    // Workspace state
    workspace: Workspace | null;
    members: WorkspaceMember[];
    loading: boolean;

    // Kullanıcı rolü
    userRole: WorkspaceRole;
    isOwner: boolean;
    isBroker: boolean;

    // Demo mode
    isDemoMode: boolean;

    // Yetki kontrolleri
    canManageMembers: boolean;
    canManageBilling: boolean;
    canViewAllData: boolean;
    canDeleteData: boolean;

    // İşlemler
    refreshWorkspace: () => Promise<void>;
}

// Context oluştur
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Provider bileşeni
export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { user, profile, isDemoMode: authDemoMode } = useAuth();

    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [members, setMembers] = useState<WorkspaceMember[]>([]);
    const [loading, setLoading] = useState(true);

    // Rol hesaplama
    const userRole: WorkspaceRole = profile?.role === 'broker' ? 'broker' : 'danisman';
    const isOwner = workspace?.owner_id === user?.id;
    const isBroker = userRole === 'broker';

    // Demo mode kontrolü
    const inDemoMode = authDemoMode || isDemoMode();

    // Yetki kontrolleri
    const canManageMembers = isBroker;
    const canManageBilling = isOwner;
    const canViewAllData = isBroker;
    const canDeleteData = isBroker && !inDemoMode;

    // Workspace'i yükle
    const refreshWorkspace = useCallback(async () => {
        if (!user) {
            setWorkspace(null);
            setMembers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Demo modunda demo workspace kullan
            if (inDemoMode) {
                setWorkspace(DEMO_WORKSPACE as Workspace);
                setMembers(DEMO_AGENTS.map((agent, index) => ({
                    id: `member-${index}`,
                    workspace_id: DEMO_WORKSPACE.id,
                    user_id: agent.id,
                    role: agent.role as WorkspaceRole,
                    invited_at: new Date().toISOString(),
                    joined_at: new Date().toISOString(),
                })));
                return;
            }

            // Supabase'den workspace çek
            const { supabase } = await import("@/lib/supabase");

            console.log("🔍 Workspace araması başlıyor...");
            console.log("User ID:", user.id);
            console.log("Profile workspace_id:", profile?.workspace_id);

            let workspaceId = profile?.workspace_id;

            // Eğer profile'da workspace_id yoksa, kullanıcının sahibi olduğu workspace'i bul
            if (!workspaceId) {
                console.log("🔄 Profile'da workspace_id yok, owner_id ile aranıyor...");
                const { data: ownedWorkspace, error: ownerError } = await supabase
                    .from('workspaces')
                    .select('id')
                    .eq('owner_id', user.id)
                    .single();

                console.log("Owner workspace sorgu sonucu:", { ownedWorkspace, ownerError });

                if (ownedWorkspace) {
                    workspaceId = ownedWorkspace.id;
                }
            }

            if (!workspaceId) {
                console.log("❌ Kullanıcının workspace'i bulunamadı - user.id:", user.id);
                setLoading(false);
                return;
            }

            console.log("✅ Workspace ID bulundu:", workspaceId);

            const { data: workspaceData, error: wsError } = await supabase
                .from('workspaces')
                .select('*')
                .eq('id', workspaceId)
                .single();

            if (wsError) {
                console.error("Workspace çekme hatası:", wsError);
            } else if (workspaceData) {
                setWorkspace(workspaceData as Workspace);
            }

            // Workspace üyelerini çek
            const { data: membersData, error: membersError } = await supabase
                .from('workspace_members')
                .select('*')
                .eq('workspace_id', workspaceId);

            if (membersError) {
                console.error("Üyeler çekme hatası:", membersError);
            } else if (membersData) {
                setMembers(membersData as WorkspaceMember[]);
            }

        } catch (error) {
            console.error("Workspace yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    }, [user, profile, inDemoMode]);

    // İlk yükleme
    useEffect(() => {
        refreshWorkspace();
    }, [refreshWorkspace]);

    const value: WorkspaceContextType = {
        workspace,
        members,
        loading,
        userRole,
        isOwner,
        isBroker,
        isDemoMode: inDemoMode,
        canManageMembers,
        canManageBilling,
        canViewAllData,
        canDeleteData,
        refreshWorkspace,
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

// Hook
export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace hook'u WorkspaceProvider içinde kullanılmalıdır");
    }
    return context;
}
