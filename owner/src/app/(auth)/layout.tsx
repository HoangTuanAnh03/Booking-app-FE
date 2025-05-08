// import Header from "@/components/header/Header";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <Header /> */}
      <Toaster />
      {children}
    </div>
  );
}
