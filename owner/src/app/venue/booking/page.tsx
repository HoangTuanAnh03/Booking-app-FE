import { BookingDashboard } from "@/components/booking-dashboard"
import { DashboardHeader } from "@/components/venue-header"

export default function Home() {
  return (
    <>
    <DashboardHeader />
    <main className="container mx-auto py-10">
      <BookingDashboard />
    </main>
    </>
  )
}
