import http from "@/utils/api";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: IBackendRes<LoginResType>;
  }> | null,

  sLogin: (body: LoginBodyType) =>
    http.post<IBackendRes<LoginResType>>("/login", body),

  login: (body: LoginBodyType) =>
    http.post<IBackendRes<LoginResType>>("/api/auth/login", body, {
      baseUrl: "",
    }),

  sVerifyRegister: (code: string) =>
    http.get<IBackendRes<LoginResType>>(`/verifyEmail?token=${code}`),

  verifyRegister: (code: string) =>
    http.post<IBackendRes<LoginResType>>("/api/auth/verify/register", code, {
      baseUrl: "",
    }),

  sLogout: () => http.post<IBackendRes<any>>("/logout", {}),

  logout: () =>
    http.post<IBackendRes<any>>(
      "/api/logout",
      {},
      {
        baseUrl: "http://127.0.0.1:8000",
      }
    ),

  sRegister: (body: RegisterBodyType) =>
    http.post<IBackendRes<any>>("/register", body),
};

export default authApiRequest;
