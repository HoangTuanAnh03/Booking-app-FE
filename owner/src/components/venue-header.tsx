"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { fetchVenueById } from "@/lib/api"
import type { Venue } from "@/types/venue"
import type { Field } from "@/types/field"

interface DashboardHeaderProps {
  field?: Field | null;
}

export function DashboardHeader({ field }: DashboardHeaderProps) {
  const searchParams = useSearchParams()
  const venueId =  searchParams.get("venueId") ?? field?.venue_id
  const [venue, setVenue] = useState<Venue | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (venueId) {
      const loadVenue = async () => {
        try {
          const data = await fetchVenueById(venueId)
          setVenue(data)
        } catch (error) {
          console.error("Failed to fetch venue:", error)
        }
      }

      loadVenue()
    } else {
      setVenue(null)
    }
  }, [venueId])

  return (
    <header className="fixed top-0 z-50 w-full flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb>
        <BreadcrumbList>
          {pathname.startsWith("/venue") && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/venue">Venue</BreadcrumbLink>
              </BreadcrumbItem>

              {venue && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{venue.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}

              {pathname.includes("/field") && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{field?.field_name ?? "Field"}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}

            </>
          )}

          {pathname === "/venue/booking" && (
            <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Booking</BreadcrumbPage>
            </BreadcrumbItem>
            </>
          )}

          {pathname === "/dashboard" && (
            <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
            </>
          )}

          {pathname === "/venue/stats" && (
            <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Stats</BreadcrumbPage>
            </BreadcrumbItem>
            </>
          )}

          {pathname === "/venuePayment" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Venue Payment</BreadcrumbPage>
              </BreadcrumbItem>
              {/* {venue && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{venue.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )} */}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
