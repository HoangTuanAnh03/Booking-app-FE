"use client";

import { useRef, useState } from "react";
import { uploadToImgur } from "@/lib/uploadToImgur";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
    onUpload?: (urls: string[]) => void;
};

export const ImageUploader = ({ onUpload }: ImageUploaderProps) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const uploadedUrl = await uploadToImgur(file);
            const updatedImages = [...images, uploadedUrl];
            setImages((prev) => [...prev, uploadedUrl]);
            if (onUpload) {
                onUpload(updatedImages); // Truyền danh sách ảnh mới ra ngoài
            }
        } catch (err) {
            alert("Lỗi khi upload ảnh");
            console.error(err);
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = (url: string) => {
        setImages((prev) => prev.filter((img) => img !== url));
    };

    return (
        <div className="flex flex-wrap gap-4">
            {images.map((url) => (
                <div
                    key={url}
                    className="relative w-32 h-32 border rounded-md overflow-hidden group"
                >
                    <Image loader={() => url} src={url} alt="Uploaded" fill className="object-cover" />
                    <button
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-red-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
            <div
                className={cn(
                    "w-32 h-32 border border-dashed rounded-md flex items-center justify-center relative",
                    loading && "opacity-50 pointer-events-none"
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {loading ? "Uploading..." : "Thêm ảnh"}
            </div>
        </div>
    );
};