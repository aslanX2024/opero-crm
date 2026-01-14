import { toast } from "@/lib/use-toast";

// Email tipleri
export type EmailType =
    | "appointment_created"
    | "appointment_cancelled"
    | "lead_assigned"
    | "welcome_email";

// Email payload arayüzü
export interface EmailPayload {
    to: string;
    subject: string;
    template: EmailType;
    data: Record<string, any>;
}

/**
 * Email Servisi
 * Gerçek bir SMTP/API entegrasyonu yapılana kadar konsola ve UI'a bildirim verir.
 * İleride Resend, SendGrid veya Supabase Edge Functions ile değiştirilebilir.
 */
export const EmailService = {
    /**
     * Email gönder (Simülasyon)
     */
    send: async (payload: EmailPayload): Promise<boolean> => {
        // Gerçek dünyada burada API isteği olurdu
        console.group("📧 Email Servisi: Gönderim Simülasyonu");
        console.log("Kime:", payload.to);
        console.log("Konu:", payload.subject);
        console.log("Şablon:", payload.template);
        console.log("Veri:", payload.data);
        console.groupEnd();

        // Yapay gecikme
        await new Promise(resolve => setTimeout(resolve, 800));

        // Başarılı log
        return true;
    },

    /**
     * Randevu oluşturulduğunda
     */
    sendAppointmentCreated: async (to: string, appointmentDetails: any) => {
        return EmailService.send({
            to,
            subject: "📅 Randevu Onayı: " + appointmentDetails.title,
            template: "appointment_created",
            data: appointmentDetails
        });
    },

    /**
     * Randevu iptal edildiğinde
     */
    sendAppointmentCancelled: async (to: string, appointmentDetails: any) => {
        return EmailService.send({
            to,
            subject: "❌ Randevu İptali: " + appointmentDetails.title,
            template: "appointment_cancelled",
            data: appointmentDetails
        });
    }
};
