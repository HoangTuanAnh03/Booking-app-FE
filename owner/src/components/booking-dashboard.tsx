"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingTable } from "@/components/booking-table"
import { BookingStats } from "@/components/booking-stats"
import { Pagination } from "@/components/pagination"
import { Loader2 } from "lucide-react"
import type { BookingStatsResponse } from "@/types/booking"
import { fetchBookings } from "@/lib/api"

export function BookingDashboard() {
  const [bookingData, setBookingData] = useState<BookingStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [totalCompletedPrice, setTotalCompletedPrice] = useState<string>('0')


  useEffect(() => {
    const getBookings = async () => {
      setLoading(true)
      try {
        const data = await fetchBookings({
          page: currentPage,
          status: statusFilter,
        })
        setBookingData(data)
        setError(null)
      } catch (err) {
        console.error("Error in booking dashboard:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")

        // Keep showing previous data if available
        if (!bookingData) {
          // Create minimal fallback data structure if no previous data exists
          setBookingData({
            status: 0,
            message: "Error loading data",
            data: {
              bookings: [],
              total_completed_price: "0",
              pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0,
                next_page_url: null,
                prev_page_url: null,
              },
            },
          })
        }
      } finally {
        setLoading(false)
      }
    }

    getBookings()
  }, [currentPage, statusFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading && !bookingData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading booking data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-600 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-alert-triangle"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              API Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Using mock data for preview. In production, please ensure your API server is running at
              http://127.0.0.1:8000
            </p>
          </CardContent>
        </Card>

        {bookingData && (
          <>
            <BookingStats totalCompletedPrice={bookingData.data.total_completed_price} />

            <Card>
              <CardHeader>
                <CardTitle>Bookings (Mock Data)</CardTitle>
                <CardDescription>Showing mock data since the API is unavailable.</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingTable bookings={bookingData.data.bookings} onTotalPriceChange={(newPrice) => setTotalCompletedPrice(newPrice)} />

                {bookingData.data.pagination && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={bookingData.data.pagination.current_page}
                      totalPages={bookingData.data.pagination.last_page}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 ml-10 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground">Manage and monitor all your court bookings in one place.</p>
        </div>
      </div>

      {bookingData && (
        <>
          <BookingStats
            totalCompletedPrice={
              totalCompletedPrice !== "0"
                ? totalCompletedPrice
                : bookingData?.data.total_completed_price || "0"
            }
          />
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>A list of all bookings with their details and status.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingTable bookings={bookingData.data.bookings} onTotalPriceChange={(newPrice) => setTotalCompletedPrice(newPrice)} />

              {/* {bookingData.data.pagination && (
                <div className="mt-4">
                  <Pagination
                    currentPage={bookingData.data.pagination.current_page}
                    totalPages={bookingData.data.pagination.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )} */}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
