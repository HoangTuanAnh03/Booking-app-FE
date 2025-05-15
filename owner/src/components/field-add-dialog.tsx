import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import useField from "@/queries/useField";
import { SportType } from "@/schemaValidations/sport-type.schema";
import fieldApiRequest from "@/apiRequests/field";

interface FieldDialogProps {
  openDialog: boolean;
  onClose: () => void;
  venueId: string;
  fetchFields: (page: number) => void;
}

export default function FieldDialog({
  openDialog,
  onClose,
  venueId,
  fetchFields,
}: FieldDialogProps) {
  const { createField, createFieldLoading } = useField(venueId);

  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [sportTypeId, setSportTypeId] = useState<number>(0);
  const [fieldName, setFieldName] = useState<string>("");
  const [defaultPrice, setDefaultPrice] = useState<number | string>("");

  useEffect(() => {
    const fetchSportTypes = async () => {
      try {
        const res = await fieldApiRequest.getSportTypes();
        setSportTypes(res.payload.data || []);
      } catch (error) {
        console.error("Failed to fetch sport types", error);
      }
    };

    if (openDialog) {
      fetchSportTypes();
      setSportTypeId(0);
      setFieldName("");
      setDefaultPrice("");
    }
  }, [openDialog]);

  const handleSave = async () => {
    if (!venueId || !sportTypeId || !fieldName) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const fieldData = {
      venue_id: venueId,
      sport_type_id: sportTypeId,
      field_name: fieldName,
      default_price: defaultPrice ? Number(defaultPrice) : 0,
    };

    await createField(fieldData);
    setSportTypeId(0);
    setFieldName("");
    setDefaultPrice("");
    onClose();
    fetchFields(1);
  };

  return (
    <Dialog open={openDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm Sân</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue_id">Venue ID</Label>
            <Input
              id="venue_id"
              value={venueId || ""}
              readOnly
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Loại môn thể thao</Label>
            <Select
              value={sportTypeId ? sportTypeId.toString() : ""}
              onValueChange={(value) => setSportTypeId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn thể thao" />
              </SelectTrigger>
              <SelectContent>
                {sportTypes.map((sport) => (
                  <SelectItem key={sport.sport_type_id} value={sport.sport_type_id.toString()}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_name">Tên Sân</Label>
            <Input
              id="field_name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Nhập tên sân"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default_price">Giá Niêm Yết</Label>
            <Input
              id="default_price"
              type="number"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              placeholder="Nhập giá niêm yết"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={createFieldLoading}
          >
            {createFieldLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
