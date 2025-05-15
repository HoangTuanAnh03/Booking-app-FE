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

  // const handleRefreshOpeningHours = () => {
  //   console.log("Refreshing opening hours...");
  // };

  return (
    <div className="container max-w-6xl mx-auto sm:px-6">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {field.data.field_name}
            </h1>
            <p className="text-muted-foreground mt-1">Chi tiết thông tin sân</p>
          </div>
          <Badge
            variant={isActive ? "default" : "destructive"}
            className="px-4 py-1.5 text-sm font-medium flex items-center gap-2"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-primary/10 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CoinsIcon className="h-5 w-5 text-primary" />
              Thông tin giá
            </h2>
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Giá niêm yết</span>
              <span className="text-2xl font-bold text-primary">
                {field.data.default_price
                  ? formatCurrency(Number(field.data.default_price))
                  : "Chưa có giá"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="bg-primary/10 px-6 py-4 border-b">
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
              <span className="font-medium">
                {formatDate(field.data.created_at)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex gap-2 text-muted-foreground">
                <CalendarDaysIcon className="h-4 w-4" />
                Cập nhật lần cuối
              </div>
              <span className="font-medium">
                {formatDate(field.data.updated_at)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <div className="bg-primary/10 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            Lịch hoạt động
          </h2>
        </div>
        <CardContent className="p-6">
          <FieldOpeningHours
            fieldId={field.data.field_id}
            // refreshOpeningHours={handleRefreshOpeningHours}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDetail;
