"use client";

import type React from "react";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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
import type { Venue } from "@/types/venue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVenueMutation } from "@/queries/useVenue";

interface EditVenueFormProps {
  venue: Venue;
  isOpen: boolean;
  onClose: () => void;
  onSave: (venue: Venue) => void;
}

export function EditVenueForm({
  venue,
  isOpen,
  onClose,
  onSave,
}: EditVenueFormProps) {
  const [formData, setFormData] = useState<Venue>({ ...venue });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalFormData] = useState<Venue>({ ...venue });
  const updateVenueMutation = useUpdateVenueMutation();

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
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className={errors.bank_name ? "border-destructive" : ""}
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

            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening" className="text-right">
                Opening Time
              </Label>
              <div className="col-span-3">
                <Input
                  id="opening"
                  name="opening"
                  type="time"
                  value={formData.opening}
                  onChange={handleChange}
                  className={errors.opening ? "border-destructive" : ""}
                />
                {errors.opening && <p className="text-sm text-destructive mt-1">{errors.opening}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closing" className="text-right">
                Closing Time
              </Label>
              <div className="col-span-3">
                <Input
                  id="closing"
                  name="closing"
                  type="time"
                  value={formData.closing}
                  onChange={handleChange}
                  className={errors.closing ? "border-destructive" : ""}
                />
                {errors.closing && <p className="text-sm text-destructive mt-1">{errors.closing}</p>}
              </div>
            </div> */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateVenueMutation.isPending}>
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
