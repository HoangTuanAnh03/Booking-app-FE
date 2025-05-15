import http from "@/utils/api";
import { CreateFieldSchemaType, FieldListResType, FieldItemDetailType, EditFieldType } from "@/schemaValidations/field.schema";
import { CreateOpeningHoursSchemaType, ShowOpeningHoursByFieldIdResType, UpdateOpeningHoursSchemaType } from "@/schemaValidations/field-openning.schema";
import { FieldPriceListResponse, FieldPriceSavePayload } from "@/schemaValidations/field-price.schema";
import { SportTypeListResponse } from "@/schemaValidations/sport-type.schema";

const fieldApiRequest = {
  getByVenueId: (venueId: string, page = 1) =>
    http.get<FieldListResType>(`/fields/getByVenueId/${venueId}?page=${page}`),

  createField: (data: CreateFieldSchemaType) =>
    http.post("/fields",data),

  updateField: (id: string, data: EditFieldType) =>
    http.put(`/fields/${id}`, data),

  deleteField: (id: string) =>
    http.delete(`/fields/${id}`, {}),

  findById: (id: string) =>
    http.get<FieldItemDetailType>(`/fields/${id}`),

  createOpeningHours: (data: CreateOpeningHoursSchemaType) =>
    http.post("/openingHours", data),

  updateOpeningHours: (data: UpdateOpeningHoursSchemaType) =>
    http.put("/openingHours", data),

  showByFieldId: (fieldId: string) =>
    http.get<ShowOpeningHoursByFieldIdResType>(`/showByFieldId/${fieldId}`),

  getAllFieldPrices: (fieldId: string) =>
    http.get<FieldPriceListResponse>(`/fieldPrice/${fieldId}`),

  saveFieldPrices: (fieldId: string, data: FieldPriceSavePayload) =>
    http.post(`/fieldPrice/${fieldId}`, data),

  getFieldPricesByDay: (fieldId: string, day: string) =>
    http.get<FieldPriceListResponse>(
      `/fieldPrice/${fieldId}?day=${day}`
    ),

    getSportTypes: () =>
    http.get<SportTypeListResponse>("/sportTypes"),
};

export default fieldApiRequest;
