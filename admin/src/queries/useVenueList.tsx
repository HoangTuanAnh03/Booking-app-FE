import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getVenues, getVenuesByUser, activateVenue } from "@/lib/api";
import { VenueItemType } from "@/schemaValidations/venue.schema";

export default function useVenueList() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [venues, setVenues] = useState<VenueItemType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: 0, currentPage: 1, lastPage: 1 });
  const [selectedVenue, setSelectedVenue] = useState<VenueItemType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchVenues(1);
  }, [userId, searchText]);

  const fetchVenues = async (page: number) => {
    setLoading(true);
    try {
      if (userId) {
        const { payload } = await getVenuesByUser(userId);
        setVenues(payload.data);
        setMeta({ total: payload.data.length, currentPage: 1, lastPage: 1 });
      } else {
        const { payload } = await getVenues(page, searchText);
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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > meta.lastPage) return;
    fetchVenues(page);
  };

  const handleToggleStatus = async (venueId: string) => {
    try {
      await activateVenue(venueId);
      toast({
        title: "Thành công",
        description: "Đã thay đổi trạng thái sân.",
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

  return {
    venues,
    meta,
    loading,
    searchText,
    setSearchText,
    selectedVenue,
    setSelectedVenue,
    openDialog,
    setOpenDialog,
    handlePageChange,
    handleToggleStatus, 
  };
}
