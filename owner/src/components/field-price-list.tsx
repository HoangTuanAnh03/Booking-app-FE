import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Coins, Timer } from "lucide-react";

interface FieldPrice {
  field_price_id: string;
  start_time: string;
  end_time: string;
  price: number;
  min_rental: number;
}

interface FieldPriceListProps {
  prices: FieldPrice[];
}

const FieldPriceList: React.FC<FieldPriceListProps> = ({ prices }) => {
  if (!prices || prices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Không có khung giá nào cho ngày này.
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {prices.map((price) => (
        <div
          key={price.field_price_id}
          className="rounded-2xl border bg-card shadow-sm p-4 space-y-2"
        >
          <div className="flex items-center gap-2 text-primary font-semibold text-base">
            <Clock className="w-4 h-4" />
            <span>
              {price.start_time} - {price.end_time}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="w-4 h-4" />
            <span>{Number(price.price).toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>Tối thiểu {price.min_rental} phút</span>
          </div>

          <div className="pt-2">
            <Badge variant="secondary" className="text-xs rounded-full px-3 py-1">
              Giá sân áp dụng
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldPriceList;
