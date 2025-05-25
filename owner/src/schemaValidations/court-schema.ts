import { z } from 'zod'

export const CreateCourtSchema = z.object({
  field_id: z.string().uuid(),
  court_name: z.string().min(1, 'Tên sân không được để trống'),
  is_active: z.boolean(),
})

export const CreateCourtResponseSchema = z.object({
  status: z.number(),
  message: z.string().nullable(),
  data: z.object({
    court_id: z.string(),
    field_id: z.string().uuid(),
    court_name: z.string(),
    is_active: z.union([z.boolean(), z.literal(0), z.literal(1)]),
    created_at: z.string(),
    updated_at: z.string(),
  }),
})
export const CourtItemSchema = z.object({
  court_id: z.string(),
  field_id: z.string(),
  court_name: z.string(),
  is_active: z.union([z.number(), z.literal(0), z.literal(1)]),
})
export const CourtByFieldResponseSchema = z.object({
  status: z.number(),
  message: z.string().nullable(),
  data: z.object({
    courts: z.record(z.string(), CourtItemSchema),
  }),
})

export const DeleteCourtResponseSchema = z.object({
  status: z.number(),
  message: z.string().nullable(),
  data: z.string().nullable(),
})

export const UpdateStatusCourtResponseSchema = z.object({
  status: z.number(),
  message: z.string().nullable(),
  data: z.object({
    court_id: z.string(),
    field_id: z.string().uuid(),
    court_name: z.string(),
    is_active: z.union([z.boolean(), z.literal(0), z.literal(1)]),
    created_at: z.string(),
    updated_at: z.string(),
  }),
})

/* =======================
 *        Types
 * ======================= */
export type CreateCourtInput = z.infer<typeof CreateCourtSchema>
export type CreateCourtResponse = z.infer<typeof CreateCourtResponseSchema>
export type CourtItem = z.infer<typeof CourtItemSchema>
export type CourtByFieldResponse = z.infer<typeof CourtByFieldResponseSchema>
export type DeleteCourtResponse = z.infer<typeof DeleteCourtResponseSchema>
export type UpdateStatusCourtResponse = z.infer<typeof UpdateStatusCourtResponseSchema>