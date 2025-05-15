"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation";
import { useVenues } from "@/queries/useVenue";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Card } from "./ui/card";

export function TableVenue() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const handleVenueSelect = (venueId: string) => {
        router.push(`/venue?venueId=${venueId}`);
    };
    const { data: venues = [], isLoading, error } = useVenues();
    const currentVenueId = searchParams.get("venueId");
    const [searchQuery, setSearchQuery] = useState("");
    const filteredVenues = venues.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">No</TableHead>
                        <TableHead>Venue Name</TableHead>
                        <TableHead>Location</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredVenues.length > 0 ? (
                        filteredVenues.map((venue, index) => (
                            <>
                            <TableRow
                                key={venue.venue_id}
                                className={currentVenueId === venue.venue_id ? "bg-muted" : ""}
                                onClick={() => handleVenueSelect(venue.venue_id)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{venue.name}</span>
                                </TableCell>
                                 <TableCell>
                                    <span>{venue.address}</span>
                                </TableCell>
                            </TableRow>
                            </>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground py-3">
                                No venues found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>
        </Card>
    )
}

