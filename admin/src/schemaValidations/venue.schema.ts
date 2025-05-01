import z from "zod";

// Một sân (venue) đơn lẻ
export const VenueItem = z.object({
  venue_id: z.string(),
  name: z.string(),
  address: z.string(),
  status: z.enum(["active", "locked"]),
  payment_status: z.string(),
});

export const VenueListRes = z.object({
  data: z.array(VenueItem),
  message: z.string(),
}).strict();

export const VenueActivateRes = z.object({
  data: z.object({
    venue_id: z.string(),
    owner_id: z.string(),
    name: z.string(),
    address: z.string(),
    longitude: z.string(),
    latitude: z.string(),
    coordinates: z.object({
      type: z.literal("Point"),
      coordinates: z.array(z.number()).length(2), 
    }),
    status: z.enum(["active", "locked"]),
    bank_account_number: z.string(),
    bank_name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
  message: z.string().optional(),
}).strict();

export const VenueAllListRes = z.object({
  status: z.number(),
  message: z.string().nullable(),
  data: z.object({
    current_page: z.number(),
    data: z.array(VenueItem),
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
  }),
}).strict();


export type VenueItemType = z.infer<typeof VenueItem>;
export type VenueListResType = z.infer<typeof VenueListRes>;
export type VenueActivateResType = z.infer<typeof VenueActivateRes>;
export type VenueAllListResType = z.infer<typeof VenueAllListRes>;
