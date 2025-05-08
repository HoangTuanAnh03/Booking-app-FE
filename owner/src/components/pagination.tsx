"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    // Always show first page
    items.push(1)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 2; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      // Complex pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        items.push(2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near end
        items.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        // Middle
        items.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return items
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {generatePaginationItems().map((item, index) =>
        typeof item === "number" ? (
          <Button
            key={index}
            variant={currentPage === item ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(item)}
            className="w-9 h-9"
          >
            {item}
          </Button>
        ) : (
          <span key={index} className="px-2">
            ...
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
