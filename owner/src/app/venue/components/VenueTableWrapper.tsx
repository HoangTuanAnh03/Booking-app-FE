'use client';
import {useVenues} from "@/queries/useVenue";
import VenueTable from "./VenueTable";

export default function VenueTableWrapper() {
    const {data: venues = [], isLoading, error} = useVenues();
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div
                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
                    aria-label="Loading"
                />
            </div>
        );
    }

    return <VenueTable venues={venues} />;
}