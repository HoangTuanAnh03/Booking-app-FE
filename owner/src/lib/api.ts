import type { Venue } from "@/types/venue"
import { getAccessTokenFormLocalStorage } from "./utils";

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
