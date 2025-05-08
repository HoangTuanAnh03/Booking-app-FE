import http from "@/utils/api";

const venueApiRequest = {
  sGetAllForMap: () =>
    http.get<IBackendRes<VenueMap[]>>(
      `/venues/search_near_for_home?distance=7000`
    ),
  sGetVenueDetail: (id: string) =>
    http.get<IBackendRes<Venue>>(`/venues/detail/${id}`),
};

export default venueApiRequest;
