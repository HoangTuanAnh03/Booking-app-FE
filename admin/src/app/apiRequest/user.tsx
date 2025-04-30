import { UserListResType } from "@/schemaValidations/user.schema";
import http from "@/utils/api";

const userApiRequest = {
    
    getUsers: () => http.get<UserListResType>("/admin/users"),
    upRole: (userId: string) => http.get(`/admin/users/${userId}/upRole`),
}

export default userApiRequest