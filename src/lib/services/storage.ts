import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Storage bucket adları
export const STORAGE_BUCKETS = {
    PROPERTY_IMAGES: "property-images",
    USER_AVATARS: "user-avatars",
    DOCUMENTS: "documents",
} as const;

// Dosya tipi kontrolü
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
    success: boolean;
    url?: string;
    path?: string;
    error?: string;
}

export interface UploadedImage {
    id: string;
    url: string;
    path: string;
    name: string;
    size: number;
}

/**
 * Dosya boyutunu insan-okunabilir formata çevir
 */
export function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${bytes} B`;
}

/**
 * Dosya tipini kontrol et
 */
export function isValidImageType(file: File): boolean {
    return ALLOWED_IMAGE_TYPES.includes(file.type);
}

/**
 * Dosya boyutunu kontrol et
 */
export function isValidFileSize(file: File): boolean {
    return file.size <= MAX_FILE_SIZE;
}

/**
 * Dosya adı oluştur (benzersiz)
 */
export function generateFileName(file: File, prefix?: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const prefixStr = prefix ? `${prefix}/` : "";
    return `${prefixStr}${timestamp}-${random}.${extension}`;
}

/**
 * Resmi Supabase Storage'a yükle
 */
export async function uploadImage(
    file: File,
    bucket: string = STORAGE_BUCKETS.PROPERTY_IMAGES,
    folder?: string
): Promise<UploadResult> {
    // Supabase yapılandırılmamışsa demo modu
    if (!isSupabaseConfigured) {
        // Demo modda fake URL döndür
        const fakeUrl = URL.createObjectURL(file);
        return {
            success: true,
            url: fakeUrl,
            path: `demo/${file.name}`,
        };
    }

    // Dosya tipi kontrolü
    if (!isValidImageType(file)) {
        return {
            success: false,
            error: "Desteklenmeyen dosya formatı. PNG, JPG, WEBP veya GIF kullanın.",
        };
    }

    // Dosya boyutu kontrolü
    if (!isValidFileSize(file)) {
        return {
            success: false,
            error: `Dosya boyutu çok büyük. Maksimum ${formatFileSize(MAX_FILE_SIZE)}.`,
        };
    }

    try {
        // Benzersiz dosya adı oluştur
        const filePath = generateFileName(file, folder);

        // Storage'a yükle
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Upload error:", error);
            return {
                success: false,
                error: error.message || "Dosya yüklenirken bir hata oluştu.",
            };
        }

        // Public URL al
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            success: true,
            url: urlData.publicUrl,
            path: data.path,
        };
    } catch (error) {
        console.error("Upload exception:", error);
        return {
            success: false,
            error: "Dosya yüklenirken bir hata oluştu.",
        };
    }
}

/**
 * Birden fazla resmi yükle
 */
export async function uploadImages(
    files: File[],
    bucket: string = STORAGE_BUCKETS.PROPERTY_IMAGES,
    folder?: string,
    onProgress?: (uploaded: number, total: number) => void
): Promise<UploadedImage[]> {
    const uploadedImages: UploadedImage[] = [];
    let uploaded = 0;

    for (const file of files) {
        const result = await uploadImage(file, bucket, folder);
        uploaded++;

        if (result.success && result.url && result.path) {
            uploadedImages.push({
                id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url: result.url,
                path: result.path,
                name: file.name,
                size: file.size,
            });
        }

        onProgress?.(uploaded, files.length);
    }

    return uploadedImages;
}

/**
 * Resmi Storage'dan sil
 */
export async function deleteImage(
    path: string,
    bucket: string = STORAGE_BUCKETS.PROPERTY_IMAGES
): Promise<boolean> {
    if (!isSupabaseConfigured) {
        return true; // Demo modda başarılı say
    }

    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error("Delete error:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Delete exception:", error);
        return false;
    }
}
