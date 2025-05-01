"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

type Props = {
  filterRole: string;
  setFilterRole: (value: string) => void;
  searchText: string;
  setSearchText: (value: string) => void;
};

export const UserListHeader = ({
  filterRole,
  setFilterRole,
  searchText,
  setSearchText,
}: Props) => {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardHeader heading="Quản lý người dùng" text="Xem và chỉnh sửa vai trò người dùng." />
      <div className="flex items-center gap-3 ml-auto">
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="🔎 Tìm kiếm tên hoặc email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-[250px]"
        />
      </div>
    </motion.div>
  );
};
