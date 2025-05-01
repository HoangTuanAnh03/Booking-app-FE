// hooks/useUserList.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, upRole } from "@/lib/api";
import { UserItemType } from "@/schemaValidations/user.schema";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type UserList = {
  owners: UserItemType[];
  users: UserItemType[];
};

export const useUserList = ({
  filterRole,
  searchText,
  currentPage,
  usersPerPage,
  onCloseDialog,
  onClearSelectedUser,
}: {
  filterRole: string;
  searchText: string;
  currentPage: number;
  usersPerPage: number;
  onCloseDialog: () => void;
  onClearSelectedUser: () => void;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const userQuery = useQuery<UserList>({
    queryKey: ["users"],
    queryFn: async () => {
      const { payload } = await getUsers();
      return {
        owners: payload.data.owner || [],
        users: payload.data.user || [],
      };
    },
  });

  const users = useMemo(
    () => [...(userQuery.data?.owners || []), ...(userQuery.data?.users || [])],
    [userQuery.data]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchRole = filterRole === "all" || user.role === filterRole;
      const matchSearch =
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, filterRole, searchText]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredUsers.length / usersPerPage);
  }, [filteredUsers.length, usersPerPage]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(start, start + usersPerPage);
  }, [filteredUsers, currentPage, usersPerPage]);

  const upgradeRoleMutation = useMutation({
    mutationFn: async (userId: string) => {
      await upRole(userId);
    },
    onSuccess: (_, userId) => {
      toast({
        title: "Thành công",
        description: `Người dùng đã được nâng quyền Owner.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onCloseDialog();
      onClearSelectedUser();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể nâng quyền người dùng.",
        variant: "destructive",
      });
    },
  });

  const handleUpgradeRole = async (userId: string) => {
    await upgradeRoleMutation.mutateAsync(userId);
  };

  const handleViewVenue = (userId: string) => {
    router.push(`/venues?userId=${userId}`);
  };

  return {
    ...userQuery,
    users: paginatedUsers,
    totalPages,
    handleUpgradeRole,
    handleViewVenue,
    isUpgrading: upgradeRoleMutation.isPending,
  };
};
