"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteVenue, fetchVenues, fetchVenueById, updateVenue, createVenue } from "@/lib/api"
import type { Venue } from "@/types/venue"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Query key for venues
export const venuesKeys = {
  all: ["venues"] as const,
  details: (id: string) => [...venuesKeys.all, id] as const,
}

// Hook to fetch all venues
export const useVenues = () => {
  return useQuery({
    queryKey: venuesKeys.all,
    queryFn: fetchVenues,
  })
}

// Hook to fetch a single venue
export const useVenue = (id: string) => {
  return useQuery({
    queryKey: venuesKeys.details(id),
    queryFn: () => fetchVenueById(id),
    enabled: !!id,
  })
}

// Hook to create a venue
export const useCreateVenueMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: Omit<Venue, "venue_id">) => createVenue(data),
    onSuccess: (newVenue) => {
      // Invalidate venues list to trigger refetch
      queryClient.invalidateQueries({ queryKey: venuesKeys.all })

      toast({
        title: "Success",
        description: "Venue created successfully",
      })

      // Navigate to the new venue
    //   router.push(`/venue?venueId=${newVenue.venue_id}`)
    router.push("/venue")

    },
    onError: (error) => {
      console.error("Failed to create venue:", error)
      toast({
        title: "Error",
        description: "Failed to create venue. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Hook to update a venue
export const useUpdateVenueMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Venue> }) => updateVenue(id, data),
    onSuccess: (updatedVenue) => {
      // Update both the list and the individual venue data
      queryClient.invalidateQueries({ queryKey: venuesKeys.all })
      queryClient.invalidateQueries({ queryKey: venuesKeys.details(updatedVenue.venue_id) })

      toast({
        title: "Success",
        description: "Venue updated successfully",
      })
    },
    onError: (error) => {
      console.error("Failed to update venue:", error)
      toast({
        title: "Error",
        description: "Failed to update venue. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Hook to delete a venue
export const useDeleteVenueMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => {
      // Invalidate venues list to trigger refetch
      queryClient.invalidateQueries({ queryKey: venuesKeys.all })

      toast({
        title: "Success",
        description: "Venue deleted successfully",
      })

      // Navigate back to dashboard
      router.push("/venue")
    },
    onError: (error) => {
      console.error("Failed to delete venue:", error)
      toast({
        title: "Error",
        description: "Failed to delete venue. Please try again.",
        variant: "destructive",
      })
    },
  })
}
