import { z } from "zod";

export const fieldPriceSchema = z.object({
  field_price_id: z.number(),
  field_id: z.string().uuid().or(z.string()),
  day_of_week: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  price: z.string(),
  min_rental: z.number(),
});

// Điều chỉnh schema để phù hợp với dữ liệu phản hồi từ API
export const fieldPriceListResponseSchema = z.object({
  status: z.literal(200),
  payload: z.object({
    status: z.literal(200),
    message: z.string(),
    data: z.array(fieldPriceSchema), // Dữ liệu giá sân
  }),
});

export const fieldPriceItemSaveSchema = z.object({
  day_of_week: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  price: z.number(),
  min_rental: z.number(),
});

export const fieldPriceSaveSchema = z.object({
  field_prices: z.array(fieldPriceItemSaveSchema),
});

export type FieldPrice = z.infer<typeof fieldPriceSchema>;
export type FieldPriceListResponse = z.infer<typeof fieldPriceListResponseSchema>;
export type FieldPriceSavePayload = z.infer<typeof fieldPriceSaveSchema>;

