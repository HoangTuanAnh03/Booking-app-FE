// "use client"

// import { useState } from "react"
// import { ChevronLeft, ChevronRight, Edit, MapPin, Trash2, ChevronDown, ChevronUp, Lock } from "lucide-react"
// import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import type { Venue } from "@/types/venue"
// import { EditVenueForm } from "./edit-venue-form"
// import { DeleteVenueDialog } from "./delete-venue-dialog"
// import { Badge } from "@/components/ui/badge"
// import { useVenue, useDeleteVenueMutation, useUpdateVenueMutation, useVenueImg, useField } from "@/queries/useVenue"
// import { Skeleton } from "@/components/ui/skeleton"
// import { useSearchParams } from "next/navigation"
// import { Booking } from "./Booking"
// import { toast } from "@/components/ui/use-toast"
// import { lockedSlots } from "@/lib/api"

// function formatDateToYMD(date: Date): string {
//   const year = date.getFullYear()
//   const month = `${date.getMonth() + 1}`.padStart(2, "0")
//   const day = `${date.getDate()}`.padStart(2, "0")
//   return `${year}-${month}-${day}`
// }

// interface BookingProps {
//   fieldId: string
//   date: string
//   onSelectionChange?: (data: {
//     selectedTimeslots: Map<string, { start_time: string; end_time: string }[]>
//     totalPrice: number
//   }) => void
//   resetSignal?: number
//   onLockSuccess?: (courtSlot: string, slots: { start_time: string; end_time: string }[]) => void
// }

// export function VenueDetails({ venueId }: { venueId: string }) {
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
//   const [showFieldDetails, setShowFieldDetails] = useState(false)
//   const [showBookingFieldDetails, setShowBookingFieldDetails] = useState<{ [key: string]: boolean }>({})
//   const [isLockingSlots, setIsLockingSlots] = useState(false)


//   const searchParams = useSearchParams()
//   const urlFieldId = searchParams.get("fieldid")
//   const [resetSignal, setResetSignal] = useState(0)
//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [selectedTimeslots, setSelectedTimeslots] = useState<
//     Map<
//       string,
//       {
//         start_time: string
//         end_time: string
//       }[]
//     >
//   >(new Map())
//   const [totalPrice, setTotalPrice] = useState<number>(0)

//   const { data: venue, isLoading, error } = useVenue(venueId)
//   const { data: venueImg, isLoading: isVenueImgLoading } = useVenueImg(venueId)
//   const { data: field, isLoading: isFieldLoading } = useField(venueId)
//   const [lockedCourtSlots, setLockedCourtSlots] = useState<Set<string>>(new Set())

//   const handleSelectionChange = (data: {
//     selectedTimeslots: Map<string, { start_time: string; end_time: string }[]>
//     totalPrice: number
//   }) => {
//     setSelectedTimeslots(data.selectedTimeslots)
//     setTotalPrice(data.totalPrice)
//   }

//   const [currentIndex, setCurrentIndex] = useState(0)
//   const handlePrev = () => {
//     if (!venueImg || venueImg.length === 0) return
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? venueImg.length - 1 : prevIndex - 1))
//   }

//   const handleNext = () => {
//     if (!venueImg || venueImg.length === 0) return
//     setCurrentIndex((prevIndex) => (prevIndex === venueImg.length - 1 ? 0 : prevIndex + 1))
//   }

//   const updateVenueMutation = useUpdateVenueMutation()
//   const deleteVenueMutation = useDeleteVenueMutation()

//   const handleVenueUpdate = (updatedVenue: Venue) => {
//     updateVenueMutation.mutate(
//       {
//         id: venueId,
//         data: updatedVenue,
//       },
//       {
//         onSuccess: () => {
//           setShowEditModal(false)
//         },
//       },
//     )
//   }

//   const handleVenueDelete = async () => {
//     deleteVenueMutation.mutate(venueId, {
//       onSuccess: () => {
//         setShowDeleteDialog(false)
//       },
//     })
//   }

//   const toggleFieldDetails = () => {
//     setShowFieldDetails(!showFieldDetails)
//   }

//   const handleDateChange = (date: Date | null) => {
//     if (date) {
//       setSelectedDate(date)
//     }
//   }

