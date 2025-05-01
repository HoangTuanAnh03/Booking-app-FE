import { Suspense } from "react"
import { SportTypeManagement } from "@/components/sport-type-management"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function HomePage() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader heading="Quản Lý Loại Thể Thao" text="Xem và quản lý tất cả các loại thể thao trong hệ thống." />
      <Card>
        <CardHeader>
          <CardTitle>Danh sách loại thể thao</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DashboardSkeleton />}>
            <SportTypeManagement />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}
