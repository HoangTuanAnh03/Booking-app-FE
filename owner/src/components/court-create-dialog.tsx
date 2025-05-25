"use client";

import { useState } from "react";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCourtMutation } from "@/queries/useCourt";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type CourtCreateDialogProps = {
  fieldId: string;
  onSuccess?: () => void;
};

export const CourtCreateDialog = ({ fieldId, onSuccess }: CourtCreateDialogProps) => {
  const [courtName, setCourtName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const queryClient = useQueryClient();

  const createCourt = useCreateCourtMutation();

const handleSubmit = () => {
    if (!courtName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên sân",
        variant: "destructive",
      });
      return;
    }

    createCourt.mutate(
      {
        court_name: courtName.trim(),
        is_active: isActive,
        field_id: fieldId,
      },
      {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
            queryKey: ["courts", fieldId],
          });
          toast({
            title: "Thành công",
            description: data?.message || "Tạo sân thành công!",
          });
          setCourtName("");
          setIsActive(true);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast({
            title: "Lỗi",
            description: error?.response?.data?.message || "Tạo sân thất bại",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Thêm sân mới</DialogTitle>
        <DialogDescription>Nhập thông tin để tạo sân mới.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="courtName">Tên sân</Label>
          <Input
            id="courtName"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
            placeholder="Nhập tên sân"
            disabled={createCourt.isPending}
            autoFocus
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            disabled={createCourt.isPending}
          />
          <Label htmlFor="isActive">Hoạt động</Label>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={handleSubmit} disabled={createCourt.isPending}>
          {createCourt.isPending ? "Đang thêm..." : "Thêm"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