//   const toggleCourtSlot = (fieldId: string) => {
//     setShowBookingFieldDetails((prev) => ({
//       ...prev,
//       [fieldId]: !prev[fieldId],
//     }))
//   }

//   //Function to lock selected slots
//   const handleLockSlots = async (fieldId: string, courtSlot: string) => {
//     if (!selectedTimeslots.has(courtSlot) || selectedTimeslots.get(courtSlot)?.length === 0) {
//       toast({
//         title: "No time slots selected",
//         description: "Please select at least one time slot to lock",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsLockingSlots(true)
//     try {
//       const formattedDate = formatDateToYMD(selectedDate)
//       const timeSlots = selectedTimeslots.get(courtSlot) || []

//       const request = {
//         field_id: fieldId,
//         date: formattedDate,
//         court: {
//           [courtSlot]: timeSlots,
//         },
//         customer_name: "no",
//         customer_phone: "0000000000",
//         booking_date: new Date().toISOString(),
//       }

//       await lockedSlots(request)

//       toast({
//         title: "Slots locked successfully",
//         description: `Successfully locked time slots `,
//       })

//       const newSelectedTimeslots = new Map(selectedTimeslots)
//       newSelectedTimeslots.delete(courtSlot)
//       setSelectedTimeslots(newSelectedTimeslots)
//       setLockedCourtSlots(prev => new Set(prev).add(courtSlot))
//       setResetSignal((prev) => prev + 1)

//     } catch (error) {
//       console.error("Error locking slots:", error)
//       toast({
//         title: "Error",
//         description: "Failed to lock the selected time slots. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLockingSlots(false)
//     }
//   }
//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="md:w-2/3">
//             <Card>
//               <CardHeader className="flex flex-row items-start justify-between">
//                 <div>
//                   <Skeleton className="h-8 w-48" />
//                   <Skeleton className="h-4 w-64 mt-2" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <Skeleton className="h-[200px] w-full" />
//                 <Skeleton className="h-20 w-full mt-4" />
//               </CardContent>
//             </Card>
//           </div>
//           <div className="md:w-1/3 space-y-6">
//             <Card>
//               <CardHeader>
//                 <Skeleton className="h-6 w-32" />
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-full" />
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !venue) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
//           <p className="text-muted-foreground">The requested venue could not be found or an error occurred.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="md:flex-row gap-6">
//         <div className="md:w-3/3">
//           <Card>
//             <CardHeader className="flex flex-row items-start justify-between">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <CardTitle className="text-2xl">{venue.name}</CardTitle>
//                   {venue.status && (
//                     <Badge
//                       variant={
//                         venue.status === "active" ? "default" : venue.status === "inactive" ? "destructive" : "outline"
//                       }
//                     >
//                       {venue.status}
//                     </Badge>
//                   )}
//                 </div>
//                 {venue.address && (
//                   <CardDescription className="flex items-center gap-1 mt-1">
//                     <MapPin className="h-4 w-4" />
//                     {venue.address}
//                   </CardDescription>
//                 )}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowEditModal(true)}
//                   disabled={updateVenueMutation.isPending}
//                 >
//                   <Edit className="h-4 w-4 mr-1" />
//                   Edit
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => setShowDeleteDialog(true)}
//                   disabled={deleteVenueMutation.isPending}
//                 >
//                   <Trash2 className="h-4 w-4 mr-1" />
//                   Delete
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Banking Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-2">
//                     <div>
//                       <span className="text-muted-foreground">Bank Name:</span>
//                       <p className="font-medium">{venue.bank_name}</p>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">Account Number:</span>
//                       <p className="font-medium">{venue.bank_account_number}</p>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent>
//                     <div className="space-y-12 pt-6">
//                       <div className="relative aspect-video max-h-[300px] overflow-hidden rounded-md border flex items-center justify-center">
//                         {venueImg && venueImg.length > 0 ? (
//                           <>
//                             <img
//                               src={venueImg[currentIndex]?.image_url || ""}
//                               alt="Venue preview"
//                               className="h-full w-full object-cover transition-transform duration-300"
//                             />

//                             {/* Prev Button */}
//                             <button
//                               onClick={handlePrev}
//                               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
//                             >
//                               <ChevronLeft className="h-5 w-5" />
//                             </button>

