"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/venue-header";
import { FieldItemType } from "@/schemaValidations/field.schema";
import FieldTable from "@/components/field-table";
import FieldPagination from "@/components/field-pagination";
import useFieldList from "@/queries/useField";
import FieldDialog from "@/components/field-add-dialog";
// import FieldDetailDialog from "@/components/field-detail-dialog"; // Import dialog chi tiết sân
import FieldEditDialog from "@/components/field-edit-dialog"; // Import dialog sửa sân

export default function FieldManagement() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get("venueId");
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);  // Trạng thái để kiểm soát dialog thêm sân
  const [selectedField, setSelectedField] = useState<FieldItemType | null>(null);

  // Trạng thái để quản lý dialog sửa sân
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState<string>("");

  const { fields, loading, meta, fetchFields, deleteField } = useFieldList(venueId ?? "", page);

  // Kiểm tra nếu không có venueId
  if (!venueId) {
    return (
      <>
        <DashboardHeader />
        <main className="container mx-auto py-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive text-base">
                Không tìm thấy venueId trong URL.
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
  // Hàm mở dialog sửa
  const handleEditField = (fieldId: string) => {
    setCurrentFieldId(fieldId);
    setOpenEditDialog(true); // Mở dialog sửa
  };

  return (
    <>
      <DashboardHeader />
      <main className="container mx-auto py-6 px-4 space-y-4">

        <FieldTable
          venueId={venueId}
          fields={fields}
          loading={loading}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          setSelectedField={setSelectedField}
          onDelete={deleteField}
          onEdit={handleEditField} 
        />

        <FieldPagination meta={meta} onPageChange={(newPage) => setPage(newPage)} />
      </main>

      {/* Dialog thêm sân */}
      <FieldDialog venueId={venueId} openDialog={openDialog} onClose={() => setOpenDialog(false)} fetchFields={fetchFields} />

      {/* Dialog sửa sân */}
      {openEditDialog && (
        <FieldEditDialog
          openDialog={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          venueId={venueId}
          fieldId={currentFieldId}
          fetchFields={fetchFields}
        />
      )}
    </>
  );
}

