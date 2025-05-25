// useFieldOpeningHours.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import fieldApiRequest from "@/apiRequests/field";
import { CreateOpeningHoursSchemaType, ShowOpeningHoursByFieldIdResType, UpdateOpeningHoursSchemaType } from "@/schemaValidations/field-openning.schema";


export function useFieldOpeningHours(fieldId: string) {
  const queryClient = useQueryClient();

  const fetchOpeningHours = useQuery<ShowOpeningHoursByFieldIdResType, Error>({
    queryKey: ["openingHours", fieldId],
    queryFn: async () => {
      try {
        const { payload } = await fieldApiRequest.showByFieldId(fieldId);
        // console.log("Opening hours data:", payload);
        return payload;
      } catch (error) {
        toast({
          title: "Lỗi tải giờ mở cửa",
          description: "Không thể lấy giờ mở cửa cho sân này.",
          variant: "destructive",
        });
        throw error;
      }
    },
  });

  const createOpeningHours = useMutation({
    mutationFn: async (data: CreateOpeningHoursSchemaType) => {
      // console.log("Creating opening hours with data:", data);
      await fieldApiRequest.createOpeningHours(data);
    },
    onSuccess: () => {
      toast({
        title: "Thêm giờ mở cửa thành công",
        description: "Giờ mở cửa đã được thêm.",
      });
      queryClient.invalidateQueries({ queryKey: ["openingHours", fieldId] }); 
    },
    onError: () => {
      toast({
        title: "Thêm giờ mở cửa thất bại",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    },
  });

const updateOpeningHours = useMutation({
  mutationFn: async (data: UpdateOpeningHoursSchemaType) => {
    await fieldApiRequest.updateOpeningHours(data);
  },
  onSuccess: () => {
    toast({
      title: "Cập nhật giờ mở cửa thành công",
      description: "Giờ mở cửa đã được cập nhật.",
    });
    queryClient.invalidateQueries({ queryKey: ["openingHours", fieldId] });
  },
  onError: () => {
    toast({
      title: "Cập nhật giờ mở cửa thất bại",
      description: "Vui lòng thử lại.",
      variant: "destructive",
    });
  },
});


  return {
    openingHours: fetchOpeningHours.data?.data || [],
    createOpeningHours,
    updateOpeningHours,
    isLoading: fetchOpeningHours.isLoading,
    isError: fetchOpeningHours.isError,
  };
}
