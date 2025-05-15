"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { OpeningHour } from "@/schemaValidations/field-openning.schema";
import { X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FieldOpeningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldId: string;
  openingHours: OpeningHour[];
  onSave: (fieldId: string, openingHours: OpeningHour[]) => void;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function FieldOpeningDialog({
  open,
  onOpenChange,
  fieldId,
  openingHours,
  onSave,
}: FieldOpeningDialogProps) {
  const [localOpeningHours, setLocalOpeningHours] = useState<OpeningHour[]>([]);

  useEffect(() => {
    if (open) {
      const hoursByDay = new Map(
        openingHours.map((item) => [item.day_of_week, item])
      );
      const merged = daysOfWeek.map((day) => {
        const old = hoursByDay.get(day);
        return old
          ? {
              day_of_week: old.day_of_week,
              opening_time: old.opening_time,
              closing_time: old.closing_time,
            }
          : {
              day_of_week: day,
              opening_time: "",
              closing_time: "",
            };
      });
      setLocalOpeningHours(merged);
    } else {
      setLocalOpeningHours([]);
    }
  }, [open, openingHours]);

  const handleChange = (
    day: string,
    field: "opening_time" | "closing_time",
    value: string
  ) => {
    setLocalOpeningHours((prev) =>
      prev.map((item) =>
        item.day_of_week === day ? { ...item, [field]: value } : item
      )
    );
  };

  // const clearTimeForDay = (day: string) => {
  //   setLocalOpeningHours((prev) =>
  //     prev.map((item) =>
  //       item.day_of_week === day
  //         ? { ...item, opening_time: "", closing_time: "" }
  //         : item
  //     )
  //   );
  // };

  const handleSave = () => {
    for (const item of localOpeningHours) {
      if (!item.opening_time || !item.closing_time) continue;

      if (item.opening_time >= item.closing_time) {
        toast({
          title: "Giờ không hợp lệ",
          description: `Giờ mở cửa phải nhỏ hơn giờ đóng cửa cho ngày ${item.day_of_week}.`,
          variant: "destructive",
        });
        return;
      }
    }

    const normalizeTime = (time: string) => time.slice(0, 5);

    const normalizedOpeningHours = localOpeningHours
      .filter((item) => item.opening_time && item.closing_time)
      .map(({ day_of_week, opening_time, closing_time }) => ({
        day_of_week,
        opening_time: normalizeTime(opening_time),
        closing_time: normalizeTime(closing_time),
      }));

    onSave(fieldId, normalizedOpeningHours);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa giờ mở cửa các ngày trong tuần</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <TooltipProvider>
            {localOpeningHours.map(({ day_of_week, opening_time, closing_time }) => (
              <div
                key={day_of_week}
                className="grid grid-cols-12 items-center gap-4 border rounded-xl px-4 py-3 hover:shadow-sm transition"
              >
                <Label className="col-span-3 font-semibold text-sm">
                  {day_of_week}
                </Label>
                <Input
                  type="time"
                  value={opening_time}
                  className="col-span-3"
                  onChange={(e) =>
                    handleChange(day_of_week, "opening_time", e.target.value)
                  }
                />
                <Input
                  type="time"
                  value={closing_time}
                  className="col-span-3"
                  onChange={(e) =>
                    handleChange(day_of_week, "closing_time", e.target.value)
                  }
                />
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => clearTimeForDay(day_of_week)}
                      className="col-span-1 hover:bg-red-100"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Xóa giờ cho ngày này</p>
                  </TooltipContent>
                </Tooltip> */}
              </div>
            ))}
          </TooltipProvider>
        </div>
        <Button onClick={handleSave} className="w-full mt-4">
          Lưu tất cả
        </Button>
      </DialogContent>
    </Dialog>
  );
}
