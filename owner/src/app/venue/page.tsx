import { VenueDetails } from "@/components/venue-details"
import { DashboardHeader } from "@/components/venue-header"
import { EmptyState } from "@/components/empty-state"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { venueId?: string }
}) {
  const { venueId } = searchParams

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <div className="flex-1 p-6">{venueId ? <VenueDetails venueId={venueId} /> : <EmptyState />}</div>
    </div>
  )
}
