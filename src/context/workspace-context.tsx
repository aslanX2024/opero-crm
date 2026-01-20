"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { supabase } from "@/lib/supabase";

// Types
interface Workspace {
    id: string;
    name: string;
    logo_url?: string;
    role: "broker" | "agent" | "admin";
}

interface WorkspaceContextType {
    workspace: Workspace | null;
    isBroker: boolean;
    isOwner: boolean;
    isDemoMode: boolean; // Geriye dönük uyumluluk için (her zaman false)
    refreshWorkspace: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const { user, profile } = useAuth();
    const [workspace, setWorkspace] = useState<Workspace | null>(null);

    const refreshWorkspace = async () => {
        if (!user || !profile?.workspace_id) {
            setWorkspace(null);
            return;
        }

        // Demo verisi yerine gerçek veri
        const { data } = await supabase
            .from("workspaces")
            .select("*")
            .eq("id", profile.workspace_id)
            .single();

        if (data) {
            setWorkspace({
                ...data,
                role: profile.role || "agent"
            });
        }
    };

    useEffect(() => {
        refreshWorkspace();
    }, [user, profile]);

    return (
        <WorkspaceContext.Provider
            value={{
                workspace,
                isBroker: profile?.role === "broker",
                isOwner: profile?.role === "broker" || profile?.role === "admin",
                isDemoMode: false,
                refreshWorkspace,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}
