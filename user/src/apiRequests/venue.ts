import http from "@/utils/api";

const venueApiRequest = {
  sGetAllForMap: () => http.get<IBackendRes<VenueMap[]>>(`/venues/map`),
  sGetVenueDetail: (id: string) =>
    http.get<IBackendRes<Venue>>(`/venues/detail/${id}`),
};

export default venueApiRequest;
