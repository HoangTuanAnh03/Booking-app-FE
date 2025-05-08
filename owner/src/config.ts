import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI: z.string(),
  NEXT_PUBLIC_GOOGLE_AUTH_URI: z.string(),
  NEXT_PUBLIC_MAP_API_KEY: z.string(),
  NEXT_PUBLIC_IMGUR_CLIENT_ID: z.string(),
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  NEXT_PUBLIC_GOOGLE_AUTH_URI: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URI,
  NEXT_PUBLIC_MAP_API_KEY: process.env.NEXT_PUBLIC_MAP_API_KEY,
  NEXT_PUBLIC_IMGUR_CLIENT_ID: process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID
})
if (!configProject.success) {
  console.error(`ERR ${configProject.error.issues}`)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envConfig = configProject.data
export default envConfig
