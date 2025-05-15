import z from "zod";


// Định nghĩa schema cho giờ mở cửa
const OpeningHourSchema = z.object({
  day_of_week: z.string(), // Ví dụ: "Monday", "Friday", "Sunday"
  opening_time: z.string(), // Ví dụ: "07:00"
  closing_time: z.string(), // Ví dụ: "22:00"
});

// Định nghĩa schema cho yêu cầu tạo giờ mở cửa
export const CreateOpeningHoursSchema = z.object({
  field_id: z.string(),
  opening_hours: z.array(OpeningHourSchema), // Mảng các giờ mở cửa
});

// Định nghĩa schema cho yêu cầu cập nhật giờ mở cửa
export const UpdateOpeningHoursSchema = z.object({
  field_id: z.string(),
  opening_hours: z.array(OpeningHourSchema), // Mảng các giờ mở cửa
});
const OpeningHourDetailSchema = z.object({
  opening_id: z.number(),
  field_id: z.string(),
  day_of_week: z.string(),
  opening_time: z.string(),
  closing_time: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
// Định nghĩa schema cho phản hồi của API showByFieldId
export const ShowOpeningHoursByFieldIdResSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(OpeningHourDetailSchema),
});

export type OpeningHour = z.infer<typeof OpeningHourSchema>;
export type CreateOpeningHoursSchemaType = z.infer<typeof CreateOpeningHoursSchema>;
export type UpdateOpeningHoursSchemaType = z.infer<typeof UpdateOpeningHoursSchema>;
export type ShowOpeningHoursByFieldIdResType = z.infer<typeof ShowOpeningHoursByFieldIdResSchema>;