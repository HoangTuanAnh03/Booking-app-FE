// components/venue/VenueTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import {
    Landmark,
    MapPin,
    TrafficCone,
    CreditCard,
    Settings,
    Lock,
    Unlock,
  } from "lucide-react";
  import { VenueItemType } from "@/schemaValidations/venue.schema";
  
  interface Props {
    venues: VenueItemType[];
    loading: boolean;
    onOpenDialog: (open: boolean) => void;
    setSelectedVenue: (venue: VenueItemType) => void;
  }
  import { motion } from "framer-motion";
  
  export default function VenueTable({
    venues,
    loading,
    onOpenDialog,
    setSelectedVenue,
  }: Props) {
    return (
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
                            onOpenDialog(true);
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
    );
  }
  