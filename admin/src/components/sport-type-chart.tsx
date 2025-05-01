


"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DashboardProps {
  dashboard: {
    sport_type: {
      detail: {
        name: string;
        fields_count: number;
      }[];
    };
  };
}

export function SportTypeChart({ dashboard }: DashboardProps) {
  const data = dashboard.sport_type.detail;

  return (
    <Card className="shadow-lg rounded-2xl flex flex-col border border-muted bg-background/90 backdrop-blur-sm">
      <CardHeader className="pb-2 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          
          <CardTitle className="text-lg font-semibold tracking-wide">
            Loại hình thể thao
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Số lượng sân theo từng môn
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 px-6 pt-2 pb-6">
        <ChartContainer config={{}} className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              barCategoryGap="15%"
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                width={150}
                tick={{
                  fontSize: 12,              
                  fontWeight: 600,            
                  fill: "#1f2937",
                  dx: -15,  }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="name"
                    formatter={(value) => `Số sân: ${value} sân`}
                  />
                }
              />
              <Bar
                dataKey="fields_count"
                fill="url(#gradient)"
                radius={[6, 6, 6, 6]}
              >
                <LabelList
                  dataKey="fields_count"
                  position="right"
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
              <defs>
                <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#6EB5FF" />
                  <stop offset="100%" stopColor="#A0C4FF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
