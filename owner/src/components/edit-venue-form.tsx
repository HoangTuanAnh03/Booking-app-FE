"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Venue, VenueImg } from "@/types/venue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVenueMutation, useVenueImg } from "@/queries/useVenue";
import {
  addVenueImgById,
  deleteVenueImgById,
  updateVenueImgById,
} from "@/lib/api";
import { BankSelector } from "./bank-selector";
import { getLatLngByName } from "@/utils/geocode";
import { ImageUploader } from "@/app/testUpload/ImageUploader";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface EditVenueFormProps {
  venue: Venue;
  venueImgs: VenueImg[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (venue: Venue) => void;
}

export function EditVenueForm({
  venue,
  isOpen,
  onClose,
  venueImgs,
  onSave,
}: EditVenueFormProps) {
  const [formData, setFormData] = useState<Venue>({ ...venue });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalFormData] = useState<Venue>({ ...venue });
  const updateVenueMutation = useUpdateVenueMutation();
  const [venueImages, setVenueImages] = useState<VenueImg[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [imageType, setImageType] = useState("default");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<VenueImg | null>(null);

  //lấy link từ imageuploader
  const handleImageUpload = (urls: string[]) => {
    setUploadedUrls(urls);
  };

  //gửi ảnh lên db
  const handleSubmitImages = async () => {
    if (uploadedUrls.length === 0) {
      // alert("Chưa có ảnh nào được upload!");
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        uploadedUrls.map((url) =>
          addVenueImgById(venue.venue_id, {
            image_url: url,
            type: imageType,
          })
        )
      );
      toast("Thêm ảnh thành công");
    } catch (error) {
      console.error("Lỗi khi thêm ảnh:", error);
      toast("Thêm ảnh thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: string, url: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa ảnh này?");
    if (!confirm) return;

    setDeletingId(id);
    try {
      await deleteVenueImgById(id);

      // 👇 Xóa ảnh theo image_url
      setVenueImages((prev) => prev.filter((img) => img.image_url !== url));

      toast("Đã xóa ảnh thành công");
    } catch (error) {
      toast("Xóa ảnh thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageUpdate = (image: VenueImg) => {
    ImageUploader;
  };

  const handleUpdateImage = async (id: string, url: string) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa ảnh này?");
    if (!confirm) return;

    setDeletingId(id);
    try {
      ImageUploader;
      await Promise.all(
        uploadedUrls.map((url) => updateVenueImgById(venue.venue_id, url))
      );

      // 👇 Xóa ảnh theo image_url
      setVenueImages((prev) => prev.filter((img) => img.image_url !== url));

      toast("Đã xóa ảnh thành công");
    } catch (error) {
      toast("Xóa ảnh thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBankChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bank_name: value }));

    if (errors.bank_name) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.bank_name;
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Venue name is required";
    }

    if (!formData.bank_account_number.trim()) {
      newErrors.bank_account_number = "Bank account number is required";
    }

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    const fetchLatLng = async () => {
      if (!formData.address?.trim()) return;

      try {
        const [lat, lng] = await getLatLngByName(formData.address);
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
      } catch (error) {
        console.error("Failed to fetch lat/lng from address", error);
      }
    };

    fetchLatLng();
  }, [formData.address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>
              Make changes to the venue information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <div className="col-span-3">
                <Input
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.status || "active"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="lock">Lock</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank_name" className="text-right">
                Bank Name
              </Label>
              <div className="col-span-3">
                <BankSelector
                  value={formData.bank_name}
                  onChange={handleBankChange}
                  error={errors.bank_name}
                />
                {errors.bank_name && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.bank_name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank_account_number" className="text-right">
                Bank Account
              </Label>
              <div className="col-span-3">
                <Input
                  id="bank_account_number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  className={
                    errors.bank_account_number ? "border-destructive" : ""
                  }
                />
                {errors.bank_account_number && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.bank_account_number}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 hidden">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <div className="col-span-3">
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className={errors.longitude ? "border-destructive" : ""}
                />
                {errors.longitude && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 hidden">
              <Label htmlFor="closing" className="text-right">
                Latitude:
              </Label>
              <div className="col-span-3">
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className={errors.latitude ? "border-destructive" : ""}
                />
                {errors.latitude && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.latitude}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-4">
              {/* Existing Images Preview */}
              {venueImgs.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Existing Images</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {venueImgs.map((image) => (
                      <div
                        key={image.image_id}
                        className="relative h-32 border rounded-md overflow-hidden"
                      >
                        <img
                          src={image.image_url || "/placeholder.svg"}
                          alt="Venue preview"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-1 left-1 bg-black/70 text-white px-2 py-0.5 text-xs rounded">
                          {image.type}
                        </div>
                        <div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() =>
                              handleDeleteImage(image.image_id, image.image_url)
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-8 h-6 w-6 p-0 bg-green-100 hover:bg-green-200 z-10"
                            onClick={() => handleImageUpdate(image)}
                          >
                            <Pencil className="h-4 w-4 text-green-500" />
                            {/* 
                            <div className="absolute right-8 z-0">
                              <ImageUploader onUpload={handleImageUpload} />
                            </div> */}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <ImageUploader onUpload={handleImageUpload} />
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loại ảnh
                </label>
                <select
                  id="type"
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                  className="mt-1 block w-60 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
                >
                  <option value="cover">Cover</option>
                  <option value="default">Default</option>
                  <option value="thumbnail">Thumbnail</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({ ...originalFormData });
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitImages}
              disabled={updateVenueMutation.isPending}
            >
              {updateVenueMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
