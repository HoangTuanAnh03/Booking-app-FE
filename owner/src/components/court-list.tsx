"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ListIcon,
  Lock,
  Unlock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useDeleteCourtMutation,
  useGetCourtsByFieldId,
  useUpdateCourtStatusMutation,
} from "@/queries/useCourt";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CourtCreateDialog } from "@/components/court-create-dialog";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type CourtListProps = {
  fieldId: string;
};

const CourtList: FC<CourtListProps> = ({ fieldId }) => {
  const { data: courts = [] } = useGetCourtsByFieldId(fieldId);
  const [open, setOpen] = useState(false);
  const deleteCourt = useDeleteCourtMutation();
  const updateCourtStatus = useUpdateCourtStatusMutation();
  const queryClient = useQueryClient();

  const handleToggleStatus = (courtId: string, currentStatus: number) => {
    const isActive = currentStatus === 0;

    updateCourtStatus.mutate(
      { courtId, isActive },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["courts", fieldId] });
          toast({
            title: "Thành công",
            description:
              isActive
                ? "Mở khoá sân thành công!"
                : "Khoá sân thành công!",
          });
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Cập nhật trạng thái sân thất bại",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = (courtId: string) => {
    const confirmed = confirm("Bạn có chắc chắn muốn xoá sân này không?");
    if (!confirmed) return;

    deleteCourt.mutate(courtId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["courts", fieldId] });

        toast({
          title: "Thành công",
          description: data?.data || "Xoá sân thành công!",
        });
      },
      onError: () => {
        toast({
          title: "Lỗi",
          description: "Xoá sân thất bại",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-muted/50 px-6 py-3 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ListIcon className="w-5 h-5 text-primary" />
          Danh sách sân trong cụm
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              + Thêm sân
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            {/* Dialog hiển thị form tạo sân, nhận fieldId và gọi onSuccess để đóng dialog */}
            <CourtCreateDialog
              fieldId={fieldId}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courts.map((court) => (
            <Card key={court.court_id} className="border shadow-sm p-4">
              <div className="flex justify-between gap-4">
                <div className="w-7/12 break-words">
                  <h3 className="text-base font-medium">{court.court_name}</h3>
                </div>

                <div className="w-5/12 flex flex-col items-end gap-2">
                  <Badge
                    className="h-6 min-w-[90px] flex items-center justify-center text-sm"
                    variant={court.is_active === 1 ? "default" : "secondary"}
                  >
                    {court.is_active === 1 ? "Hoạt động" : "Đã khóa"}
                  </Badge>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 flex items-center gap-1 hover:bg-muted transition"
                      onClick={() => handleToggleStatus(court.court_id, court.is_active)}
                      disabled={updateCourtStatus.status === "pending"}
                    >
                      {court.is_active ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Khóa
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Mở
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-16 px-0"
                      onClick={() => handleDelete(court.court_id)}
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourtList;
