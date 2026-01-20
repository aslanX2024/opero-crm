"use client";

import { useState } from "react";
import { Plus, Search, Mail, Phone, MoreVertical, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "@/lib/services/team";
import { useAuth } from "@/context/auth-context";

export default function TeamSettingsPage() {
    const { profile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: members = [], isLoading } = useQuery({
        queryKey: ["team", profile?.workspace_id],
        queryFn: () => getTeamMembers(profile?.workspace_id || ""),
        enabled: !!profile?.workspace_id
    });

    const filteredMembers = members.filter(
        (member) =>
            member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Takım Yönetimi</h3>
                    <p className="text-sm text-gray-500">
                        Ekip üyelerini görüntüleyin ve yönetin.
                    </p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Üye Davet Et
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="İsim veya e-posta ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? (
                            <p className="text-center py-4 text-gray-500">Yükleniyor...</p>
                        ) : filteredMembers.length === 0 ? (
                            <p className="text-center py-4 text-gray-500">Üye bulunamadı.</p>
                        ) : (
                            filteredMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={member.avatar_url} />
                                            <AvatarFallback>
                                                {member.full_name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{member.full_name}</p>
                                                {member.role === "broker" && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Broker
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {member.email}
                                                </div>
                                                {member.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {member.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <User className="w-4 h-4 mr-2" />
                                                Profili Görüntüle
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Shield className="w-4 h-4 mr-2" />
                                                Rolü Değiştir
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">
                                                Takımdan Çıkar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
