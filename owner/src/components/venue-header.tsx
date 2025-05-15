"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { fetchVenueById } from "@/lib/api";
import type { Venue } from "@/types/venue";
import fieldApiRequest from "@/apiRequests/field";

interface DashboardHeaderProps {
  fieldName?: string;
}

export function DashboardHeader() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get("venueId");
  const fieldId = searchParams.get("fieldId");
  const [venue, setVenue] = useState<Venue | null>(null);
  const [fieldName, setFieldName] = useState<string | null>(null);
  const pathname = usePathname();
  
  const isVenuePaymentPage = pathname === "/venuePayment";
const isFieldDetailPage = pathname?.includes("/venue/fielddetail");

  useEffect(() => {
    if (venueId) {
      const loadVenue = async () => {
        try {
          const data = await fetchVenueById(venueId);
          setVenue(data);
        } catch (error) {
          console.error("Failed to fetch venue:", error);
        }
      };

      loadVenue();
    } else {
      setVenue(null);
    }
  }, [venueId]);

  useEffect(() => {
    const fetchField = async () => {
      if (fieldId) {
        try {
          const { payload } = await fieldApiRequest.findById(fieldId);
          setFieldName(payload.data.field_name);
        } catch (error) {
          console.error("Lỗi khi fetch field:", error);
        }
      }
    };

    fetchField();
  }, [fieldId]);

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
              {isVenuePaymentPage && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Venue Payment</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{venue.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {isFieldDetailPage && fieldName && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{fieldName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
