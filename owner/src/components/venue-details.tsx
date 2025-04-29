"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, MapPin, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Venue } from "@/types/venue"
import { EditVenueForm } from "./edit-venue-form"
import { DeleteVenueDialog } from "./delete-venue-dialog"
import { Badge } from "@/components/ui/badge"
import { useVenue, useDeleteVenueMutation, useUpdateVenueMutation, useVenueImg } from "@/queries/useVenue"
import { Skeleton } from "@/components/ui/skeleton"

export function VenueDetails({ venueId }: { venueId: string }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: venue, isLoading, error } = useVenue(venueId)
  const { data: venueImg, isLoading: isVenueImgLoading } = useVenueImg(venueId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = () => {
    if (!venueImg || venueImg.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? venueImg.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (!venueImg || venueImg.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === venueImg.length - 1 ? 0 : prevIndex + 1
    );
  };

  const updateVenueMutation = useUpdateVenueMutation()
  const deleteVenueMutation = useDeleteVenueMutation()

  const handleVenueUpdate = (updatedVenue: Venue) => {
    updateVenueMutation.mutate(
      {
        id: venueId,
        data: updatedVenue,
      },
      {
        onSuccess: () => {
          setShowEditModal(false)
        },
      },
    )
  }

  const handleVenueDelete = async () => {
    deleteVenueMutation.mutate(venueId, {
      onSuccess: () => {
        setShowDeleteDialog(false)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-20 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
          <p className="text-muted-foreground">The requested venue could not be found or an error occurred.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{venue.name}</CardTitle>
                  {venue.status && (
                    <Badge
                      variant={
                        venue.status === "active" ? "default" : venue.status === "inactive" ? "destructive" : "outline"
                      }
                    >
                      {venue.status}
                    </Badge>
                  )}
                </div>
                {venue.address && (
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {venue.address}
                  </CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                  disabled={updateVenueMutation.isPending}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={deleteVenueMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Banking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Bank Name:</span>
                      <p className="font-medium">{venue.bank_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Account Number:</span>
                      <p className="font-medium">{venue.bank_account_number}</p>
                    </div>
                  </CardContent>

                </Card>

                <Card>
                  <CardContent>
                    <div className="space-y-12 pt-6">
                      <div className="relative aspect-video max-h-[300px] overflow-hidden rounded-md border flex items-center justify-center">
                        {venueImg && venueImg.length > 0 ? (
                          <>
                            <img
                              src={venueImg[currentIndex]?.image_url || ""}
                              alt="Venue preview"
                              className="h-full w-full object-cover transition-transform duration-300"
                            />

                            {/* Prev Button */}
                            <button
                              onClick={handlePrev}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>

                            {/* Next Button */}
                            <button
                              onClick={handleNext}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-muted-foreground">No images available</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>

          </Card>
        </div>
        <div className="md:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span>
                  {venue.longitude} - {venue.latitude}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Venue Modal */}
      <EditVenueForm
        venue={venue}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleVenueUpdate} 
        venueImgs ={venueImg ?? []}   />

      {/* Delete Venue Dialog */}
      <DeleteVenueDialog
        venueName={venue.name}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onDelete={handleVenueDelete}
      />
    </div>
  )
}
