import { create } from "zustand";
import { persist } from "zustand/middleware";

// Uygulama genel state tipi
interface AppState {
    // Sidebar durumu
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Sidebar daraltma durumu
    sidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebarCollapsed: () => void;

    // Tema
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;

    // Bildirimler
    unreadNotifications: number;
    setUnreadNotifications: (count: number) => void;
}

// Ana uygulama store'u
// persist middleware ile localStorage'a kaydedilir
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Sidebar varsayılan olarak açık
            sidebarOpen: true,
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

            // Sidebar daraltma - varsayılan olarak genişletilmiş
            sidebarCollapsed: false,
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

            // Tema varsayılan olarak sistem ayarına göre
            theme: "light",
            setTheme: (theme) => set({ theme }),

            // Okunmamış bildirim sayısı - demo için 3
            unreadNotifications: 3,
            setUnreadNotifications: (count) => set({ unreadNotifications: count }),
        }),
        {
            name: "opero-storage", // localStorage anahtarı
            partialize: (state) => ({
                // Sadece bu alanlar kalıcı olarak saklanır
                sidebarOpen: state.sidebarOpen,
                sidebarCollapsed: state.sidebarCollapsed,
                theme: state.theme,
            }),
        }
    )
);

// Filtre state tipi - portföy listeleme için
interface FilterState {
    // Emlak filtreleri
    propertyType: string | null;
    priceRange: { min: number; max: number } | null;
    roomCount: string | null;
    city: string | null;
    district: string | null;

    // Filtre işlemleri
    setPropertyType: (type: string | null) => void;
    setPriceRange: (range: { min: number; max: number } | null) => void;
    setRoomCount: (count: string | null) => void;
    setCity: (city: string | null) => void;
    setDistrict: (district: string | null) => void;
    resetFilters: () => void;
}

// Filtre store'u
export const useFilterStore = create<FilterState>((set) => ({
    // Varsayılan değerler
    propertyType: null,
    priceRange: null,
    roomCount: null,
    city: null,
    district: null,

    // Setter fonksiyonları
    setPropertyType: (type) => set({ propertyType: type }),
    setPriceRange: (range) => set({ priceRange: range }),
    setRoomCount: (count) => set({ roomCount: count }),
    setCity: (city) => set({ city }),
    setDistrict: (district) => set({ district }),

    // Tüm filtreleri sıfırla
    resetFilters: () =>
        set({
            propertyType: null,
            priceRange: null,
            roomCount: null,
            city: null,
            district: null,
        }),
}));
