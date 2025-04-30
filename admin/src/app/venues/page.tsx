"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import venueApiRequest from "@/app/apiRequest/venue";
import { VenueItemType } from "@/schemaValidations/venue.schema";
import {
  Landmark,
  MapPin,
  TrafficCone,
  CreditCard,
  Settings,
  Lock,
  Unlock,
} from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VenueListPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [venues, setVenues] = useState<VenueItemType[]>([]);
  // const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    total: 0,
    currentPage: 1,
    lastPage: 1,
  });

  const [selectedVenue, setSelectedVenue] = useState<VenueItemType | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchVenues(1);
  }, [userId, searchText]);

  const fetchVenues = async (page: number) => {
    setLoading(true);
    try {
      if (userId) {
        const { payload } = await venueApiRequest.getVenuesByUser(userId);
        setVenues(payload.data);
        setMeta({
          total: payload.data.length,
          currentPage: 1,
          lastPage: 1,
        });
      } else {
        const { payload } = await venueApiRequest.getVenues(page, searchText);
        setVenues(payload.data.data);
        setMeta({
          total: payload.data.total,
          currentPage: payload.data.current_page,
          lastPage: payload.data.last_page,
        });
      }
    } catch {
      toast({
        title: "Lỗi tải danh sách",
        description: "Không thể lấy danh sách sân.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (venueId: string) => {
    try {
      await venueApiRequest.activateVenue(venueId);
      toast({
        title: "Thành công",
        description: "Đã thay đổi trạng thái sân.",
        variant: "default",
      });
      fetchVenues(meta.currentPage);
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái sân.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > meta.lastPage) return;
    fetchVenues(page);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl font-bold mb-1">Quản lý sân bóng</h1>
          <p className="text-muted-foreground text-sm">
            Xem và chỉnh sửa trạng thái sân bóng.
          </p>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="locked">Đã khóa</SelectItem>
            </SelectContent>
          </Select> */}

          <Input
            placeholder="🔎 Tìm kiếm tên hoặc vị trí sân"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[250px]"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="overflow-x-auto rounded-xl border shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="text-center w-[20%]">
                <div className="flex justify-center items-center gap-1 text-wrap text-center">
                  <Landmark className="w-4 h-4" />
                  <span>Tên sân</span>
                </div>
              </TableHead>
              <TableHead className="text-center w-[25%]">
                <div className="flex justify-center items-center gap-1 text-wrap text-center">
                  <MapPin className="w-4 h-4" />
                  <span>Địa chỉ</span>
                </div>
              </TableHead>
              <TableHead className="text-center w-[15%]">
                <div className="flex justify-center items-center gap-1 text-wrap text-center">
                  <TrafficCone className="w-4 h-4" />
                  <span>Trạng thái</span>
                </div>
              </TableHead>
              <TableHead className="text-center w-[20%]">
                <div className="flex justify-center items-center gap-1 text-wrap text-center">
                  <CreditCard className="w-4 h-4" />
                  <span>Thanh toán</span>
                </div>
              </TableHead>
              <TableHead className="text-center w-[20%]">
                <div className="flex justify-center items-center gap-1 text-wrap text-center">
                  <Settings className="w-4 h-4" />
                  <span>Hành động</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : venues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không có sân nào.
                </TableCell>
              </TableRow>
            ) : (
              venues.map((venue) => (
                <TableRow key={venue.venue_id}>
                  <TableCell className="text-center break-words">
                    {venue.name}
                  </TableCell>
                  <TableCell className="text-center break-words">
                    {venue.address}
                  </TableCell>
                  <TableCell className="text-center capitalize break-words">
                    {venue.status}
                  </TableCell>
                  <TableCell className="text-center break-words">
                    {venue.payment_status}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Button
                        variant={
                          venue.status === "locked" ? "default" : "secondary"
                        }
                        size="sm"
                        disabled={venue.status === "active"}
                        onClick={() => {
                          setSelectedVenue(venue);
                          setOpenDialog(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        {venue.status === "locked" ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Mở khóa
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Khóa
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(meta.currentPage - 1);
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
                    handlePageChange(index + 1);
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
                  handlePageChange(meta.currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialog */}
      {selectedVenue && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Xác nhận thay đổi trạng thái sân</DialogTitle>
              <DialogDescription>
                <strong className="text-blue-500">Mở khoá</strong>
                {" "}trạng thái{" "}
                <strong>{selectedVenue.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toggleStatus(selectedVenue.venue_id);
                  setOpenDialog(false);
                }}
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
