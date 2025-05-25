import http from "@/utils/api";
import {BookingRequest, CourtByField, PaymentInf} from "@/types/court";
import { CourtByFieldResponse, CreateCourtInput, CreateCourtResponse, DeleteCourtResponse, UpdateStatusCourtResponse } from "@/schemaValidations/court-schema";

const courtApiRequest = {
    sGetCourtTimeByFieldId: (id: string, date: string) => http.post<IBackendRes<CourtByField>>(`/court/getByField/${id}`, {date: date}),
    sCreateBooking: (bookingRequest: BookingRequest) => http.post<IBackendRes<PaymentInf>>(`/bookings`, bookingRequest),
    sConfirmBooking: (bookingId: string) => http.get<IBackendRes<any>>(`/bookings/${bookingId}/confirm`),

    sGetCourtsByFieldId: (fieldId: string) =>
    http.get<CourtByFieldResponse>(`/court/getByField/${fieldId}`),
    
    sCreateCourt: (data: CreateCourtInput) =>
    http.post<CreateCourtResponse>(`/court`, data),

    sDeleteCourt: (courtId: string) =>
    http.delete<DeleteCourtResponse>(`/court/${courtId}`, {}),

    sUpdateCourtStatus: (courtId: string, isActive: boolean) =>
    http.put<UpdateStatusCourtResponse>(`/court/${courtId}`, { is_active: isActive }),
}

export default courtApiRequest;