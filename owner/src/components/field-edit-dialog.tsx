import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import useField from "@/queries/useField";
import fieldApiRequest from "@/apiRequests/field";
import { SportType } from "@/schemaValidations/sport-type.schema";

interface FieldEditDialogProps {
  openDialog: boolean;
  onClose: () => void;
  venueId: string;
  fieldId: string;
  fetchFields: (page: number) => void;
}

export default function FieldEditDialog({
  openDialog,
  onClose,
  venueId,
  fieldId,
  fetchFields,
}: FieldEditDialogProps) {
  const { findFieldById, updateField, updateFieldLoading } = useField(venueId);

  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [sportTypeId, setSportTypeId] = useState<number>(0);
  const [fieldName, setFieldName] = useState("");
  const [defaultPrice, setDefaultPrice] = useState<number | string>("");
  const [loading, setLoading] = useState(false);

  // Load danh sách sport types khi mở dialog
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
    }
  }, [openDialog]);

  // Load dữ liệu field khi mở dialog hoặc fieldId thay đổi
  useEffect(() => {
    const loadField = async () => {
      if (openDialog && fieldId) {
        setLoading(true);
        const res = await findFieldById(fieldId);
        if (res?.data) {
          setSportTypeId(res.data.sport_type_id);
          setFieldName(res.data.field_name);
          setDefaultPrice(res.data.default_price);
        }
        setLoading(false);
      }
    };
    loadField();
  }, [openDialog, fieldId]);

  const handleSave = async () => {
    const data = {
      venue_id: venueId,
      sport_type_id: sportTypeId,
      field_name: fieldName,
      default_price: defaultPrice ? Number(defaultPrice) : 0,
      is_active: true,
    };

    await updateField(fieldId, data);
    onClose();
    fetchFields(1);
  };

  const renderInput = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="venue_id">Venue ID</Label>
          <Input id="venue_id" value={venueId} disabled readOnly />
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
                <SelectItem
                  key={sport.sport_type_id}
                  value={sport.sport_type_id.toString()}
                >
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
            placeholder="Nhập Tên Sân"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_price">Giá Niêm Yết</Label>
          <Input
            id="default_price"
            type="number"
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value)}
            placeholder="Nhập Giá Niêm Yết"
          />
        </div>
      </>
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Sân</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{renderInput()}</div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            disabled={updateFieldLoading || loading}
          >
            {updateFieldLoading ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
