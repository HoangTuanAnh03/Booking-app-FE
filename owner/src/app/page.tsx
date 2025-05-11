"use client";

import { useAppStore } from "@/components/app-provider";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/venue");

  return <main>HOme</main>;
}
