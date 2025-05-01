// components/venue/VenuePagination.tsx
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
  } from "@/components/ui/pagination";
  
  interface Props {
    meta: {
      currentPage: number;
      lastPage: number;
    };
    onPageChange: (page: number) => void;
  }
  
  export default function VenuePagination({ meta, onPageChange }: Props) {
    return (
      <div className="flex justify-end mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(meta.currentPage - 1);
                }}
              />
            </PaginationItem>
  
            {Array.from({ length: meta.lastPage }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={meta.currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
  
            {meta.lastPage > 5 && <PaginationEllipsis />}
  
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(meta.currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }
  