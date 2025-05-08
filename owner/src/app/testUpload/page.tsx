import {ImageUploader} from "@/app/testUpload/ImageUploader";

export default function Page() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Upload ảnh</h2>
            <ImageUploader />
        </div>
    );
}