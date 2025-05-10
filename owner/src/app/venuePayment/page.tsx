import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/venue-header"
import CreatingPaymentLink from "@/app/venuePayment/components/createPaymentLink";

export default async function DashboardPage({
                                                searchParams,
                                            }: {
    searchParams: { venueId?: string }
}) {
    const { venueId } = searchParams
    const cookieStore = cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) {
        redirect("/login")
    }
    if(!venueId) {
        redirect("/venue")
    }
    return (
        <div className="flex flex-col h-full">
            <DashboardHeader/>
            <CreatingPaymentLink venueId={venueId}/>
        </div>
    )
}
