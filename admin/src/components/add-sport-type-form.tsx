"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createSportType } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên loại thể thao phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
})

interface AddSportTypeFormProps {
  onCancel: () => void
  onSuccess: (message: string) => void
}

export function AddSportTypeForm({ onCancel, onSuccess }: AddSportTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await createSportType(values)
      onSuccess(`Đã thêm "${values.name}" thành công`)
    } catch (error) {
      console.error("Error creating sport type:", error)
      form.setError("root", {
        message: "Không thể tạo loại thể thao. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <Button type="button" variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Quay lại</span>
          </Button>
          <CardTitle className="text-2xl">Thêm loại thể thao mới</CardTitle>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại thể thao</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên loại thể thao" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập mô tả (không bắt buộc)" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
