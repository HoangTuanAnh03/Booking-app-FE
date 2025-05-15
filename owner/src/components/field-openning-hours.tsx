import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useFieldOpeningHours } from "@/queries/useFieldOpenningHours";
import FieldOpeningDialog from "./field-openning-dialog";
import { useFieldPrice } from "@/queries/useFieldPrice";
import { ChevronDown, ChevronUp } from "lucide-react";
import FieldPriceList from "@/components/field-price-list";
import FieldPriceDialog from "@/components/field-price-dialog";
import { OpeningHour } from "@/schemaValidations/field-openning.schema";

interface FieldOpeningHoursProps {
  fieldId: string;
}

export default function FieldOpeningHours({ fieldId }: FieldOpeningHoursProps) {
  const { fieldPrices, isLoaded } = useFieldPrice(fieldId);
  
  const {
    openingHours,
    updateOpeningHours,
    createOpeningHours,
    isLoading: openingHoursLoading,
  } = useFieldOpeningHours(fieldId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<string>("");
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceEditingDay, setPriceEditingDay] = useState<string>("");

  const handleOpenPriceDialog = (dayOfWeek: string) => {
    setPriceEditingDay(dayOfWeek);
    setPriceDialogOpen(true);
  };

  const handleToggleDay = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSave = (fieldId: string, updatedOpeningHours: OpeningHour[]) => {
    const mutationFn = isEditing ? updateOpeningHours : createOpeningHours;
    mutationFn.mutate(
      {
        field_id: fieldId,
        opening_hours: updatedOpeningHours,
      },
      {
        onSuccess: () => {
          toast({
            title: isEditing ? "Đã cập nhật giờ mở cửa" : "Đã thêm giờ mở cửa",
          });
          setDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Giờ mở cửa theo ngày</h2>
        <Button
          onClick={() => {
            setIsEditing(false);
            setEditingDay("");
            setDialogOpen(true);
          }}
        >
          Thời gian mở cửa
        </Button>
      </div>

      <div className="border rounded-md p-4 space-y-2">
        {openingHoursLoading ? (
          <p className="text-muted-foreground">Đang tải giờ mở cửa...</p>
        ) : openingHours.length === 0 ? (
          <p className="text-muted-foreground">
            Chưa có giờ mở cửa được thiết lập.
          </p>
        ) : (
          openingHours.map((item) => (
            <div
              key={`${item.day_of_week}-${item.opening_time}-${item.closing_time}`}
              className="border-b pb-2 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.day_of_week}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.opening_time} - {item.closing_time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      handleOpenPriceDialog(item.day_of_week);
                    }}
                  >
                    Cập nhật giá
                  </Button>
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true);
                      setEditingDay(item.day_of_week);
                      setDialogOpen(true);
                    }}
                  >
                    Chỉnh sửa
                  </Button> */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleDay(item.day_of_week)}
                  >
                    {expandedDays[item.day_of_week] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedDays[item.day_of_week] && (
                <div className="mt-2 space-y-1 pl-4 border-l">
                  {item.day_of_week && item.day_of_week.length > 0 ? (
                    <FieldPriceList
                      prices={fieldPrices
                        .filter(
                          (price) => price.day_of_week === item.day_of_week
                        )
                        .map((price) => ({
                          ...price,
                          field_price_id: price.field_price_id.toString(),
                          price: Number(price.price),
                        }))}
                    />
                  ) : (
                    <p>Chưa có giá cho ngày này.</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <FieldOpeningDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fieldId={fieldId}
        openingHours={openingHours}
        onSave={handleSave}
      />
      <FieldPriceDialog
        open={priceDialogOpen}
        onOpenChange={setPriceDialogOpen}
        fieldId={fieldId}
        dayOfWeek={priceEditingDay}
        fieldPrices={fieldPrices.map(price => ({
    ...price,
    start_time: price.start_time.slice(0, 5),
    end_time: price.end_time.slice(0, 5),
  }))}
      />
    </div>
  );
}
