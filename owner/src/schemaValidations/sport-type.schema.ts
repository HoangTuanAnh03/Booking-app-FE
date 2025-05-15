import { z } from "zod";

export const sportTypeSchema = z.object({
  sport_type_id: z.number(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const sportTypeListResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(sportTypeSchema),
});

export type SportType = z.infer<typeof sportTypeSchema>;
export type SportTypeListResponse = z.infer<typeof sportTypeListResponseSchema>;
