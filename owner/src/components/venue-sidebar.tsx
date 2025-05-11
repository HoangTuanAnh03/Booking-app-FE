"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Loader2,
  LogOut,
  MapPin,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AddVenueForm } from "./add-venue-form";
import authApiRequest from "@/apiRequests/auth";
import { useUnpaidVenues, useVenues } from "@/queries/useVenue";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import Link from "next/link";

export function DashboardSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentVenueId = searchParams.get("venueId");

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddVenueForm, setShowAddVenueForm] = useState(false);
  const [isLoggingOut] = useState(false);

  const { data: venues = [], isLoading, error } = useVenues();
  const {
    data: unpaidVenues = [],
    isLoading: isUnpaidLoading,
    error: unpaidError,
  } = useUnpaidVenues();

  // Filter venues based on search query

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVenueSelect = (venueId: string) => {
    router.push(`/venue?venueId=${venueId}`);
  };
  const handleUnpaidVenueSelect = (venueId: string) => {
    router.push(`/venuePayment?venueId=${venueId}`);
  };

  const logout = () => {
    authApiRequest.logout();
  };

  const handleVenueAdded = () => {
    setShowAddVenueForm(false);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-3">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-semibold">AE Booking - Owner</h1>
          </div>
          <div className="px-2 pb-2">
            <SidebarInput
              placeholder="Search venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarMenu>
                {/* Collapsible 1 */}
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        Địa điểm của bạn
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : error ? (
                          <div className="px-2 py-3 text-sm text-destructive">
                            Error loading venues
                          </div>
                        ) : (
                          <SidebarMenu>
                            {filteredVenues.length > 0 ? (
                              filteredVenues.map((venue) => (
                                <SidebarMenuItem key={venue.venue_id}>
                                  <SidebarMenuButton
                                    isActive={currentVenueId === venue.venue_id}
                                    onClick={() =>
                                      handleVenueSelect(venue.venue_id)
                                    }
                                  >
                                    <MapPin className="h-4 w-4" />
                                    <span>{venue.name}</span>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))
                            ) : (
                              <div className="px-2 py-3 text-sm text-muted-foreground">
                                No venues found
                              </div>
                            )}
                          </SidebarMenu>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Collapsible 2 */}
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <Link href="/venue/booking">
                      <SidebarMenuButton>Danh sách lịch đặt</SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </Collapsible>

                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        Địa điểm chưa thanh toán
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : error ? (
                          <div className="px-2 py-3 text-sm text-destructive">
                            Error loading venues
                          </div>
                        ) : (
                          <SidebarMenu>
                            {unpaidVenues.length > 0 ? (
                              unpaidVenues.map((venue) => (
                                <SidebarMenuItem key={venue.venue_id}>
                                  <SidebarMenuButton
                                    // isActive={currentVenueId === venue.venue_id}
                                    onClick={() =>
                                      handleUnpaidVenueSelect(venue.venue_id)
                                    }
                                  >
                                    <MapPin className="h-4 w-4" />
                                    <span>{venue.name}</span>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))
                            ) : (
                              <div className="px-2 py-3 text-sm text-muted-foreground">
                                No venues found
                              </div>
                            )}
                          </SidebarMenu>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroup>
          </Collapsible>
        </SidebarContent>
        <SidebarFooter>
          <div className="space-y-2 p-2">
            <Button
              className="w-full"
              size="sm"
              onClick={() => setShowAddVenueForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Venue
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-primary hover:text-white transition-colors"
              size="sm"
              onClick={logout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <AddVenueForm
        isOpen={showAddVenueForm}
        onClose={() => setShowAddVenueForm(false)}
        onSuccess={handleVenueAdded}
      />
    </>
  );
}
