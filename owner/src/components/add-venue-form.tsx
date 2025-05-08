"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Venue } from "@/types/venue"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateVenueMutation } from "@/queries/useVenue"
import UploadPage from "@/app/venue/venue_img/page"
import { BankSelector } from "@/components/bank-selector"
import { getLatLngByName } from "@/utils/geocode"

interface AddVenueFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddVenueForm({ isOpen, onClose, onSuccess }: AddVenueFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const createVenueMutation = useCreateVenueMutation()

  const [formData, setFormData] = useState<Omit<Venue, "venue_id">>({
    name: "",
    address: "",
    status: "active",
    bank_account_number: "",
    bank_name: "",
    phone_number: "",
    longitude: "",
    latitude: "",
  })

  useEffect(() => {
    const fetchLatLng = async () => {
      if (!formData.address?.trim()) return
  
      try {
        const [lat, lng] = await getLatLngByName(formData.address)
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }))
      } catch (error) {
        console.error("Failed to fetch lat/lng from address", error)
      }
    }
  
    fetchLatLng()
  }, [formData.address])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBankChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bank_name: value }))

    if (errors.bank_name) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.bank_name
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Venue name is required"
    }

    if (!formData.bank_account_number.trim()) {
      newErrors.bank_account_number = "Bank account number is required"
    }

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = "Bank name is required"
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required"
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = "Longitude time is required"
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = "latitude time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    createVenueMutation.mutate(formData, {
      onSuccess: () => {

      if (onSuccess) {
        onSuccess()
      }
        onClose()
      },
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Venue</DialogTitle>
            <DialogDescription>Fill in the details to create a new venue.</DialogDescription>
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
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <div className="col-span-3">
                <Input id="address" name="address" value={formData.address || ""} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 hidden">
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
                    <SelectItem value="inactive">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bank_name" className="text-right">
                Bank Name
              </Label>
              <div className="col-span-3">
                <BankSelector value={formData.bank_name} onChange={handleBankChange} error={errors.bank_name} />
                {errors.bank_name && <p className="text-sm text-destructive mt-1">{errors.bank_name}</p>}
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
                  className={errors.bank_account_number ? "border-destructive" : ""}
                />
                {errors.bank_account_number && (
                  <p className="text-sm text-destructive mt-1">{errors.bank_account_number}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone_number" className="text-right">
                Phone Number
              </Label>
              <div className="col-span-3">
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={errors.phone_number ? "border-destructive" : ""}
                />
                {errors.phone_number && <p className="text-sm text-destructive mt-1">{errors.phone_number}</p>}
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
                {errors.longitude && <p className="text-sm text-destructive mt-1">{errors.longitude}</p>}
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
                {errors.latitude && <p className="text-sm text-destructive mt-1">{errors.latitude}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closing" className="text-right">
                Image:
              </Label>
              <div className="col-span-3">
                <UploadPage />
                {errors.latitude && <p className="text-sm text-destructive mt-1">{errors.latitude}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
              <Button type="submit" disabled={createVenueMutation.isPending}>
              {createVenueMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Venue"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
