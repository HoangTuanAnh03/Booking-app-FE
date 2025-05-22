"use client";
import { useEffect, useState } from "react";
import { useBookingStats } from "@/queries/useBooking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VenueBookingStatsData } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { DashboardHeader } from "@/components/venue-header";

const months = [
    { value: undefined, label: "Chọn tháng" },
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
];

const currentYear = new Date().getFullYear();
const years = [
    { value: undefined, label: "Chọn năm" },
    ...Array.from({ length: 10 }).map((_, i) => ({
        value: currentYear - i,
        label: (currentYear - i).toString(),
    })),
];

export default function Stats() {
    const [month, setMonth] = useState<string | undefined>(undefined);
    const [year, setYear] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expandedVenues, setExpandedVenues] = useState<Set<string>>(new Set());
    const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
    const [venues, setVenues] = useState<VenueBookingStatsData[]>([]);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const { data, isLoading, error } = useBookingStats({ month, year });

    const venuesPerPage = 5;

    useEffect(() => {
        if (data?.payload.data) {
            setVenues(data?.payload.data.venues);
            setTotalRevenue(data?.payload.data.total_revenue);
            setCurrentPage(1);
        }
    }, [data]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const toggleVenue = (venueId: string) => {
        setExpandedVenues((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(venueId)) newSet.delete(venueId);
            else newSet.add(venueId);
            return newSet;
        });
    };

    const toggleField = (fieldId: string) => {
        setExpandedFields((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(fieldId)) newSet.delete(fieldId);
            else newSet.add(fieldId);
            return newSet;
        });
    };

    const filteredVenues = venues.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
    const startIndex = (currentPage - 1) * venuesPerPage;
    const paginatedVenues = filteredVenues.slice(startIndex, startIndex + venuesPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <DashboardHeader />
            <div className="container mx-auto p-6 max-w-7xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Thống kê doanh thu</h1>

                <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700">Tổng doanh thu tất cả sân</h2>
                    <p className="text-2xl font-bold text-blue-600">{totalRevenue.toLocaleString()} VNĐ</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Input
                        placeholder="Tìm kiếm địa điểm  ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 bg-white"
                    />
                    <Select
                        value={month ?? ""}
                        onValueChange={(val) => setMonth(val === "" ? undefined : val)}
                    >
                        <SelectTrigger className="w-full sm:w-48 bg-white">
                            <SelectValue placeholder="Chọn tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map(({ value, label }) => (
                                <SelectItem key={label} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={year ?? ""}
                        onValueChange={(val) => setYear(val === "" ? undefined : val)}
                    >
                        <SelectTrigger className="w-full sm:w-48 bg-white">
                            <SelectValue placeholder="Chọn năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(({ value, label }) => (
                                <SelectItem key={label} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoading && <p className="text-gray-600">Đang tải dữ liệu...</p>}
                {error && <p className="text-red-600 font-medium">Lỗi tải dữ liệu</p>}
                {filteredVenues.length === 0 && !isLoading && !error && (
                    <p className="text-gray-600">Không tìm thấy địa điêểm phù hợp.</p>
                )}
                {paginatedVenues.length > 0 && (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="w-full bg-white">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Tên Địa Điểm</th>
                                    <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider">Số Sân</th>
                                    <th className="py-4 px-6 text-right font-semibold text-sm uppercase tracking-wider">Tổng doanh thu (VNĐ)</th>
                                    <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedVenues.map((venue) => (
                                    <React.Fragment key={venue.venue_id}>
                                        <tr className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-gray-800">{venue.name}</td>
                                            <td className="py-4 px-6 text-center text-gray-600">{venue.fields.length}</td>
                                            <td className="py-4 px-6 text-right text-gray-600">{venue.total_revenue.toLocaleString()}</td>
                                            <td className="py-4 px-6 text-center">
                                                {
                                                    <Button
                                                        size="sm"
                                                        variant={expandedVenues.has(venue.venue_id) ? "outline" : "default"}
                                                        onClick={() => toggleVenue(venue.venue_id)}
                                                        className="w-24"
                                                    >
                                                        {expandedVenues.has(venue.venue_id) ? "Thu gọn" : "Xem thêm"}
                                                    </Button>
                                                }
                                            </td>
                                        </tr>
                                        {expandedVenues.has(venue.venue_id) &&
                                            venue.fields.map((field) => (
                                                <React.Fragment key={field.field_id}>
                                                    <tr className="border-b bg-blue-50/50">
                                                        <td className="py-3 px-6 pl-10 font-medium text-gray-700 relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 border-l-2 border-b-2 border-gray-300"></span>
                                                            {field.field_name}
                                                        </td>
                                                        <td className="py-3 px-6 text-center text-gray-600">{field.courts.length}</td>
                                                        <td className="py-3 px-6 text-right text-gray-600">{field.total_revenue.toLocaleString()}</td>
                                                        <td className="py-3 px-6 text-center">
                                                            {
                                                                field.total_revenue > 0 && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant={expandedFields.has(field.field_id) ? "outline" : "default"}
                                                                        onClick={() => toggleField(field.field_id)}
                                                                        className="w-20"
                                                                    >
                                                                        {expandedFields.has(field.field_id) ? "Thu gọn" : "Xem"}
                                                                    </Button>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                    {expandedFields.has(field.field_id) &&
                                                        field.courts.map((court) => (
                                                            <tr key={court.court_id} className="border-b bg-blue-100/50">
                                                                <td className="py-3 px-6 pl-14 text-gray-600 relative">
                                                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 h-3 w-3 border-l-2 border-b-2 border-gray-400"></span>
                                                                    {court.court_name}
                                                                </td>
                                                                <td className="py-3 px-6 text-center text-gray-600">-</td>
                                                                <td className="py-3 px-6 text-right text-gray-600">{court.total_revenue.toLocaleString()}</td>
                                                                <td className="py-3 px-6 text-center text-gray-600">-</td>
                                                            </tr>
                                                        ))}
                                                </React.Fragment>
                                            ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="w-10"
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}