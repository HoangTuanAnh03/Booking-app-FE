import fieldApiRequest from "@/apiRequests/field";
import {
  FieldPrice,
  FieldPriceListResponse,
  fieldPriceListResponseSchema,
  FieldPriceSavePayload,
} from "@/schemaValidations/field-price.schema";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const useFieldPrice = (fieldId: string) => {
//   const [fieldPrices, setFieldPrices] = useState<FieldPrice[]>([]);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     const fetchFieldPrices = async () => {
//       try {
//         const response = await fieldApiRequest.getAllFieldPrices(fieldId);
//         // console.log(response);
//         const data = fieldPriceListResponseSchema.parse(response);
//         setFieldPrices(data.payload.data);
//         setIsLoaded(true);
//       } catch (err) {
//         console.error("Lỗi khi tải dữ liệu giá sân", err);
//       }
//     };

//     if (fieldId) {
//       fetchFieldPrices();
//     }
//   }, [fieldId]);

//   return { fieldPrices, isLoaded };
// };
export const useFieldPrice = (fieldId: string) => {
  const query = useQuery({
    queryKey: ["fieldPrices", fieldId],
    queryFn: async () => {
      const response = await fieldApiRequest.getAllFieldPrices(fieldId);
      const data = fieldPriceListResponseSchema.parse(response);
      return data.payload.data;
    },
    enabled: !!fieldId,
  });

  return {
    fieldPrices: query.data ?? [],
    isLoaded: query.isSuccess,
    isLoading: query.isLoading,
  };
};
export const useSaveFieldPrices = (fieldId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FieldPriceSavePayload) =>
      {
      return fieldApiRequest.saveFieldPrices(fieldId, data) },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fieldPrices", fieldId] });
    },
    onError: (error) => {
      console.error("Lỗi khi lưu giá sân:", error.message);
    },
  });
};

export const useFieldPricesByDay = (fieldId: string, day: string) => {
  return useQuery<FieldPriceListResponse>({
    queryKey: ["fieldPricesByDay", fieldId, day],
    queryFn: async () => {
      const response = await fieldApiRequest.getFieldPricesByDay(fieldId, day);
      return fieldPriceListResponseSchema.parse(response);
    },
    enabled: !!fieldId && !!day, 
  });
};