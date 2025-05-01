"use client";

import VenueDialog from "@/components/venue-list-dialog";
import VenueListHeader from "@/components/venue-list-header";
import VenuePagination from "@/components/venue-list-pagination";
import VenueTable from "@/components/venue-list-table";
import useVenueList from "@/queries/useVenueList";



export default function VenueListManagement() {
  const {
    venues,
    loading,
    meta,
    searchText,
    setSearchText,
    selectedVenue,
    setSelectedVenue,
    openDialog,
    setOpenDialog,
    handlePageChange,
    handleToggleStatus,
  } = useVenueList();

  return (
    <div className="max-w-7xl mx-auto">
      <VenueListHeader
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      <VenueTable
        venues={venues}
        loading={loading}
        onOpenDialog={setOpenDialog}
        setSelectedVenue={setSelectedVenue}
      />
      <VenuePagination meta={meta} onPageChange={handlePageChange} />
      {selectedVenue && (
        <VenueDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          venue={selectedVenue}
          onConfirm={async () => {
            await handleToggleStatus(selectedVenue.venue_id);
            setOpenDialog(false);
          }}
        />
      )}
    </div>
  );
}
