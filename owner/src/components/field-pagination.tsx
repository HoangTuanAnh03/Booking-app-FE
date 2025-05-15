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

export default function FieldPagination({ meta, onPageChange }: Props) {
  // Hàm xử lý khi nhấn vào nút "Trước"
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (meta.currentPage > 1) {
      onPageChange(meta.currentPage - 1);
    }
  };

  // Hàm xử lý khi nhấn vào nút "Tiếp theo"
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (meta.currentPage < meta.lastPage) {
      onPageChange(meta.currentPage + 1);
    }
  };

  // Hàm xử lý khi nhấn vào một trang cụ thể
  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page >= 1 && page <= meta.lastPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-end mt-6">
      <Pagination>
        <PaginationContent>
          {/* Nút Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={meta.currentPage === 1 ? undefined : handlePrevious}
              className={
                meta.currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {/* Hiển thị trang đầu tiên nếu không phải là trang 1 */}
          {meta.currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageChange(1, e)}
                  isActive={meta.currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationEllipsis />
            </>
          )}

          {/* Các trang gần với trang hiện tại */}
          {Array.from({ length: Math.min(5, meta.lastPage) })
            .map((_, index) => index + Math.max(1, meta.currentPage - 2))
            .filter((page) => page <= meta.lastPage)
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={meta.currentPage === page}
                  onClick={(e) => handlePageChange(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Hiển thị dấu ba chấm nếu cần */}
          {meta.currentPage < meta.lastPage - 2 && <PaginationEllipsis />}

          {/* Hiển thị trang cuối cùng nếu không phải là trang cuối cùng */}
          {meta.currentPage < meta.lastPage - 1 && (
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => handlePageChange(meta.lastPage, e)}
                isActive={meta.currentPage === meta.lastPage}
              >
                {meta.lastPage}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Nút Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={
                meta.currentPage === meta.lastPage ? undefined : handleNext
              }
              className={
                meta.currentPage === meta.lastPage
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