//                             {/* Next Button */}
//                             <button
//                               onClick={handleNext}
//                               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
//                             >
//                               <ChevronRight className="h-5 w-5" />
//                             </button>
//                           </>
//                         ) : (
//                           <div className="text-muted-foreground">No images available</div>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Field Details Button */}
//               <div className="mt-6">
//                 <Button
//                   onClick={toggleFieldDetails}
//                   variant="outline"
//                   className="w-full flex items-center justify-between"
//                 >
//                   <span>Field Details</span>
//                   {showFieldDetails ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
//                 </Button>

//                 {showFieldDetails && (
//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle className="text-lg">Field Information</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       {isFieldLoading ? (
//                         <div className="space-y-2">
//                           <Skeleton className="h-4 w-full" />
//                           <Skeleton className="h-4 w-3/4" />
//                         </div>
//                       ) : field && field.length > 0 ? (
//                         <div className="space-y-4">
//                           {field.map((fieldItem, index) => (
//                             <div
//                               key={fieldItem.field_id || index}
//                               className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
//                             >
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
//                                 <div className="">
//                                   <span className="text-muted-foreground">Field ID:</span>
//                                   <p className="font-medium">{fieldItem.field_id}</p>
//                                 </div>
//                                 <div>
//                                   <span className="text-muted-foreground">Field Name:</span>
//                                   <p className="font-medium">{fieldItem.field_name || "N/A"}</p>
//                                 </div>
//                                 <div>
//                                   <span className="text-muted-foreground">Field Price/hour:</span>
//                                   <p className="font-medium">{fieldItem.default_price || "N/A"}</p>
//                                 </div>
//                               </div>
//                               <Button
//                                 onClick={() => toggleCourtSlot(fieldItem.field_id)}
//                                 variant="outline"
//                                 className="w-full flex items-center justify-between gap-4 mt-4"
//                               >
//                                 <span>Booking Details</span>
//                                 {showBookingFieldDetails[fieldItem.field_id] ? (
//                                   <ChevronUp className="h-4 w-4 ml-2" />
//                                 ) : (
//                                   <ChevronDown className="h-4 w-4 ml-2" />
//                                 )}
//                               </Button>


//                               {showBookingFieldDetails[fieldItem.field_id] && (
//                                 <div className="mt-4 h-[calc(100vh-550px)] relative w-full overflow-x-hidden bg-gray-50 rounded-xl shadow-inner">

//                                   {/* Date Picker Floating Box */}
//                                   <div className="absolute top-6 left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
//                                     <DatePicker
//                                       selected={selectedDate}
//                                       onChange={handleDateChange}
//                                       dateFormat="yyyy-MM-dd"
//                                       className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                       placeholderText="Chọn ngày"
//                                       minDate={new Date()}
//                                     />
//                                   </div>

//                                   {/* Booking Section */}
//                                   <div className="pt-40 px-4 sm:px-8">
//                                     <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
//                                       <Booking
//                                         key={resetSignal}
//                                         fieldId={fieldItem.field_id}
//                                         date={formatDateToYMD(selectedDate)}
//                                         onSelectionChange={handleSelectionChange}
//                                         resetSignal={resetSignal}
//                                       />
//                                     </div>

//                                     {/* Lock Button Section*/}
//                                     {Array.from(selectedTimeslots.keys()).map((courtSlot) => {
//                                       const slots = selectedTimeslots.get(courtSlot) || []
//                                       if (slots.length === 0) return null

//                                       return (
//                                         <div className="mt-2">
//                                           <Button
//                                             onClick={() => handleLockSlots(fieldItem.field_id, courtSlot)}
//                                             className="mr-2"
//                                             disabled={isLockingSlots}

//                                           >
//                                             <span className="flex items-center">
//                                               <Lock className="mr-2 h-4 w-4" />
//                                               Lock Selected Slots
//                                             </span>
//                                           </Button>
//                                         </div>
//                                       )
//                                     })}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-muted-foreground">No field information available</p>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Edit Venue Modal */}
//       <EditVenueForm
//         venue={venue}
//         isOpen={showEditModal}
//         onClose={() => setShowEditModal(false)}
//         onSave={handleVenueUpdate}
//         venueImgs={venueImg ?? []}
//       />

