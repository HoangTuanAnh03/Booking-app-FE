import { Pencil, Eye, Trash2, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import type { FieldItemType } from "@/schemaValidations/field.schema"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface Props {
  venueId: string
  fields: FieldItemType[]
  loading: boolean
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
  setSelectedField: (field: FieldItemType | null) => void
  onDelete: (id: string) => void
  onEdit: (fieldId: string) => void  // Thêm callback cho nút sửa
}

export default function FieldTable({
  venueId,
  fields,
  loading,
  openDialog,
  setOpenDialog,
  setSelectedField,
  onDelete,
  onEdit,
}: Props) {
  const router = useRouter()

  const handleAddNew = () => {
    setSelectedField(null)
    setOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sân này?")) {
      onDelete(id);
    }
  };

  // Hàm xử lý khi nút sửa bấm, gọi callback do component cha truyền xuống
  const handleEdit = (fieldId: string) => {
    onEdit(fieldId);
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Chưa có giá"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-10">
        <CardTitle className="text-xl font-semibold">Danh sách sân</CardTitle>
        <Button onClick={handleAddNew} size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm sân
        </Button>
      </CardHeader>
      <CardContent className="p-0">

        <div className="overflow-x-auto px-10">
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-1/5">Tên sân</TableHead>
                <TableHead className="w-1/6">Giá niêm yết</TableHead>
                <TableHead className="w-1/6">Trạng thái</TableHead>
                <TableHead className="w-1/6 text-center">Chi tiết</TableHead>
                <TableHead className="w-1/5 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-9 w-[90px] rounded-md" />
                        <Skeleton className="h-9 w-[70px] rounded-md" />
                      </div>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : fields.length > 0 ? (
                fields.map((field: FieldItemType) => (
                  <TableRow key={field.field_id}>
                    <TableCell className="font-medium">{field.field_name}</TableCell>
                    <TableCell>{formatCurrency(Number(field.default_price))}</TableCell>
                    <TableCell>
                      <Badge variant={field.is_active === 1 ? "default" : "destructive"} className="px-2 py-0.5">
                        {field.is_active === 1 ? "Hoạt động" : "Đã khóa"}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/venue/fielddetail?fieldId=${field.field_id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-5">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(field.field_id)}>
                          <Pencil className="w-4 h-4 mr-1" />
                          Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(field.field_id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="py-6">
                      <p className="text-muted-foreground mb-2">Chưa có sân nào</p>
                      <Button onClick={handleAddNew}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sân mới
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

