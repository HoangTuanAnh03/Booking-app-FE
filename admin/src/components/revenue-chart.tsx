"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface RevenueChartProps {
  dashboard: {
    totalRevenue: Record<string, number>;
  };
}

export function RevenueChart({ dashboard }: RevenueChartProps) {
  const allYears = Array.from(
    new Set(
      Object.keys(dashboard.totalRevenue).map((date) => date.split("-")[0])
    )
  );

  const [selectedYear, setSelectedYear] = useState(allYears[0] || "");

  const filteredData = Object.entries(dashboard.totalRevenue)
    .filter(([date]) => date.startsWith(selectedYear))
    .map(([date, revenue]) => ({
      month: date.split("-")[1], // "01", "02", ...
      revenue,
    }));

  return (
    <Card className="shadow-md rounded-2xl col-span-1 md:col-span-2 xl:col-span-3">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Doanh thu theo tháng</CardTitle>
            <CardDescription>Năm {selectedYear}</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {allYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ChartContainer config={{}} className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 40, left: 40 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickFormatter={(month) => `Th ${month}`}
              />
              <YAxis hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="month"
                    formatter={(value) =>
                      `${Number(value).toLocaleString("vi-VN")} VND`
                    }
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#F7A76C"
                strokeWidth={2}
                dot={{ fill: "#F7A76C" }}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  position="top"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
