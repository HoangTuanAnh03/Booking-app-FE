import type { Venue, VenueImg } from "@/types/venue"
import { getAccessTokenFormLocalStorage } from "./utils";
import { Booking, BookingStatsResponse } from "@/types/booking";
import { Field } from "@/types/field";
import { BookingRequest } from "@/types/court";

const token = getAccessTokenFormLocalStorage();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:8000/api"

// Helper function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    // Try to get error message from the response
    try {
      const errorData = await response.json()
      throw new Error(errorData.message || `API error: ${response.status}`)
    } catch (e) {
      throw new Error(`API error: ${response.status}`)
    }
  }
  return response.json()
}



// Function to fetch all venues
export async function fetchVenues(): Promise<Venue[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: `Bearer ${token}`
      },
    })

    const data = await handleResponse(response)

    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error("Error fetching venues:", error)
    throw error
  }
}

// Function to fetch a single venue by ID
export async function fetchVenueById(id: string): Promise<Venue> {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/search_by_id/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: `Bearer ${token}`,
      },
    })

    const data = await handleResponse(response)

    // Return the venue data (adjust based on your API structure)
    return data.data || data
  } catch (error) {
    console.error(`Error fetching venue ${id}:`, error)
    throw error
  }
}

// Function to create a new venue
export async function createVenue(venueData: Omit<Venue, "venue_id">): Promise<Venue> {
  try {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venueData),
    })

    const data = await handleResponse(response)

    // Return the created venue
    return data.data || data
  } catch (error) {
    console.error("Error creating venue:", error)
    throw error
  }
}

// Function to update a venue
export async function updateVenue(id: string, venueData: Partial<Venue>): Promise<Venue> {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venueData),
    })

    const data = await handleResponse(response)

    // Return the updated venue
    return data.data || data
  } catch (error) {
    console.error(`Error updating venue ${id}:`, error)
    throw error
  }
}

// Function to delete a venue
export async function deleteVenue(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    await handleResponse(response)

    // Return success if no error was thrown
    return { success: true }
  } catch (error) {
    console.error(`Error deleting venue ${id}:`, error)
    throw error
  }
}

// Function to fetch all venues Image by id
export async function fetchVenueImgById(id: string): Promise<VenueImg[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/venue-images/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    // return res.json();
    const data = await handleResponse(res)
    return data.data || data
  } catch (error) {
    console.error(`Error fetching venue image ${id}:`, error)
    throw error
  }
}

// Function to add venues Image by id
export async function addVenueImgById(id: string, images: string[]): Promise<VenueImg[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/venue-images/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await handleResponse(res)
    return data.data || data
  } catch (error) {
    console.error(`Error add venue image ${id}:`, error)
    throw error
  }
}

// Function to delete venues Image by id
export async function deleteVenueImgById(id: string): Promise<VenueImg[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/venue-images/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await handleResponse(res)
    return data.data || data
  } catch (error) {
    console.error(`Error delete venue image ${id}:`, error)
    throw error
  }
}

// Function to update venues Image by id
export async function updateVenueImgById(id: string): Promise<VenueImg[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/venue-images/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await handleResponse(res)
    return data.data || data
  } catch (error) {
    console.error(`Error update venue image ${id}:`, error)
    throw error
  }
}
interface FetchBookingsParams {
  page?: number
  status?: string | null
  perPage?: number
  fieldId?: string
  startDate?: string
  endDate?: string
}

// Update the fetchBookings function to handle errors better and provide mock data when needed
export async function fetchBookings({
  page = 1,
  status = null,
  perPage = 10,
  fieldId,
  startDate,
  endDate,
}: FetchBookingsParams = {}): Promise<BookingStatsResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams()

    if (page) params.append("page", page.toString())
    if (perPage) params.append("per_page", perPage.toString())
    if (status) params.append("status", status)
    if (fieldId) params.append("field_id", fieldId)
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)

    const queryString = params.toString() ? `?${params.toString()}` : ""
    const url = `${API_BASE_URL}/bookings${queryString}`

    console.log(`Fetching bookings from: ${url}`)

    // Add timeout to the fetch request
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      // Add error handling for CORS issues
      mode: "cors",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`)
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data: BookingStatsResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching bookings:", error)

    throw new Error(
      error instanceof Error
        ? `API Error: ${error.message}`
        : "Failed to fetch bookings data. Please check if the API server is running.",
    )
  }
}

/**
 * Fetches a single booking by ID
 */
export async function fetchBookingById(bookingId: string): Promise<BookingStatsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data: BookingStatsResponse = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error)
    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to fetch booking ${bookingId}. Please check if the API server is running.`,
    )
  }
}


//Fetches booking statistics
export async function completeBookingById(bookingId: string): Promise<Booking> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/complete`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
    })

    const data = await handleResponse(response)

    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error("Error fetching venues:", error)
    throw error
  }
}


//FetchField
export async function fetchFieldsByVenueId(id: string): Promise<Field[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/fields/getByVenueId/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponse(res);

    // Kiểm tra đúng structure: data.data.data (do có phân trang)
    return data.data?.data ?? [];
  } catch (error) {
    console.error(`Error fetching Fields for venue ${id}:`, error);
    throw error;
  }
}

// export async function lockedSlots(field_id: string, time_slots: string): Promise<BookingRequest> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/bookings/locked-slots`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     const data = await handleResponse(response)

//     return data.data || data
//   } catch (error) {
//     console.error("Error fetching locked slots:", error)
//     throw error
//   }
// }

//API function to lock slots
export async function lockedSlots(request: BookingRequest): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT
  const token = getAccessTokenFormLocalStorage();

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/lock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error locking slots:", error)
    throw error
  }
}
