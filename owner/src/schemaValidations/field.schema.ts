import z from "zod";

// Định nghĩa từng item field
export const FieldItem = z.object({
  field_id: z.string(),
  venue_id: z.string(),
  sport_type_id: z.number(),
  field_name: z.string(),
  default_price: z.string(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  opening_hour_today: z.string().nullable(),
});

// Định nghĩa schema cho giờ mở cửa
const OpeningHourSchema = z.object({
  day_of_week: z.string(), // Ví dụ: "Monday", "Friday", "Sunday"
  opening_time: z.string(), // Ví dụ: "07:00"
  closing_time: z.string(), // Ví dụ: "22:00"
});


export const FieldItemDetail = z.object({
  data: z.object({
    field_id: z.string(),
    venue_id: z.string(),
    sport_type_id: z.number(),
    field_name: z.string(),
    default_price: z.string(),
    is_active: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    opening_hours_week: z.array(OpeningHourSchema), 
  }),
  message: z.string().optional(), // Có thể có thông báo kèm theo (tuỳ chọn)
});

export const PaginationMetaSchema = z.object({
  current_page: z.number(),
  data: z.array(FieldItem),
  first_page_url: z.string(),
  from: z.number().nullable(),
  last_page: z.number(),
  last_page_url: z.string(),
  links: z.array(
    z.object({
      url: z.string().nullable(),
      label: z.string(),
      active: z.boolean(),
    })
  ),
  next_page_url: z.string().nullable(),
  path: z.string(),
  per_page: z.number(),
  prev_page_url: z.string().nullable(),
  to: z.number().nullable(),
  total: z.number(),
});

export const GetFieldListByVenueIdResSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: PaginationMetaSchema,
});

export const CreateFieldSchema = z.object({
  venue_id: z.string().uuid(),
  sport_type_id: z.number().int().positive(),
  field_name: z.string().min(1),
  default_price: z.union([z.string(), z.number()]).refine(val => !isNaN(Number(val))),
});

export const EditFieldSchema = z.object({
  venue_id: z.string().uuid(),
  sport_type_id: z.number().int().positive(),
  field_name: z.string().min(1, "Tên sân không được để trống"),
  default_price: z.number().nonnegative(),
  is_active: z.boolean(),
})



export type FieldItemType = z.infer<typeof FieldItem>;
export type FieldListResType = z.infer<typeof GetFieldListByVenueIdResSchema>;
export type CreateFieldSchemaType = z.infer<typeof CreateFieldSchema>;
export type EditFieldType = z.infer<typeof EditFieldSchema>;
export type FieldItemDetailType = z.infer<typeof FieldItemDetail>;
