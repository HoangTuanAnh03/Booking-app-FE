// components/user/UserTable.tsx
"use client";

import { UserItemType } from "@/schemaValidations/user.schema";
import { ArrowUp, Landmark, Mail, Phone, Settings, Tag, User } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Props = {
  users: UserItemType[];
  isLoading: boolean;
  onUpgradeClick: (user: UserItemType) => void;
  onViewVenue: (userId: string) => void;
};

export function UserTable({ users, isLoading, onUpgradeClick, onViewVenue }: Props) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có người dùng nào.
      </div>
    );
  }

  return (
    <motion.div
      className="overflow-x-auto rounded-xl border shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Table className="table-fixed w-full text-sm">
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="text-center w-[20%]">
              <div className="flex justify-center items-center gap-1">
                <User className="w-4 h-4" />
                <span>Họ tên</span>
              </div>
            </TableHead>
            <TableHead className="text-center w-[20%]">
              <div className="flex justify-center items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>SĐT</span>
              </div>
            </TableHead>
            <TableHead className="text-center w-[30%]">
              <div className="flex justify-center items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </div>
            </TableHead>
            <TableHead className="text-center w-[15%]">
              <div className="flex justify-center items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>Vai trò</span>
              </div>
            </TableHead>
            <TableHead className="text-center w-[15%]">
              <div className="flex justify-center items-center gap-1">
                <Settings className="w-4 h-4" />
                <span>Hành động</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <motion.tr
              key={user.uuid}
              className="cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell className="text-center break-words p-3">{user.name}</TableCell>
              <TableCell className="text-center break-words p-3">{user.phone_number}</TableCell>
              <TableCell className="text-center break-words p-3">{user.email}</TableCell>
              <TableCell className="text-center p-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "owner"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role === "owner" ? "Owner" : "User"}
                </span>
              </TableCell>
              <TableCell className="text-center p-3">
                <div className="flex justify-center gap-2">
                  {user.role === "user" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpgradeClick(user)}
                      className="flex items-center gap-1"
                    >
                      <ArrowUp className="w-4 h-4" />
                      Nâng quyền
                    </Button>
                  )}
                  {user.role === "owner" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewVenue(user.uuid)}
                      className="flex items-center gap-1"
                    >
                      <Landmark className="w-4 h-4" />
                      Xem Venue
                    </Button>
                  )}
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
