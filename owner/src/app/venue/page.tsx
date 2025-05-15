import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { VenueDetails } from "@/components/venue-details"
import { DashboardHeader } from "@/components/venue-header"
import { TableVenue } from "@/components/table-venue"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { venueId?: string }
}) {
  const { venueId } = searchParams

  const cookieStore = cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  console.log({"cookie": accessToken})
  if (!accessToken) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="flex-1 p-6 mt-16">
        {venueId ? <VenueDetails venueId={venueId} /> : <TableVenue/>}
      </div>
    </div>
  )
}
