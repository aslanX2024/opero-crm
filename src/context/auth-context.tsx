"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";
import { supabase, UserProfile, getAuthErrorMessage } from "@/lib/supabase";

// Geliştirme modu kontrolü - Supabase yapılandırılmamışsa true
const isDevelopmentMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === '' ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

// Demo kullanıcı profili
const DEMO_PROFILE: UserProfile = {
    id: "demo-user-id",
    email: "demo@opero.tr",
    full_name: "Demo Kullanıcı",
    phone: "0532 123 45 67",
    role: "danisman",
    xp: 450,
    avatar_url: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

// Demo user
const DEMO_USER = {
    id: "demo-user-id",
    email: "demo@opero.tr",
    app_metadata: {},
    user_metadata: { full_name: "Demo Kullanıcı" },
    aud: "authenticated",
    created_at: new Date().toISOString(),
} as unknown as User;

// Auth context tipi
interface AuthContextType {
    // Kullanıcı durumu
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    isDemoMode: boolean;

    // Auth işlemleri
    signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: string }>;
    signUp: (data: SignUpData) => Promise<{ error?: string }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error?: string }>;
}

// Kayıt formu verileri
export interface SignUpData {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: "danisman" | "broker";
}

// Context oluştur
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider bileşeni
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // State tanımları
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Kullanıcı profilini getir
    const fetchProfile = useCallback(async (userId: string) => {
        // Demo modunda mock profil döndür
        if (isDevelopmentMode) {
            return DEMO_PROFILE;
        }

        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Profil getirme hatası:", error);
                return null;
            }

            return data as UserProfile;
        } catch (error) {
            console.error("Profil getirme hatası:", error);
            return null;
        }
    }, []);

    // Oturum durumunu dinle
    useEffect(() => {
        // Demo modunda otomatik giriş yap
        if (isDevelopmentMode) {
            console.log("🔧 Geliştirme modu aktif - Demo kullanıcı ile giriş yapıldı");
            setUser(DEMO_USER);
            setProfile(DEMO_PROFILE);
            setSession({} as Session);
            setLoading(false);
            return;
        }

        // Mevcut oturumu kontrol et
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setSession(session);
                setUser(session.user);
                const userProfile = await fetchProfile(session.user.id);
                setProfile(userProfile);
            }
        } catch (error) {
            console.error("Auth başlatma hatası:", error);
        } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Auth değişikliklerini dinle
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                let resolvedProfile: UserProfile | null = null;
                if (session?.user) {
                    resolvedProfile = await fetchProfile(session.user.id);
                    setProfile(resolvedProfile);
                } else {
                    setProfile(null);
                }

                // Oturum açıldığında yönlendir
                if (event === "SIGNED_IN" && resolvedProfile) {
                    // Rol bazlı yönlendirme
                    if (resolvedProfile.role === "broker") {
                        router.push("/broker");
                    } else {
                        router.push("/dashboard");
                    }
                }

                // Oturum kapandığında giriş sayfasına yönlendir
                if (event === "SIGNED_OUT") {
                    router.push("/login");
                }
            }
        );

        // Cleanup
        return () => {
            subscription.unsubscribe();
        };
    }, [fetchProfile, router]);

    // Giriş yap
    const signIn = async (
        email: string,
        password: string,
        rememberMe: boolean = false
    ): Promise<{ error?: string }> => {
        // Demo modunda her girişi kabul et
        if (isDevelopmentMode) {
            setUser(DEMO_USER);
            setProfile(DEMO_PROFILE);
            setSession({} as Session);
            router.push("/dashboard");
            return {};
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { error: getAuthErrorMessage(error.message) };
            }

            // Beni hatırla seçeneği için localStorage'a kaydet
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("rememberMe");
            }

            return {};
        } catch (error) {
            console.error("Giriş hatası:", error);
            return { error: "Beklenmeyen bir hata oluştu" };
        }
    };

    // Kayıt ol
    const signUp = async (data: SignUpData): Promise<{ error?: string }> => {
        // Demo modunda kayıt başarılı olsun ve giriş yapsın
        if (isDevelopmentMode) {
            setUser(DEMO_USER);
            setProfile({
                ...DEMO_PROFILE,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                role: data.role,
            });
            setSession({} as Session);
            router.push("/dashboard");
            return {};
        }

        try {
            // Önce kullanıcıyı oluştur
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        phone: data.phone,
                        role: data.role,
                    },
                    // Email doğrulama için yönlendirme URL'i
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (authError) {
                return { error: getAuthErrorMessage(authError.message) };
            }

            // Profil tablosuna kaydet (trigger ile de yapılabilir)
            if (authData.user) {
                const { error: profileError } = await supabase.from("profiles").insert({
                    id: authData.user.id,
                    email: data.email,
                    full_name: data.fullName,
                    phone: data.phone,
                    role: data.role,
                    xp: 0,
                });

                if (profileError) {
                    console.error("Profil oluşturma hatası:", profileError);
                    // Profil hatası kritik değil, kullanıcı yine de oluşturuldu
                }
            }

            return {};
        } catch (error) {
            console.error("Kayıt hatası:", error);
            return { error: "Beklenmeyen bir hata oluştu" };
        }
    };

    // Çıkış yap
    const signOut = async () => {
        // Demo modunda state'i temizle
        if (isDevelopmentMode) {
            setUser(null);
            setProfile(null);
            setSession(null);
            router.push("/login");
            return;
        }

        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setSession(null);
            localStorage.removeItem("rememberMe");
        } catch (error) {
            console.error("Çıkış hatası:", error);
        }
    };

    // Şifre sıfırlama
    const resetPassword = async (email: string): Promise<{ error?: string }> => {
        // Demo modunda her zaman başarılı
        if (isDevelopmentMode) {
            return {};
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                return { error: getAuthErrorMessage(error.message) };
            }

            return {};
        } catch (error) {
            console.error("Şifre sıfırlama hatası:", error);
            return { error: "Beklenmeyen bir hata oluştu" };
        }
    };

    // Context değeri
    const value: AuthContextType = {
        user,
        profile,
        session,
        loading,
        isDemoMode: isDevelopmentMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook: Auth context'i kullan
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth hook'u AuthProvider içinde kullanılmalıdır");
    }
    return context;
}
