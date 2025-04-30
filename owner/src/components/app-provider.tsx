"use client";
import userApiRequest from "@/apiRequests/users";
import {
  getAccessTokenFormLocalStorage,
} from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useRef } from "react";
import { create } from "zustand";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

type AppStoreType = {
  isAuth: boolean;
  image: string;
  setImage: (image: string) => void;
  name: string;
  setName: (name: string) => void;
};

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  image: "",
  setImage: (image: string) => {
    set({ image: image });
  },
  name: "",
  setName: (name: string) => {
    set({ name: name });
  },
}));

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const count = useRef(0);
  const setImage = useAppStore((state) => state.setImage);
  const setName = useAppStore((state) => state.setName);

  useEffect(() => {
    const fetchData = async () => {
      if (count.current === 0) {
        const accessToken = getAccessTokenFormLocalStorage();
        if (accessToken) {
          const res = await userApiRequest.sGetMyInfo();
          if (res.status === 200) {
            setImage(res.payload.data?.avatar ?? "");
            setName(res.payload.data?.name!);
          }
        }
        count.current++;
      }
    };

    fetchData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
