"use client";

import { useState } from "react";
import { EmailService } from "@/lib/services/email";
import { toast } from "@/lib/use-toast";

export function useEmail() {
    const [sending, setSending] = useState(false);

    const sendAppointmentConfirmation = async (customerEmail: string, appointment: any) => {
        if (!customerEmail) return false;

        setSending(true);
        try {
            await EmailService.sendAppointmentCreated(customerEmail, appointment);

            toast({
                title: "Email Gönderildi",
                description: `${customerEmail} adresine randevu detayları iletildi.`,
                variant: "success",
            });

            return true;
        } catch (error) {
            console.error("Email error:", error);
            toast({
                title: "Email Hatası",
                description: "Bildirim gönderilemedi.",
                variant: "destructive",
            });
            return false;
        } finally {
            setSending(false);
        }
    };

    return {
        sending,
        sendAppointmentConfirmation
    };
}
