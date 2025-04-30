import { create } from "zustand";

type MapStoreState = {
  venuesForMap: VenueMap[];
  setVenuesForMap: (venues: VenueMap[]) => void;
  coordinateVenues: CoordinateVenue[] | null;
  setCoordinateVenues: (venues: VenueMap[]) => void;
  fieldTypes: FieldType[];
  setFieldTypes: (fieldTypes: FieldType[]) => void;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeSportIdFilter: number | null;
  setTypeSportIdFilter: (id: number | null) => void;
};

export const useMapStore = create<MapStoreState>((set, get) => ({
  venuesForMap: [],
  setVenuesForMap: (venues) => set({ venuesForMap: venues }),
  coordinateVenues: null,
  fieldTypes: [],
  setCoordinateVenues: (venues) => {
    const fieldTypes = get().fieldTypes; // Access fieldTypes directly from the store
    set({
      coordinateVenues: venues.map(
        (venue) =>
          ({
            id: venue.venue_id,
            name: venue.venue_name,
            lat: parseFloat(venue.latitude),
            lng: parseFloat(venue.longitude),
            address: venue.address,
            type:
              venue.sport_types.length > 1
                ? "multiple"
                : fieldTypes.find((type) => type.id === venue.sport_types[0].id)
                    ?.type,
          } as CoordinateVenue)
      ),
    });
  },
  setFieldTypes: (fieldTypes) => set({ fieldTypes }),
  searchFocused: false,
  setSearchFocused: (focused) => set({ searchFocused: focused }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  typeSportIdFilter: null,
  setTypeSportIdFilter: (id) => set({ typeSportIdFilter: id }),
}));

type FieldType = {
  id: number;
  type: string;
  name: string;
};
