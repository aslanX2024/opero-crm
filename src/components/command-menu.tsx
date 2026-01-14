"use client";

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Home,
    Users,
    Search,
    FileText,
    Map,
    Plus,
    LogOut,
    Moon,
    Sun,
    Laptop
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="flex items-center text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md cursor-pointer hover:bg-muted transition-colors border w-full md:w-64 justify-between"
            >
                <span className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Ara...
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Bir komut yazın veya arama yapın..." />
                <CommandList>
                    <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>

                    <CommandGroup heading="Hızlı Erişim">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/portfolio"))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Portföy</span>
                            <CommandShortcut>P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers"))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Müşteriler</span>
                            <CommandShortcut>C</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/appointments"))}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Randevular</span>
                            <CommandShortcut>A</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/pipeline"))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Pipeline</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="İşlemler">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/portfolio/new"))}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Yeni Mülk Ekle</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/customers/new"))}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Yeni Müşteri Ekle</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/appointments/new"))}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>Yeni Randevu Ekle</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Tema">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Aydınlık Mod</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Karanlık Mod</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>Sistem Teması</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Ayarlar">
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Ayarlar</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/billing"))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Fatura & Ödeme</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
