// import React from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
// import { FieldItemType } from "@/schemaValidations/field.schema";
// import { Button } from "@/components/ui/button";

// interface FieldDetailDialogProps {
//   open: boolean;
//   onClose: () => void;
//   field: FieldItemType;
// }

// export default function FieldDetailDialog({ open, onClose, field }: FieldDetailDialogProps) {
//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Chi tiết sân: {field.field_name}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-2">
//           <p><strong>Tên sân:</strong> {field.field_name}</p>
//           <p><strong>Trạng thái:</strong> {field.is_active === 1 ? "Đang hoạt động" : "Đã khóa"}</p>
//           <p><strong>Giá niêm yết:</strong> {field.default_price ? `VND ${field.default_price}` : "Chưa có giá"}</p>
//           <p><strong>Ngày tạo:</strong> {new Date(field.created_at).toLocaleString()}</p>
//           <p><strong>Ngày cập nhật:</strong> {new Date(field.updated_at).toLocaleString()}</p>
//         </div>
//         <DialogFooter>
//           <DialogClose>
//             <Button variant="outline" onClick={onClose}>Đóng</Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
