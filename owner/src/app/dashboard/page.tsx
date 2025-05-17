'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { DashboardData } from '@/types/dashboard';
import {useDashboard} from "@/queries/useDashboard";
import {Loader2} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const router = useRouter();
    const { data: dashboard, isLoading, error } = useDashboard();

    useEffect(() => {
        if (dashboard?.payload.data) {
            setData(dashboard.payload.data);
        }
    }, [dashboard]);

    if (isLoading){
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
                <span className="ml-2 text-muted-foreground">Đang tải dữ liệu</span>
            </div>
        );
    }
    if (!data) {
        return <div className="flex justify-center items-center h-screen">No data available</div>;
    }

    // Format revenue as VND
    const formatVND = (value: string) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(value.replace(',', '')));
    };

    // Pie chart data for venue status
    const venueStatusData = {
        labels: ['Hoạt động', 'Không hoạt động'],
        datasets: [
            {
                data: [data.active_venues, data.total_venues - data.active_venues],
                backgroundColor: ['#36B9CC', '#F87171'],
                hoverBackgroundColor: ['#2B9BBF', '#EF4444'],
            },
        ],
    };

    // Bar chart data for top 5 venues by revenue
    const revenueChartData = {
        labels: data.top_5_venues_by_revenue.map((venue) => venue.venue_name),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: data.top_5_venues_by_revenue.map((venue) => parseFloat(venue.revenue.replace(',', ''))),
                backgroundColor: '#36B9CC',
                borderColor: '#2B9BBF',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="relative">
            {/* Header */}
            <header className="fixed top-0 w-full bg-background z-10">
                <div className="container mx-auto px-6 py-2">
                    <h2 className="text-2xl font-bold text-gray-800">Trang chủ</h2>
                </div>
            </header>

            <div className="pt-16 px-6 space-y-8 overflow-auto min-h-screen">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Tổng số địa điểm</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-gray-700">{data.total_venues}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Địa điểm hoạt động</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-gray-700">{data.active_venues}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Cụm sân hoạt động</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-gray-700">{data.fields.active}</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Cụm sân không hoạt động</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-gray-700">{data.fields.inactive}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart: Venue Status */}
                    <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Tình trạng địa điểm</CardTitle>
                            <Button variant="outline" onClick={() => router.push('/venue')}>
                                Xem chi tiết địa điểm
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-60">
                                <Pie
                                    data={venueStatusData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {position: 'top'},
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => `${context.label}: ${context.raw}`,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart: Top 5 Venues by Revenue */}
                    <Card className="shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Top 5 doanh thu</CardTitle>
                            <Button variant="outline" onClick={() => router.push('/venue/stats')}>
                                Xem thống kê chi tiết
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-60">
                                <Bar
                                    data={revenueChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {display: true, text: 'Revenue (VND)'},
                                                ticks: {
                                                    callback: (value) => new Intl.NumberFormat('vi-VN').format(value),
                                                },
                                            },
                                            x: {
                                                title: {display: true, text: 'Venue'},
                                            },
                                        },
                                        plugins: {
                                            legend: {display: false},
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => `${context.dataset.label}: ${formatVND(context.raw.toString())}`,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Table: Top 5 Venues by Revenue */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Top 5 địa điểm doanh thu cao nhất</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên địa điểm</TableHead>
                                        <TableHead>Doanh thu (VND)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.top_5_venues_by_revenue.length > 0 ? (
                                        data.top_5_venues_by_revenue.map((venue, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{venue.venue_name}</TableCell>
                                                <TableCell>{formatVND(venue.revenue)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center">No data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Table: Top 5 Booked Venues */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Top 5 địa điểm được đặt trước nhiều nhất</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên địa điểm</TableHead>
                                        <TableHead>Số lượt đặt</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.top_5_booked_venue.length > 0 ? (
                                        data.top_5_booked_venue.map((venue, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{venue.venue_name}</TableCell>
                                                <TableCell>{venue.booking_count}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center">No data available</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}