//       {/* Delete Venue Dialog */}
//       <DeleteVenueDialog
//         venueName={venue.name}
//         isOpen={showDeleteDialog}
//         onClose={() => setShowDeleteDialog(false)}
//         onDelete={handleVenueDelete}
//       />
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit, MapPin, Trash2, ChevronDown, ChevronUp, Lock } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Venue } from "@/types/venue"
import { EditVenueForm } from "./edit-venue-form"
import { DeleteVenueDialog } from "./delete-venue-dialog"
import { Badge } from "@/components/ui/badge"
import { useVenue, useDeleteVenueMutation, useUpdateVenueMutation, useVenueImg, useField } from "@/queries/useVenue"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { Booking } from "./Booking"
import { toast } from "@/components/ui/use-toast"
import { lockedSlots } from "@/lib/api"

function formatDateToYMD(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

interface BookingProps {
  fieldId: string
  date: string
  onSelectionChange?: (data: {
    selectedTimeslots: Map<string, { start_time: string; end_time: string }[]>
    totalPrice: number
  }) => void
  resetSignal?: number
  onLockSuccess?: (courtSlot: string, slots: { start_time: string; end_time: string }[]) => void
}

export function VenueDetails({ venueId }: { venueId: string }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showFieldDetails, setShowFieldDetails] = useState(false)
  const [showBookingFieldDetails, setShowBookingFieldDetails] = useState<{ [key: string]: boolean }>({})
  const [isLockingSlots, setIsLockingSlots] = useState(false)

  const searchParams = useSearchParams()
  const urlFieldId = searchParams.get("fieldid")
  const [resetSignal, setResetSignal] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTimeslots, setSelectedTimeslots] = useState<
    Map<
      string,
      {
        start_time: string
        end_time: string
      }[]
    >
  >(new Map())
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const { data: venue, isLoading, error } = useVenue(venueId)
  const { data: venueImg, isLoading: isVenueImgLoading } = useVenueImg(venueId)
  const { data: field, isLoading: isFieldLoading } = useField(venueId)
  const [lockedCourtSlots, setLockedCourtSlots] = useState<Set<string>>(new Set())

  const handleSelectionChange = (data: {
    selectedTimeslots: Map<string, { start_time: string; end_time: string }[]>
    totalPrice: number
  }) => {
    setSelectedTimeslots(data.selectedTimeslots)
    setTotalPrice(data.totalPrice)
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const handlePrev = () => {
    if (!venueImg || venueImg.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? venueImg.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    if (!venueImg || venueImg.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex === venueImg.length - 1 ? 0 : prevIndex + 1))
  }

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

  const toggleFieldDetails = () => {
    setShowFieldDetails(!showFieldDetails)
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const toggleCourtSlot = (fieldId: string) => {
    setShowBookingFieldDetails((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  //Function to lock selected slots
  const handleLockSlots = async (fieldId: string, courtSlot: string) => {
    if (!selectedTimeslots.has(courtSlot) || selectedTimeslots.get(courtSlot)?.length === 0) {
      toast({
        title: "No time slots selected",
        description: "Please select at least one time slot to lock",
        variant: "destructive",
      })
      return
    }

    setIsLockingSlots(true)
    try {
      const formattedDate = formatDateToYMD(selectedDate)
      const timeSlots = selectedTimeslots.get(courtSlot) || []

      const request = {
        field_id: fieldId,
        date: formattedDate,
        court: {
          [courtSlot]: timeSlots,
        },
        customer_name: "no",
        customer_phone: "0000000000",
        booking_date: new Date().toISOString(),
      }

      await lockedSlots(request)

      toast({
        title: "Slots locked successfully",
        description: `Successfully locked time slots `,
      })

      const newSelectedTimeslots = new Map(selectedTimeslots)
      newSelectedTimeslots.delete(courtSlot)
      setSelectedTimeslots(newSelectedTimeslots)
      setLockedCourtSlots((prev) => new Set(prev).add(courtSlot))
      setResetSignal((prev) => prev + 1)
    } catch (error) {
      console.error("Error locking slots:", error)
      toast({
        title: "Error",
        description: "Failed to lock the selected time slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLockingSlots(false)
    }
  }

  //Function to lock all selected slots for a field
  const handleLockAllSlots = async (fieldId: string) => {
    if (selectedTimeslots.size === 0) {
      toast({
        title: "No time slots selected",
        description: "Please select at least one time slot to lock",
        variant: "destructive",
      })
      return
    }

    setIsLockingSlots(true)
    try {
      const formattedDate = formatDateToYMD(selectedDate)

      // Create court object with all selected slots
      const courtObj: Record<string, { start_time: string; end_time: string }[]> = {}
      selectedTimeslots.forEach((slots, courtSlot) => {
        if (slots.length > 0) {
          courtObj[courtSlot] = slots
        }
      })

      const request = {
        field_id: fieldId,
        date: formattedDate,
        court: courtObj,
        customer_name: "no",
        customer_phone: "0000000000",
        booking_date: new Date().toISOString(),
      }

      await lockedSlots(request)

      toast({
        title: "Slots locked successfully",
        description: `Successfully locked all selected time slots`,
      })

      // Add all court slots to the locked set
      const newLockedCourtSlots = new Set(lockedCourtSlots)
      selectedTimeslots.forEach((_, courtSlot) => {
        newLockedCourtSlots.add(courtSlot)
      })
      setLockedCourtSlots(newLockedCourtSlots)

      // Clear all selected timeslots
      setSelectedTimeslots(new Map())
      setResetSignal((prev) => prev + 1)
    } catch (error) {
      console.error("Error locking slots:", error)
      toast({
        title: "Error",
        description: "Failed to lock the selected time slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLockingSlots(false)
    }
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
      <div className="md:flex-row gap-6">
        <div className="md:w-3/3">
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

              {/* Field Details Button */}
              <div className="mt-6">
                <Button
                  onClick={toggleFieldDetails}
                  variant="outline"
                  className="w-full flex items-center justify-between"
                >
                  <span>Field Details</span>
                  {showFieldDetails ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>

                {showFieldDetails && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Field Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isFieldLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : field && field.length > 0 ? (
                        <div className="space-y-4">
                          {field.map((fieldItem, index) => (
                            <div
                              key={fieldItem.field_id || index}
                              className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                <div className="">
                                  <span className="text-muted-foreground">Field ID:</span>
                                  <p className="font-medium">{fieldItem.field_id}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Field Name:</span>
                                  <p className="font-medium">{fieldItem.field_name || "N/A"}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Field Price/hour:</span>
                                  <p className="font-medium">{fieldItem.default_price || "N/A"}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => toggleCourtSlot(fieldItem.field_id)}
                                variant="outline"
                                className="w-full flex items-center justify-between gap-4 mt-4"
                              >
                                <span>Booking Details</span>
                                {showBookingFieldDetails[fieldItem.field_id] ? (
                                  <ChevronUp className="h-4 w-4 ml-2" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                )}
                              </Button>

                              {showBookingFieldDetails[fieldItem.field_id] && (
                                <div className="mt-4 h-[calc(100vh-550px)] relative w-full overflow-x-hidden bg-gray-50 rounded-xl shadow-inner">
                                  {/* Date Picker Floating Box */}
                                  <div className="absolute top-6 left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                                    <DatePicker
                                      selected={selectedDate}
                                      onChange={handleDateChange}
                                      dateFormat="yyyy-MM-dd"
                                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      placeholderText="Chọn ngày"
                                      minDate={new Date()}
                                    />
                                  </div>

                                  {/* Booking Section */}
                                  <div className="pt-40 px-4 sm:px-8">
                                    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
                                      <Booking
                                        key={resetSignal}
                                        fieldId={fieldItem.field_id}
                                        date={formatDateToYMD(selectedDate)}
                                        onSelectionChange={handleSelectionChange}
                                        resetSignal={resetSignal}
                                      />
                                    </div>

                                    {/* Single Lock Button for all selected slots */}
                                    {Array.from(selectedTimeslots.keys()).length > 0 && (
                                      <div className="mt-4">
                                        <Button
                                          onClick={() => handleLockAllSlots(fieldItem.field_id)}    
                                          disabled={isLockingSlots}
                                        >
                                          <span className="flex items-center justify-center">
                                            <Lock className="mr-2 h-4 w-4" />
                                            Lock Selected Slots
                                          </span>
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No field information available</p>
                      )}
                    </CardContent>
                  </Card>
                )}
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
        venueImgs={venueImg ?? []}
      />

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
