"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface VenueStatusChartProps {
  dashboard: {
    venue: {
      active: number;
      locked: number;
      banned: number;
    };
  };
}

const COLORS = [
  "#7FB77E", // Active: xanh pastel
  "#FFD6A5", // Locked: vàng pastel
  "#F8C4B4", // Banned: cam nhẹ
];

export function VenueStatusChart({ dashboard }: VenueStatusChartProps) {
  const venueData = [
    { status: "Đang hoạt động", count: dashboard.venue.active },
    { status: "Đã khóa", count: dashboard.venue.locked },
    { status: "Bị cấm", count: dashboard.venue.banned },
  ];

  const totalVenues =
    dashboard.venue.active + dashboard.venue.locked + dashboard.venue.banned;

  return (
    <Card className="shadow-md rounded-2xl border border-muted bg-background/90 backdrop-blur-sm">
      <CardHeader className="text-center space-y-1 pb-2">
        <CardTitle className="text-lg font-semibold tracking-wide">
          Tình trạng sân
        </CardTitle>
        <CardDescription>Cập nhật mới nhất</CardDescription>
      </CardHeader>

      <CardContent className="px-6 pt-2 pb-4">
      <ChartContainer config={{}} className="aspect-square max-h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="status" hideLabel />}
              />
              <Pie
                data={venueData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                label={({ payload, ...props }) => (
                  <text
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsl(var(--foreground))"
                    fontSize={12}
                  >
                    {payload.count}
                  </text>
                )}
              >
                {venueData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-1 text-sm">
        <div className="flex items-center gap-1 font-medium leading-none text-green-600">
          Tổng cộng {totalVenues} sân <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground text-xs">
          Bao gồm sân đang hoạt động, khóa, bị cấm
        </div>
      </CardFooter>
    </Card>
  );
}
