"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, ChevronUp, Eye } from "lucide-react"
import type { Booking } from "@/types/booking"
import { completeBookingById } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"

interface BookingTableProps {
  bookings: Booking[]
}

export function BookingTable({ bookings: initialBookings }: BookingTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  // const [bookingStatus, setBookingStatus] = useState(bookings[0].status)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  const toggleRow = (bookingId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Inline formatting functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  const formatPrice = (priceString: string) => {
    const price = Number.parseFloat(priceString.replace(/,/g, ""))
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const disabledStatuses = ["pending", "completed", "cancelled"]

  const handleComplete = async (booking_id: string) => {
    try {
      await completeBookingById(booking_id)
      setBookings((prev) =>
        prev.map((booking) =>
          booking.booking_id === booking_id
            ? { ...booking, status: "completed" }
            : booking
        )
      )
      toast({
        title: "Update completed",
      })
    } catch (err) {
      console.error("Error completing booking:", err)
    }
  }

  if (bookings.length === 0) {
    return <p className="text-center py-4">No bookings found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Booking ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <>
              <TableRow key={booking.booking_id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRow(booking.booking_id)}
                    aria-label={expandedRows[booking.booking_id] ? "Collapse row" : "Expand row"}
                  >
                    {expandedRows[booking.booking_id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{booking.booking_id}</TableCell>
                <TableCell>
                  <div>{booking.customer_name}</div>
                  <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                </TableCell>
                <TableCell>{formatDate(booking.booking_date)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(booking.total_price)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <span className="text-sm font-medium">Booking ID:</span>
                          <span className="col-span-2">{booking.booking_id}</span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <span className="text-sm font-medium">Customer:</span>
                          <span className="col-span-2">{booking.customer_name}</span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <span className="text-sm font-medium">Phone:</span>
                          <span className="col-span-2">{booking.customer_phone}</span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <span className="text-sm font-medium">Date:</span>
                          <span className="col-span-2">{formatDate(booking.booking_date)}</span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <span className="text-sm font-medium">Status:</span>
                          <span className="col-span-2">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <span className="text-sm font-medium">Total Price:</span>
                          <span className="col-span-2 font-medium">{formatPrice(booking.total_price)}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon"  disabled={disabledStatuses.includes(booking.status)}>
                        
                        <Check className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Complete Booking</DialogTitle>
                      </DialogHeader>
                      <div>
                        Make sure you have been paid, Action can't be undone
                      </div>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleComplete(booking.booking_id)}
                            disabled={disabledStatuses.includes(booking.status)}
                          >
                            Complete
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button className="bg-red-500 hover:bg-red-600 text-white">
                            Cancel
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
              {expandedRows[booking.booking_id] && (
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={7}>
                    <div className="p-2">
                      <h4 className="font-medium mb-2">Court Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {booking.courts.map((court, index) => (
                          <div key={index} className="bg-background p-3 rounded-md border">
                            <div className="text-sm">
                              <span className="font-medium">Court ID:</span> {court.court_id}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Time:</span> {formatTime(court.start_time)} -{" "}
                              {formatTime(court.end_time)}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Price:</span> {formatPrice(court.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
