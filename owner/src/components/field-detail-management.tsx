"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FieldItemDetailType } from "@/schemaValidations/field.schema";
import fieldApiRequest from "@/apiRequests/field";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/venue-header";
import FieldDetail from "@/components/field-detail";
import { Loader2, AlertTriangle } from "lucide-react";
import CourtList from "@/components/court-list";

export default function FieldDetailManager() {
  const searchParams = useSearchParams();
  const fieldIdFromUrl = searchParams.get("fieldId");

  const [field, setField] = useState<FieldItemDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFieldDetails = async (id: string) => {
    try {
      const { payload } = await fieldApiRequest.findById(id);
      setField({
        ...payload,
        data: {
          ...payload.data,
          opening_hours_week: payload.data.opening_hours_week ?? [],
        },
      });
    } catch (error) {
      toast({
        title: "Không thể tải chi tiết sân",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fieldIdFromUrl) {
      fetchFieldDetails(fieldIdFromUrl);
    } else {
      setLoading(false);
    }
  }, [fieldIdFromUrl]);

  return (
    <>
      <DashboardHeader field={field ? { ...field.data, opening_hour_today: (field.data as any).opening_hour_today ?? null } : undefined}/>
      <main className="container mx-auto py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Đang tải thông tin cụm sân...</p>
          </div>
        ) : !field ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <p>Không tìm thấy thông tin cụm sân.</p>
          </div>
        ) : (
          <>
          <FieldDetail field={field} />
          <div className="mt-6 px-14">
            <CourtList fieldId={field.data.field_id} />
          </div>
        </>
        )}
      </main>
    </>
  );
}
