"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface VenueListHeaderProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  // filterStatus: string;
  // onFilterChange: (value: string) => void;
}

export default function VenueListHeader({
  searchText,
  onSearchChange,
  // filterStatus,
  // onFilterChange,
}: VenueListHeaderProps) {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardHeader heading="Quản lý sân bóng" text="Xem và chỉnh sửa trạng thái sân bóng." />

      <div className="flex items-center gap-3 ml-auto">
        {/* <Select value={filterStatus} onValueChange={onFilterChange}>
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[250px]"
        />
      </div>
    </motion.div>
  );
}
