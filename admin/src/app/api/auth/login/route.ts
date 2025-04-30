import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await res.json();

  if (res.status === 200 && payload?.data?.access_token) {
    const { access_token } = payload.data;
    const now = new Date();

    // Lưu token vào cookie
    cookies().set("accessToken", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: true,
      secure: true,
      expires: new Date(now.setDate(now.getDate() + 30)),
    });
  }

  return Response.json(payload, {
    status: res.status,
  });
}
