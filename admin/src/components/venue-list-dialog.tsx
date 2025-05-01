// components/venue/VenueDialog.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { VenueItemType } from "@/schemaValidations/venue.schema";
  
  interface Props {
    open: boolean;
    venue: VenueItemType | null;
    onConfirm: () => void;
    onClose: () => void;
  }
  
  export default function VenueDialog({ open, venue, onConfirm, onClose }: Props) {
    if (!venue) return null;
  
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái sân</DialogTitle>
            <DialogDescription>
              <strong className="text-blue-500">Mở khoá</strong> trạng thái{" "}
              <strong>{venue.name}</strong>
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
  