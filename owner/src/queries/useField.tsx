import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast"; // Giả sử bạn đã tạo hook này
import {
  CreateFieldSchemaType,
  EditFieldType,
  FieldItemDetailType,
  FieldItemType,
} from "@/schemaValidations/field.schema";
import fieldApiRequest from "@/apiRequests/field";

export default function useField(venueId: string, page: number = 1) {
  const { toast } = useToast();

  const [fields, setFields] = useState<FieldItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    total: 0,
    currentPage: 1,
    lastPage: 1,
  });

  const [createFieldLoading, setCreateFieldLoading] = useState(false);
  const [updateFieldLoading, setUpdateFieldLoading] = useState(false);
  const [deleteFieldLoading, setDeleteFieldLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Hàm tải danh sách fields
  const fetchFields = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const { payload } = await fieldApiRequest.getByVenueId(venueId, page);
        setFields(payload.data.data);
        setMeta({
          total: payload.data.total,
          currentPage: payload.data.current_page,
          lastPage: payload.data.last_page,
        });
      } catch (error) {
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể lấy danh sách sân.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [venueId, toast]
  );

  // Fetch fields khi venueId hoặc page thay đổi
  useEffect(() => {
    fetchFields(page);
  }, [venueId, page, fetchFields]);

  // Hàm tạo sân mới
  const createField = async (data: CreateFieldSchemaType) => {
    setCreateFieldLoading(true);
    try {
      await fieldApiRequest.createField(data);
      toast({
        title: "Thành công",
        description: "Đã thêm sân mới.",
        variant: "default", // Bạn có thể thay đổi thành "success" để thông báo thành công
      });
      fetchFields(1); // Lấy lại dữ liệu sau khi tạo
    } catch (error) {
      toast({
        title: "Thêm sân thất bại",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setCreateFieldLoading(false);
    }
  };

  // Hàm cập nhật sân
  const updateField = async (id: string, data: EditFieldType) => {
    setUpdateFieldLoading(true);
    try {
      await fieldApiRequest.updateField(id, data);
      toast({
        title: "Cập nhật thành công",
        description: "Sân đã được cập nhật.",
        variant: "default",
      });
      fetchFields(meta.currentPage);
    } catch (error) {
      toast({
        title: "Cập nhật thất bại",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setUpdateFieldLoading(false);
    }
  };

  // Hàm xóa sân
  const deleteField = async (id: string) => {
    setDeleteFieldLoading(true);
    try {
      await fieldApiRequest.deleteField(id);
      toast({
        title: "Xóa thành công",
        description: "Sân đã được xóa.",
        variant: "default",
      });
      fetchFields(meta.currentPage);
    } catch (error) {
      toast({
        title: "Xóa thất bại",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setDeleteFieldLoading(false);
    }
  };

  const findFieldById = async (
    id: string
  ): Promise<FieldItemDetailType | null> => {
    setDetailLoading(true);
    try {
      const { payload } = await fieldApiRequest.findById(id);
      return payload;
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


  return {
    fields,
    loading,
    meta,
    fetchFields,
    createField,
    updateField,
    deleteField,
    findFieldById,
    createFieldLoading,
    updateFieldLoading,
    deleteFieldLoading,
    detailLoading,
  };
}
