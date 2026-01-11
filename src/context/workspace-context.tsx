"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
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
    const [inDemoMode, setInDemoMode] = useState(() => authDemoMode || isDemoMode());
    useEffect(() => {
        setInDemoMode(authDemoMode || isDemoMode());
    }, [authDemoMode]);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "demo_mode") {
                setInDemoMode(authDemoMode || isDemoMode());
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, [authDemoMode]);
    const demoTimestamp = useMemo(() => new Date().toISOString(), []);
    const demoMembers = useMemo(() => (
        DEMO_AGENTS.map((agent, index) => ({
            id: `member-${index}`,
            workspace_id: DEMO_WORKSPACE.id,
            user_id: agent.id,
            role: agent.role as WorkspaceRole,
            invited_at: demoTimestamp,
            joined_at: demoTimestamp,
        }))
    ), [demoTimestamp]);

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
                setMembers(demoMembers);
                return;
            }

            // TODO: Production'da Supabase'den workspace çek
            // const { data: workspaceData } = await supabase
            //     .from('workspaces')
            //     .select('*')
            //     .eq('id', profile?.workspace_id)
            //     .single();

        } catch (error) {
            console.error("Workspace yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    }, [user, inDemoMode, demoMembers]);

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
