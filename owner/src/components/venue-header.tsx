"use client"

import { useSearchParams } from "next/navigation"
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

export function DashboardHeader() {
  const searchParams = useSearchParams()
  const venueId = searchParams.get("venueId")
  const [venue, setVenue] = useState<Venue | null>(null)

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
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <Breadcrumb>
        <BreadcrumbList>
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
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
