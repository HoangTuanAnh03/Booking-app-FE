'use client';

import { useState, ChangeEvent, useEffect } from 'react';

interface UploadedImage {
    url: string;
    isThumnail: boolean;
    publicId: string;
}

interface UploadResponse {
    success: boolean;
    urls: string[];
    publicIds: string[];
    error?: string;
}

export default function EnhancedMultiImageUpload() {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showJson, setShowJson] = useState<boolean>(false);

    // Xử lý khi chọn file
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            await uploadFiles(files);
        }
    };

    // Chuyển file thành base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    // Upload ảnh lên Cloudinary
    const uploadFiles = async (files: File[]) => {
        try {
            setIsUploading(true);
            setError(null);

            // Chuyển đổi tất cả files sang base64
            const base64Files = await Promise.all(files.map(convertToBase64));

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    images: base64Files,
                }),
            });

            const data = await response.json() as UploadResponse;

            if (!response.ok) {
                throw new Error(data.error || 'Không thể upload ảnh');
            }

            // Thêm ảnh mới vào danh sách
            const newImages = data.urls.map((url, index) => ({
                url,
                publicId: data.publicIds[index],
                isThumnail: false // Mặc định không phải thumbnail
            }));

            // Cập nhật state với ảnh mới
            setUploadedImages(prev => {
                const updatedImages = [...prev, ...newImages];
                if (!prev.some(img => img.isThumnail) && updatedImages.length > 0) {
                    // Đánh dấu ảnh đầu tiên là thumbnail
                    updatedImages[0].isThumnail = true;
                }

                return updatedImages;
            });
        } catch (err) {
            console.error('Lỗi khi upload:', err);
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        } finally {
            setIsUploading(false);
        }
    };

    // Xử lý chọn thumbnail
    const handleSetThumbnail = (index: number) => {
        setUploadedImages(prev => prev.map((img, i) => ({
            ...img,
            isThumnail: i === index
        })));
    };

    const getFormattedData = () => {
        return uploadedImages.map(img => ({
            image: img.url,
            is_thumbnail: img.isThumnail
        }));
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg">
            <h2 className="text-sm font-bold mb-4">Upload Ảnh: </h2>

            <div className="mb-6">
                <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center h-16 w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-sm text-gray-500">Chọn ảnh để upload</span>
                        {isUploading && <span className="text-blue-500 text-xs mt-1">Đang upload...</span>}
                    </div>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>
            </div>

            {error && (
                <div className="mb-4 text-red-500 text-sm p-3 bg-red-50 rounded-md">{error}</div>
            )}

            {uploadedImages.length > 0 && (
                <div>
                    <h3 className="font-medium mb-3">Ảnh đã upload ({uploadedImages.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                        {uploadedImages.map((image, index) => (
                            <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 group">
                                <div className="aspect-square relative">
                                    <img
                                        src={image.url}
                                        alt={`Uploaded image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-2 bg-white border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`thumbnail-${index}`}
                                            name="thumbnail-selection"
                                            checked={image.isThumnail}
                                            onChange={() => handleSetThumbnail(index)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`thumbnail-${index}`} className="text-xs text-gray-700 cursor-pointer">
                                            Đặt làm ảnh đại diện
                                        </label>
                                    </div>
                                </div>
                                {image.isThumnail && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                                        Ảnh đại diện
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* JSON */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Dữ liệu JSON</h3>
                            <button
                                onClick={() => setShowJson(!showJson)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                {showJson ? 'Ẩn JSON' : 'Hiển thị JSON'}
                            </button>
                        </div>

                        {showJson && (
                            <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                <pre className="text-xs text-gray-700">
                  {JSON.stringify(getFormattedData(), null, 2)}
                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}