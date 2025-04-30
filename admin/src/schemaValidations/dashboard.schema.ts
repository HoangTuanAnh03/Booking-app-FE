import { z } from 'zod'

// --- Sub Schemas ---

export const TotalRevenueItem = z.record(z.string(), z.number())

export const VenueItem = z.object({
  active: z.number(),
  locked: z.number(),
  banned: z.number(),
})

export const SportTypeDetailItem = z.object({
  name: z.string(),
  fields_count: z.number(),
})

export const SportTypeItem = z.object({
  count: z.number(),
  detail: z.array(SportTypeDetailItem),
})

// --- Main Schema ---

export const DashboardRes = z.object({
  data: z.object({
    totalRevenue: TotalRevenueItem,
    venue: VenueItem,
    sport_type: SportTypeItem,
  }),
  message: z.string(),
}).strict()

// --- Types ---

export type TotalRevenueItemType = z.infer<typeof TotalRevenueItem>
export type VenueItemType = z.infer<typeof VenueItem>
export type SportTypeDetailItemType = z.infer<typeof SportTypeDetailItem>
export type SportTypeItemType = z.infer<typeof SportTypeItem>
export type DashboardResType = z.infer<typeof DashboardRes>
