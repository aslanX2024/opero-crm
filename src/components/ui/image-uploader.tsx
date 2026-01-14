"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, GripVertical, Star, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    uploadImages,
    deleteImage,
    isValidImageType,
    isValidFileSize,
    formatFileSize,
    UploadedImage,
} from "@/lib/services/storage";
import { toast } from "@/lib/use-toast";

interface ImageUploaderProps {
    images: UploadedImage[];
    onChange: (images: UploadedImage[]) => void;
    mainImageIndex: number;
    onMainImageChange: (index: number) => void;
    maxImages?: number;
    folder?: string;
}

export function ImageUploader({
    images,
    onChange,
    mainImageIndex,
    onMainImageChange,
    maxImages = 20,
    folder,
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dosya seçimi
    const handleFileSelect = useCallback(
        async (files: FileList | null) => {
            if (!files || files.length === 0) return;

            // Mevcut + yeni dosya sayısı kontrolü
            const remainingSlots = maxImages - images.length;
            if (remainingSlots <= 0) {
                toast.warning("Limit aşıldı", `En fazla ${maxImages} fotoğraf yükleyebilirsiniz.`);
                return;
            }

            // Geçerli dosyaları filtrele
            const validFiles: File[] = [];
            for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
                const file = files[i];
                if (!isValidImageType(file)) {
                    toast.error("Geçersiz format", `${file.name} desteklenmiyor. PNG, JPG, WEBP veya GIF kullanın.`);
                    continue;
                }
                if (!isValidFileSize(file)) {
                    toast.error("Dosya çok büyük", `${file.name} 10MB'dan büyük.`);
                    continue;
                }
                validFiles.push(file);
            }

            if (validFiles.length === 0) return;

            // Yükleme başlat
            setIsUploading(true);
            setUploadProgress({ current: 0, total: validFiles.length });

            try {
                const uploaded = await uploadImages(
                    validFiles,
                    undefined,
                    folder,
                    (current, total) => setUploadProgress({ current, total })
                );

                if (uploaded.length > 0) {
                    onChange([...images, ...uploaded]);
                    toast.success(
                        "Yüklendi!",
                        `${uploaded.length} fotoğraf başarıyla yüklendi.`
                    );
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Hata", "Fotoğraflar yüklenirken bir hata oluştu.");
            } finally {
                setIsUploading(false);
                setUploadProgress(null);
            }
        },
        [images, onChange, maxImages, folder]
    );

    // Drag & drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files);
        },
        [handleFileSelect]
    );

    // Resim silme
    const handleRemove = async (index: number) => {
        const image = images[index];

        // Storage'dan sil
        if (image.path && !image.path.startsWith("demo/")) {
            await deleteImage(image.path);
        }

        // State'den çıkar
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);

        // Eğer ana resim silindiyse, ilk resmi ana yap
        if (mainImageIndex === index && newImages.length > 0) {
            onMainImageChange(0);
        } else if (mainImageIndex > index) {
            onMainImageChange(mainImageIndex - 1);
        }
    };

    // Ana resim seçimi
    const handleSetMain = (index: number) => {
        onMainImageChange(index);
        toast.success("Ana fotoğraf", "Ana fotoğraf değiştirildi.");
    };

    return (
        <div className="space-y-4">
            {/* Yükleme alanı */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    dragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="space-y-2">
                        <Loader2 className="w-10 h-10 mx-auto text-blue-600 animate-spin" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Yükleniyor... {uploadProgress?.current}/{uploadProgress?.total}
                        </p>
                    </div>
                ) : (
                    <>
                        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                        <p className="font-medium mb-1">
                            Fotoğrafları sürükleyin veya tıklayın
                        </p>
                        <p className="text-sm text-gray-500">
                            PNG, JPG, WEBP • Max 10MB • En fazla {maxImages} fotoğraf
                        </p>
                    </>
                )}
            </div>

            {/* Yüklenen fotoğraflar */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group"
                        >
                            {/* Resim */}
                            <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                            {/* Grip ikonu */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <GripVertical className="w-5 h-5 text-white drop-shadow" />
                            </div>

                            {/* Ana resim badge */}
                            {index === mainImageIndex && (
                                <Badge className="absolute top-2 right-2 bg-blue-600 text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Ana
                                </Badge>
                            )}

                            {/* Aksiyonlar */}
                            <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {index !== mainImageIndex && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        className="flex-1 h-7 text-xs"
                                        onClick={() => handleSetMain(index)}
                                    >
                                        <Star className="w-3 h-3 mr-1" />
                                        Ana Yap
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="destructive"
                                    className="h-7 w-7"
                                    onClick={() => handleRemove(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Durum */}
            <p className="text-xs text-gray-500 text-center">
                {images.length} / {maxImages} fotoğraf yüklendi
            </p>
        </div>
    );
}
