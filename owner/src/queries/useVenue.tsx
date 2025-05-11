"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  deleteVenue,
  fetchVenues,
  fetchVenueById,
  updateVenue,
  createVenue,
  fetchVenueImgById,
  deleteVenueImgById,
  fetchFieldsByVenueId,
  fetchUnpaidVenues, fetchMakePaymentLink
} from "@/lib/api"
import type { Venue, VenueImg } from "@/types/venue"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Field } from '@/types/field';

// Query key for venues
export const venuesKeys = {
  all: ["venues"] as const,
  unpaid: ["unpaid"] as const,
  details: (id: string) => [...venuesKeys.all, id] as const,
}

// Hook to fetch all venues
export const useVenues = () => {
  return useQuery({
    queryKey: venuesKeys.all,
    queryFn: fetchVenues,
  })
}

export const useUnpaidVenues = () => {
  return useQuery({
    queryKey: venuesKeys.unpaid,
    queryFn: fetchUnpaidVenues,
  })
}

export const useMakePaymentURL = (venueId: string, returnUrl: string) => {
  return useQuery({
    queryKey: [venueId, returnUrl],
    queryFn: () => fetchMakePaymentLink(venueId, returnUrl),
    enabled: !!venueId && !!returnUrl,
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

export function useField(venueId: string) {
  return useQuery<Field[], Error>({
    queryKey: ['venueField', venueId],
    queryFn: () => fetchFieldsByVenueId(venueId),
    enabled: !!venueId,
  });
}

export function useVenueImg(venueId: string) {
  return useQuery<VenueImg[]>({
    queryKey: ['venueImg', venueId],
    queryFn: () => fetchVenueImgById(venueId),
    enabled: !!venueId,
  });
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