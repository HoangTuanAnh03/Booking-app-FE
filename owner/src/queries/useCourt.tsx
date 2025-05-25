import { useMutation, useQuery } from "@tanstack/react-query";
import courtApiRequest from "@/apiRequests/court";
import { BookingRequest } from "@/types/court";
import {
  CreateCourtInput,
  CreateCourtResponse,
  DeleteCourtResponse,
  UpdateStatusCourtResponse,
} from "@/schemaValidations/court-schema";

export const useGetCourtTimeByFieldId = (id: string, date: string) => {
  return useQuery({
    queryKey: ["getCourtTimeByFieldId", id, date],
    queryFn: () => courtApiRequest.sGetCourtTimeByFieldId(id, date),
    staleTime: 10 * 1000,
  });
};

export const useCreateBooking = (bookingRequest: BookingRequest) => {
  return useQuery({
    queryKey: ["createBooking", bookingRequest],
    queryFn: () => courtApiRequest.sCreateBooking(bookingRequest),
    staleTime: 10 * 1000,
  });
};

export const useCreateBookingMutation = () => {
  return useMutation({
    mutationFn: courtApiRequest.sCreateBooking,
  });
};

export const useConfirmBooking = () => {
  return useMutation({
    mutationFn: courtApiRequest.sConfirmBooking,
  });
};

export const useGetCourtsByFieldId = (fieldId: string) => {
  return useQuery({
    queryKey: ["courts", fieldId],
    queryFn: () => courtApiRequest.sGetCourtsByFieldId(fieldId),

    // Chuyển dữ liệu API trả về từ object sang array cho dễ dùng ở UI
    select: (response) => {
      const courtsObj = response.payload.data.courts || {};
      return Object.values(courtsObj);
    },
    // Chỉ gọi API nếu fieldId không rỗng, tránh lỗi không cần thiết
    enabled: Boolean(fieldId),
    staleTime: 10000,
  });
};

export const useCreateCourtMutation = () => {
  return useMutation<CreateCourtResponse, unknown, CreateCourtInput>({
    mutationFn: async (newCourt) => {
      const response = await courtApiRequest.sCreateCourt(newCourt);
      return response.payload;
    },
  });
};

export const useDeleteCourtMutation = () => {
  return useMutation<DeleteCourtResponse, unknown, string>({
    mutationFn: async (courtId: string) => {
      const response = await courtApiRequest.sDeleteCourt(courtId);
      return response.payload;
    },
  });
};

export const useUpdateCourtStatusMutation = () => {
  return useMutation<
    UpdateStatusCourtResponse,
    unknown,
    { courtId: string; isActive: boolean }
  >({
    mutationFn: async ({ courtId, isActive }) => {
      const response = await courtApiRequest.sUpdateCourtStatus(
        courtId,
        isActive
      );
      return response.payload;
    },
  });
};
