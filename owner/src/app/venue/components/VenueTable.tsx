'use client';
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {VenueCard} from "@/types/venue";
import {useRouter} from "next/navigation";

interface VenueTableProps {
    venues: VenueCard[];
}

export default function VenueTable({ venues }: VenueTableProps) {
    const pageSize = 5;
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [page, setPage] = useState(1);
    const router = useRouter();
    const filteredVenues = venues.filter((venue) => {
        const matchesSearch =
            venue.name.toLowerCase().includes(search.toLowerCase()) ||
            venue.address.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter !== "all" ? venue.status === statusFilter : true;
        const matchesPayment =
            paymentFilter !== "all"
                ? paymentFilter === "paid"
                    ? venue.payment_status
                    : !venue.payment_status
                : true;

        return matchesSearch && matchesStatus && matchesPayment;
    });

    const totalPages = Math.ceil(filteredVenues.length / pageSize);

    const paginatedVenues = filteredVenues.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    function handleFilterChange(
        filterSetter: React.Dispatch<React.SetStateAction<string>>,
        value: string
    ) {
        filterSetter(value);
        setPage(1);
    }

    return (
        <Card className="p-6 shadow-lg space-y-6 bg-white rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Input
                    placeholder="Tìm theo tên hoặc địa chỉ..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="md:w-1/3"
                    type="search"
                    aria-label="Search venues by name or address"
                />
                <Select
                    onValueChange={(value) => handleFilterChange(setStatusFilter, value)}
                    value={statusFilter}
                >
                    <SelectTrigger className="md:w-48 rounded-md border border-gray-300 hover:border-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-400">
                        <SelectValue>
                            {statusFilter === "all"
                                ? "Trạng thái sân"
                                : statusFilter === "active"
                                    ? "Hoạt động"
                                    : "Bị khóa"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Trạng thái sân</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="locked">Bị khóa</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={(value) => handleFilterChange(setPaymentFilter, value)}
                    value={paymentFilter}
                >
                    <SelectTrigger className="md:w-48 rounded-md border border-gray-300 hover:border-gray-400 shadow-sm focus:ring-2 focus:ring-indigo-400">
                        <SelectValue>
                            {paymentFilter === "all"
                                ? "Trạng thái thanh toán"
                                : paymentFilter === "paid"
                                    ? "Đã thanh toán"
                                    : "Chưa thanh toán"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Trạng thái thanh toán</SelectItem>
                        <SelectItem value="paid">Đã thanh toán</SelectItem>
                        <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <CardContent className="overflow-x-auto">
                <Table className="min-w-full border-collapse border border-gray-200">
                    <TableHeader>
                        <TableRow className="bg-indigo-50">
                            <TableHead className="text-left px-4 py-2 border border-gray-200">
                                Thumbnail
                            </TableHead>
                            <TableHead className="text-left px-4 py-2 border border-gray-200">
                                Tên sân
                            </TableHead>
                            <TableHead className="text-left px-4 py-2 border border-gray-200">
                                Địa chỉ
                            </TableHead>
                            <TableHead className="text-left px-4 py-2 border border-gray-200">
                                Trạng thái
                            </TableHead>
                            <TableHead className="text-left px-4 py-2 border border-gray-200">
                                Thanh toán
                            </TableHead>
                            <TableHead className="text-left px-4 py-2 border border-gray-200">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedVenues.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500 italic"
                                >
                                    Không có kết quả phù hợp
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedVenues.map((venue, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-indigo-50 transition-colors duration-150"
                                >
                                    <TableCell className="border border-gray-200 p-2 flex items-center justify-center">
                                        {venue.cover ? (
                                            <Image
                                                loader={() => venue.cover}
                                                src={venue.cover}
                                                alt={venue.name}
                                                width={60}
                                                height={30}
                                                className="rounded-md object-cover border border-gray-300 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-[80px] h-[50px] bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400 border border-gray-300">
                                                No image
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-semibold border border-gray-200 p-2">
                                        {venue.name}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 p-2">
                                        {venue.address}
                                    </TableCell>
                                    <TableCell className="border border-gray-200 p-2">
                                        <Badge
                                            variant={
                                                venue.status === "active" ? "default" : "destructive"
                                            }
                                            className={
                                                venue.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }
                                        >
                                            {venue.status === "active" ? "Hoạt động" : "Bị khóa"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="border border-gray-200 p-2">
                                        <Badge
                                            variant={venue.payment_status ? "default" : "outline"}
                                            className={
                                                venue.payment_status
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-500 border-gray-400"
                                            }
                                        >
                                            {venue.payment_status ? "Đã thanh toán" : "Chưa thanh toán"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="border border-gray-200 p-2 space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-indigo-100 transition"
                                            onClick={() => router.push(`/venue?venueId=${venue.venue_id}`)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                        {!venue.payment_status && venue.status === "active" && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white transition"
                                                onClick={() => router.push(`/venuePayment?venueId=${venue.venue_id}`)}
                                            >
                                                Thanh toán
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
                <div>
                    Tổng: {filteredVenues.length} kết quả | Trang {page} / {totalPages || 1}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Trang trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            </div>
        </Card>
    );
}