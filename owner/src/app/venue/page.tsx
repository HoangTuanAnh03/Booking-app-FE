import {cookies} from "next/headers"
import {redirect} from "next/navigation"
import {VenueDetails} from "@/components/venue-details"
import {DashboardHeader} from "@/components/venue-header"
import {EmptyState} from "@/components/empty-state"
import {  useVenues } from "@/queries/useVenue";
import VenueTable from "@/app/venue/components/VenueTable";
import VenueTableWrapper from "@/app/venue/components/VenueTableWrapper";

export default async function DashboardPage({
                                                searchParams,
                                            }: {
    searchParams: { venueId?: string }
}) {
    const {venueId} = searchParams
    const cookieStore = cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    console.log({"cookie": accessToken})
    if (!accessToken) {
        redirect("/login")
    }


    return (
        <div className="flex flex-col h-full">
            <DashboardHeader/>
            {venueId ? (
                <div className="flex-1 p-6">
                    <VenueDetails venueId={venueId}/>
                </div>
            ) : (
                <VenueTableWrapper></VenueTableWrapper>
            )}

        </div>
    )
}
