import envConfig from "@/config";

export const uploadToImgur = async (file: File): Promise<string> => {
    const clientId = envConfig.NEXT_PUBLIC_IMGUR_CLIENT_ID;
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
            Authorization: `Client-ID ${clientId}`,
        },
        body: formData,
    });
    if (!res.ok) {
        throw new Error("Upload ảnh thất bại");
    }
    const data = await res.json();
    return data.data.link as string;
};