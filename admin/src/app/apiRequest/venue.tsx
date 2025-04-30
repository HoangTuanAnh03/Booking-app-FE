import http from "@/utils/api";
import { VenueListResType, VenueActivateResType, VenueAllListResType } from "@/schemaValidations/venue.schema";

const venueApiRequest = {
  getVenuesByUser: (userId: string) => http.get<VenueListResType>(`/admin/users/${userId}`),
  // getVenues: () => http.get<VenueAllListResType>(`/admin/venues`),
  getVenues: (page = 1, search?: string, status?: string) => {
    const query = new URLSearchParams({
      page: String(page),
      ...(search && { search }),
      // ...(status && { status }),
    }).toString();
  
    return http.get<VenueAllListResType>(`/admin/venues?${query}`);
  },
  activateVenue: (venueId: string) => http.get<VenueActivateResType>(`/admin/venues/${venueId}/activate`),
};

export default venueApiRequest;
