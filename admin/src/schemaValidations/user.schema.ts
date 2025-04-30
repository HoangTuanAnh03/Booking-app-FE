import z from 'zod'

export const UserItem = z.object({
  uuid: z.string(),
  name: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'owner', 'user']),
  status: z.enum(['active', 'locked']),
})

export const UserRes = z.object({
  data: UserItem,
  message: z.string(),
}).strict()

export const UserListRes = z.object({
  data: z.object({
    owner: z.array(UserItem),
    user: z.array(UserItem),
  }),
  message: z.string(),
}).strict()

export type UserItemType = z.TypeOf<typeof UserItem>
export type UserResType = z.TypeOf<typeof UserRes>
export type UserListResType = z.TypeOf<typeof UserListRes>
