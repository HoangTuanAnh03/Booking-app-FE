"use client";

import { useState, useEffect } from "react";
import { UserListHeader } from "@/components/user-list-header";
import { UserTable } from "@/components/user-list-table";
import { UpgradeDialog } from "@/components/user-update-dialog";
import { UserItemType } from "@/schemaValidations/user.schema";
import { motion } from "framer-motion";
import { useUserList } from "@/queries/useUserList";
import { UserPagination } from "@/components/user-pagination";

export default function UserListManagement() {
  const [filterRole, setFilterRole] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItemType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const usersPerPage = 10;

  // Reset page về 1 khi search/filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterRole]);

  const {
    users,
    isLoading,
    totalPages,
    handleUpgradeRole,
    handleViewVenue,
    isUpgrading,
  } = useUserList({
    filterRole,
    searchText,
    currentPage,
    usersPerPage,
    onCloseDialog: () => setOpenDialog(false),
    onClearSelectedUser: () => setSelectedUser(null),
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header*/}
      <UserListHeader
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {/* Table + Pagination */}
      <motion.div
        className="overflow-x-auto rounded-xl border shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserTable
          users={users}
          isLoading={isLoading}
          onUpgradeClick={(user) => {
            setSelectedUser(user);
            setOpenDialog(true);
          }}
          onViewVenue={handleViewVenue}
        />

        <UserPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </motion.div>

      {/* Dialog nâng quyền */}
      <UpgradeDialog
        open={openDialog}
        user={selectedUser}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          if (selectedUser) {
            handleUpgradeRole(selectedUser.uuid);
          }
        }}
        loading={isUpgrading}
      />
    </div>
  );
}
