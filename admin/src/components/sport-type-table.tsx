"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Info } from "lucide-react"
import type { SportType } from "@/types/sport-type"
import { fetchSportTypes, deleteSportType } from "@/lib/api"

interface SportTypeTableProps {
  searchQuery: string
  onEdit: (sportType: SportType) => void
  onSuccess: (message: string) => void
}

export function SportTypeTable({ searchQuery, onEdit, onSuccess }: SportTypeTableProps) {
  const [sportTypes, setSportTypes] = useState<SportType[]>([])
  const [filteredSportTypes, setFilteredSportTypes] = useState<SportType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sportTypeToDelete, setSportTypeToDelete] = useState<SportType | null>(null)

  useEffect(() => {
    loadSportTypes()
  }, [])

  useEffect(() => {
    if (!Array.isArray(sportTypes)) {
      console.error("sportTypes is not an array:", sportTypes)
      return
    }

    if (searchQuery.trim() === "") {
      setFilteredSportTypes(sportTypes)
    } else {
      const lowercasedQuery = searchQuery.toLowerCase()
      setFilteredSportTypes(
        sportTypes.filter(
          (sportType) => sportType && sportType.name && sportType.name.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }
  }, [searchQuery, sportTypes])

  const loadSportTypes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchSportTypes()
      console.log("Fetched sport types:", data)

      // Ensure we have an array of valid sport types
      const validSportTypes = Array.isArray(data) ? data.filter((item) => item && typeof item === "object") : []

      setSportTypes(validSportTypes)
      setFilteredSportTypes(validSportTypes)
    } catch (err) {
      console.error("Error loading sport types:", err)
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteClick = (sportType: SportType) => {
    setSportTypeToDelete(sportType)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!sportTypeToDelete) return

    try {
      await deleteSportType(sportTypeToDelete.sport_type_id)
      setSportTypes(sportTypes.filter((st) => st.sport_type_id !== sportTypeToDelete.sport_type_id))
      onSuccess(`Đã xóa "${sportTypeToDelete.name}" thành công`)
    } catch (err) {
      console.error("Error deleting sport type:", err)
      onSuccess("Không thể xóa loại thể thao. Vui lòng thử lại sau.")
    } finally {
      setDeleteDialogOpen(false)
      setSportTypeToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-4">
        <div className="flex items-center gap-2 text-destructive">
          <Info className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
        <Button variant="outline" onClick={loadSportTypes}>
          Thử lại
        </Button>
      </div>
    )
  }

  const sportTypesToRender = Array.isArray(filteredSportTypes) ? filteredSportTypes : []

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Tên loại thể thao</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-[100px] text-center">Trạng thái</TableHead>
              <TableHead className="w-[120px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sportTypesToRender.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Info className="h-8 w-8" />
                    <p>Không có dữ liệu</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sportTypesToRender.map((sportType) => (
                <TableRow key={sportType.sport_type_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{sportType.sport_type_id}</TableCell>
                  <TableCell className="font-medium">{sportType.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{sportType.description || "—"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Hoạt động
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(sportType)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Sửa</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(sportType)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại thể thao "{sportTypeToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
