"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import motion
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
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Phone,
  Mail,
  Tag,
  Settings,
  ArrowUp,
  Landmark,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import { useToast } from "@/hooks/use-toast";
import { UserItemType } from "@/schemaValidations/user.schema";
import userApiRequest from "@/app/apiRequest/user";

export default function UserListPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserItemType[]>([]);
  const [filterRole, setFilterRole] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItemType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterRole]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { payload } = await userApiRequest.getUsers();
      const ownerList = payload.data.owner || [];
      const userList = payload.data.user || [];
      setUsers([...ownerList, ...userList]);
    } catch {
      toast({
        title: "Lỗi tải danh sách",
        description: "Không thể lấy danh sách người dùng.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeRole = async () => {
    if (!selectedUser) return;
    try {
      await userApiRequest.upRole(selectedUser.uuid);
      toast({
        title: "Thành công",
        description: `${selectedUser.name} đã được nâng quyền Owner.`,
        variant: "default",
      });
      fetchUsers();
    } catch {
      toast({
        title: "Lỗi",
        description: "Không thể nâng quyền người dùng.",
        variant: "destructive",
      });
    } finally {
      setOpenDialog(false);
      setSelectedUser(null);
    }
  };

  const handleViewVenue = (userId: string) => {
    router.push(`/venues?userId=${userId}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    return matchRole && matchSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
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
          <h1 className="text-2xl font-bold mb-1">Quản lý người dùng</h1>
          <p className="text-muted-foreground text-sm">
            Xem và chỉnh sửa vai trò người dùng.
          </p>
        </div>

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

      {/* Table */}
      <motion.div
        className="overflow-x-auto rounded-xl border shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Table className="table-fixed w-full text-sm">
          <TableHeader>
            <tr className="bg-muted/40">
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
            </tr>
          </TableHeader>

          <TableBody>
            {loading ? (
              <tr>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Đang tải dữ liệu...
                </TableCell>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không có người dùng nào.
                </TableCell>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <motion.tr
                  key={user.uuid}
                  className="cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TableCell className="text-center break-words p-3">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-center break-words p-3">
                    {user.phone_number}
                  </TableCell>
                  <TableCell className="text-center break-words p-3">
                    {user.email}
                  </TableCell>
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
                          onClick={() => {
                            setSelectedUser(user);
                            setOpenDialog(true);
                          }}
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
                          onClick={() => handleViewVenue(user.uuid)}
                          className="flex items-center gap-1"
                        >
                          <Landmark className="w-4 h-4" />
                          Xem Venue
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>

      {/* Dialog */}
      {selectedUser && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Xác nhận nâng quyền</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn nâng <strong>{selectedUser.name}</strong> thành{" "}
                <strong className="text-red-500">Owner</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleUpgradeRole}>
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
