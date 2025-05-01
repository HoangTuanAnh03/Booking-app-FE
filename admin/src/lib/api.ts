import type { SportType } from "@/types/sport-type"
import { getAccessTokenFormLocalStorage } from "./utils"
import http from "@/utils/api";
import { DashboardResType } from "@/schemaValidations/dashboard.schema";
import { UserListResType } from "@/schemaValidations/user.schema";
import { VenueActivateResType, VenueAllListResType, VenueListResType } from "@/schemaValidations/venue.schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8000/api"
const token = getAccessTokenFormLocalStorage();

interface ApiResponse {
  data?: SportType[] | SportType
  sportTypes?: SportType[]
  [key: string]: any
}

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMessage = errorData?.message || `Error: ${response.status} ${response.statusText}`
    throw new Error(errorMessage)
  }

  const responseData: ApiResponse = await response.json()


  console.log("API response data:", responseData)


  if (Array.isArray(responseData)) {
    return responseData as SportType[]
  } else if (responseData.data && Array.isArray(responseData.data)) {
    return responseData.data as SportType[]
  } else if (responseData.sportTypes && Array.isArray(responseData.sportTypes)) {
    return responseData.sportTypes as SportType[]
  } else if (responseData.data && !Array.isArray(responseData.data)) {
    return responseData.data as SportType
  } else {
    return responseData as any
  }
}

// Fetch all sport types
export async function fetchSportTypes(): Promise<SportType[]> {
  const response = await fetch(`${API_BASE_URL}/sportTypes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  const result = await handleResponse(response)
  return Array.isArray(result) ? result : [result].filter(Boolean)
}

// Fetch a single sport type by ID
export async function fetchSportType(id: number): Promise<SportType> {
  const response = await fetch(`${API_BASE_URL}/sportTypes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  return handleResponse(response)
}

// Create a new sport type
export async function createSportType(data: { name: string; description?: string }): Promise<SportType> {
  const response = await fetch(`${API_BASE_URL}/sportTypes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  return handleResponse(response)
}

// Update an existing sport type
export async function updateSportType(id: number, data: { name: string; description?: string }): Promise<SportType> {
  const response = await fetch(`${API_BASE_URL}/sportTypes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  return handleResponse(response)
}

// Delete a sport type
export async function deleteSportType(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sportTypes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  return handleResponse(response)
}

//Get data for dashboard
export const getDashboardData = () => http.get<DashboardResType>("admin/dashboard");

//Get all users
export const getUsers = () => http.get<UserListResType>("/admin/users");

//Update user role
export const upRole= (userId: string) => http.get(`/admin/users/${userId}/upRole`);

export const getVenuesByUser = (userId: string) =>
  http.get<VenueListResType>(`/admin/users/${userId}`);

export const getVenues = (page = 1, search?: string, status?: string) => {
  const query = new URLSearchParams({
    page: String(page),
    ...(search && { search }),
    ...(status && { status }),
  }).toString();

  return http.get<VenueAllListResType   
  >(`/admin/venues?${query}`);
};

export const activateVenue = (venueId: string) =>
  http.get<VenueActivateResType>(`/admin/venues/${venueId}/activate`);
