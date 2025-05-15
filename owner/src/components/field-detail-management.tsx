// components/FieldDetailManager.tsx

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FieldItemDetailType } from "@/schemaValidations/field.schema";
import fieldApiRequest from "@/apiRequests/field";
import { toast } from "@/components/ui/use-toast";
import { DashboardHeader } from "@/components/venue-header";
import FieldDetail from "@/components/field-detail";
import { Skeleton } from "@/components/ui/skeleton";

export default function FieldDetailManager() {
  const searchParams = useSearchParams();
  const fieldIdFromUrl = searchParams.get("fieldId");

  const [field, setField] = useState<FieldItemDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const findFieldById = async (id: string): Promise<FieldItemDetailType | null> => {
    setDetailLoading(true);
    try {
      const { payload } = await fieldApiRequest.findById(id);
      return {
        ...payload,
        data: {
          ...payload.data,
          opening_hours_week: payload.data.opening_hours_week ?? [],
        },
      };
    } catch (error) {
      toast({
        title: "Không thể tải chi tiết sân",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
      return null;
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (fieldIdFromUrl) {
      const fetchFieldDetails = async () => {
        const fieldData = await findFieldById(fieldIdFromUrl);
        setField(fieldData);
        setLoading(false);
      };

      fetchFieldDetails();
    } else {
      setLoading(false);
    }
  }, [fieldIdFromUrl]);

  if (loading || detailLoading)
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-full max-w-lg" />
        <Skeleton className="h-6 w-full max-w-lg" />
        <Skeleton className="h-40 w-full max-w-4xl" />
      </div>
    );

  if (!field) return <div className="container mx-auto py-6 text-red-600">Field not found</div>;

  return (
    <>
      <DashboardHeader />
      <main className="container mx-auto py-6">
        <FieldDetail field={field} />
      </main>
    </>
  );
}
