import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
    password: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır." }),
    rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
