import type { FC } from "react";
import type { FieldItemDetailType } from "@/schemaValidations/field.schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  CoinsIcon,
  CheckCircle2Icon,
  XCircleIcon,
  CalendarDaysIcon,
} from "lucide-react";
import FieldOpeningHours from "@/components/field-openning-hours";

interface FieldDetailProps {
  field: FieldItemDetailType;
}

const FieldDetail: FC<FieldDetailProps> = ({ field }) => {
  const isActive = field.data.is_active === 1;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="container max-w-6xl mx-auto space-y-8 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{field.data.field_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">Chi tiết thông tin cụm sân</p>
        </div>
        <Badge
          variant={isActive ? "default" : "destructive"}
          className="text-sm font-medium px-3 py-1.5 flex items-center gap-2"
        >
          {isActive ? (
            <>
              <CheckCircle2Icon className="h-4 w-4" />
              Đang hoạt động
            </>
          ) : (
            <>
              <XCircleIcon className="h-4 w-4" />
              Đã khóa
            </>
          )}
        </Badge>
      </div>

      {/* Price & Time Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Giá */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-muted/50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CoinsIcon className="h-5 w-5 text-primary" />
              Thông tin giá
            </h2>
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Giá niêm yết</span>
              <span className="text-xl font-bold text-primary">
                {field.data.default_price
                  ? formatCurrency(Number(field.data.default_price))
                  : "Chưa có giá"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Thời gian */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-muted/50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5 text-primary" />
              Thông tin thời gian
            </h2>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                Ngày tạo
              </div>
              <span className="font-medium">{formatDate(field.data.created_at)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-muted-foreground">
                <CalendarDaysIcon className="h-4 w-4" />
                Cập nhật lần cuối
              </div>
              <span className="font-medium">{formatDate(field.data.updated_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lịch hoạt động */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <div className="bg-muted/50 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            Lịch hoạt động
          </h2>
        </div>
        <CardContent className="p-6">
          <FieldOpeningHours fieldId={field.data.field_id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDetail;
