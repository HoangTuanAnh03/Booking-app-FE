// components/user/UpgradeDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserItemType } from "@/schemaValidations/user.schema";

type Props = {
  open: boolean;
  user: UserItemType | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function UpgradeDialog({ open, user, onClose, onConfirm }: Props) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận nâng quyền</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn nâng <strong>{user.name}</strong> thành{" "}
            <strong className="text-red-500">Owner</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
