"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useFieldPricesByDay, useSaveFieldPrices } from "@/queries/useFieldPrice";
import { FieldPrice } from "@/schemaValidations/field-price.schema";
import { useQueryClient } from "@tanstack/react-query";

interface FieldPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldId: string;
  dayOfWeek?: string;
  fieldPrices: FieldPrice[];
}

export default function FieldPriceDialog({
  open,
  onOpenChange,
  fieldId,
  dayOfWeek,
  fieldPrices,
}: FieldPriceDialogProps) {
  const {
    data: fieldPriceData,
    isLoading,
    isError,
  } = useFieldPricesByDay(fieldId, dayOfWeek || "");
const saveMutation = useSaveFieldPrices(fieldId);

  const [localPrices, setLocalPrices] = useState<FieldPrice[]>([]);
//  const queryClient = useQueryClient();
  useEffect(() => {
  if (open && fieldPriceData) {
    setLocalPrices(fieldPriceData.payload.data);
  }
}, [open, fieldPriceData]);
  
  const handleChange = (
    index: number,
    key: "start_time" | "end_time" | "price" | "min_rental",
    value: string
  ) => {
    setLocalPrices((prev) => {
      const updated = [...prev];

      if (key === "min_rental") {
        updated[index][key] = Number(value);
      } else {
        updated[index][key] = value;
      }

      return updated;
    });
  };

  const handleAddTimeSlot = () => {
    setLocalPrices((prev) => [
      ...prev,
      {
        field_price_id: 0,
        field_id: fieldId,
        start_time: "",
        end_time: "",
        price: "",
        min_rental: 0,
        day_of_week: dayOfWeek || "",
      },
    ]);
  };

  const formatTimeHHmm = (time: string) => {
  // Nếu time có dạng "HH:mm:ss", lấy 5 ký tự đầu "HH:mm"
  // Nếu time đã là "HH:mm" thì giữ nguyên
  return time.length >= 5 ? time.slice(0, 5) : time;
};

const handleSave = async () => {
  if (!dayOfWeek) return;

  // Bỏ các phần tử trùng ngày
  const filteredOldPrices = fieldPrices.filter(
    (price) => price.day_of_week !== dayOfWeek
  );

  // Gộp dữ liệu cũ (các ngày khác) + localPrices (ngày đang cập nhật)
  const mergedPrices = [
    ...filteredOldPrices.map((price) => ({
      day_of_week: price.day_of_week,
      start_time: formatTimeHHmm(price.start_time),
      end_time: formatTimeHHmm(price.end_time),
      price: Number(price.price),
      min_rental: price.min_rental,
    })),
    ...localPrices.map((price) => ({
      day_of_week: price.day_of_week,
      start_time: formatTimeHHmm(price.start_time),
      end_time: formatTimeHHmm(price.end_time),
      price: Number(price.price),
      min_rental: price.min_rental,
    })),
  ];

  const payload = {
    field_prices: mergedPrices,
  };

  // console.log("Dữ liệu gửi lên:", payload);

  try {
    await saveMutation.mutateAsync(payload);
    toast({ title: "Cập nhật giá thành công!" });
//     await queryClient.refetchQueries({
//   queryKey: ['fieldPricesByDay', fieldId, dayOfWeek],
//   exact: true,
// });
    onOpenChange(false);
  } catch (error) {
    toast({ title: "Lỗi khi lưu giá", variant: "destructive" });
  }
};



  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div>Error: Could not load field prices for {dayOfWeek}</div>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật giá cho {dayOfWeek}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
          {localPrices.map((price, i) => (
            <div
              key={price.field_price_id || i}
              className="grid grid-cols-3 gap-4 border p-4 rounded-md"
            >
              <div className="flex flex-col">
                <label className="text-sm font-medium">Giờ bắt đầu</label>
                <Input
                  type="time"
                  value={price.start_time}
                  onChange={(e) =>
                    handleChange(i, "start_time", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Giờ kết thúc</label>
                <Input
                  type="time"
                  value={price.end_time}
                  onChange={(e) => handleChange(i, "end_time", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Giá (vnđ)</label>
                <Input
                  type="number"
                  placeholder="Giá"
                  value={price.price}
                  onChange={(e) => handleChange(i, "price", e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Tối thiểu (phút)</label>
                <Input
                  type="number"
                  placeholder="Tối thiểu"
                  value={price.min_rental}
                  onChange={(e) =>
                    handleChange(i, "min_rental", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAddTimeSlot} variant="secondary">
            Thêm khung giờ
          </Button>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
