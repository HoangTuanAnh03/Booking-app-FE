'use client'

import {useGetCourtTimeByFieldId} from "@/queries/useCourt";
import React, {useEffect, useState} from "react";
import {CourtMap, TimeLineEl, TimeSlot} from "@/types/court";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface BookingProps {
    fieldId: string;
    date: string;
    onSelectionChange?: (data: {
        selectedTimeslots: Map<string, { start_time: string; end_time: string }[]>,
        totalPrice: number
    }) => void;

}

type SelectedTimeslots = Map<string, { start_time: string; end_time: string }[]>;

export const Booking = ({fieldId, date, onSelectionChange, resetSignal}: BookingProps & { resetSignal: number }) => {
    const {data, error, isError, isLoading} = useGetCourtTimeByFieldId(fieldId, date);
    const [baseTimeLine, setBaseTimeLine] = useState<TimeLineEl[]>([]);
    const [courts, setCourts] = useState<CourtMap>({});
    const [selectedTimeslots, setSelectedTimeslots] = useState<SelectedTimeslots>(new Map());
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [errorApi, setErrorApi] = useState<boolean>(false);
    useEffect(() => {
        if(data?.status != 200){
            setErrorApi(true)
        }
        if (data?.payload.data) {
            setBaseTimeLine(data?.payload.data.base_time_line)
            setCourts(data?.payload.data.courts)
            setErrorApi(false)
        }
    }, [data]);

    useEffect(() => {
        setSelectedTimeslots(new Map());
        setTotalPrice(0);
        if (onSelectionChange) {
            onSelectionChange({ selectedTimeslots: new Map(), totalPrice: 0 });
        }
        
    }, [resetSignal]);

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (isError || errorApi) {
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded">
                {`Sân chưa hoạt động vui lòng chọn sân khác`}
            </div>
        );
    }
    const handleCellClick = (courtId: string, timeSlot: TimeSlot): void => {
        const updatedSelectedTimeslots = new Map(selectedTimeslots);
        const selectedData = {start_time: timeSlot.start_time, end_time: timeSlot.end_time};
        const existingTimeslots = updatedSelectedTimeslots.get(courtId) || [];
        const isSelected = existingTimeslots.some(slot => slot.start_time === timeSlot.start_time && slot.end_time === timeSlot.end_time);

        let newPrice = totalPrice;
        if (isSelected) {
            updatedSelectedTimeslots.set(
                courtId,
                existingTimeslots.filter(slot => !(slot.start_time === timeSlot.start_time && slot.end_time === timeSlot.end_time))
            );
            newPrice -= timeSlot.price;
        } else {
            updatedSelectedTimeslots.set(courtId, [...existingTimeslots, selectedData]);
            newPrice += timeSlot.price;
        }

        setSelectedTimeslots(updatedSelectedTimeslots);
        setTotalPrice(newPrice);

        if (onSelectionChange) {
            onSelectionChange({
                selectedTimeslots: updatedSelectedTimeslots,
                totalPrice: newPrice
            });
        }
    };
    

    return (

        <div className="m-4">
            <Table className="border-separate border-spacing-0 text-center whitespace-nowrap w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0  bg-white border-l border-r border-t border-b border-gray-600 px-4 py-2 text-center">
                            Tên sân
                        </TableHead>
                        {baseTimeLine.map((item, idx) => (
                            <TableHead
                                key={idx}
                                className="border border-gray-600 px-4 py-2 text-center"
                            >
                                {item.time}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(courts).map(([courtId, court]) => (
                        <TableRow key={courtId}>
                            <TableCell className="sticky left-0 bg-white border-l border-r border-t border-b border-gray-600 px-4 py-2 text-center">
                                {court.name}
                            </TableCell>
                            {court.time_slots.map((timeSlot, index) => {
                                const isSelected = selectedTimeslots.get(courtId)?.some(
                                    slot =>
                                        slot.start_time === timeSlot.start_time &&
                                        slot.end_time === timeSlot.end_time
                                );
                                const isLocked = timeSlot.status === "locked";

                                return (
                                    <TableCell
                                        key={index}
                                        onClick={() => !isLocked && handleCellClick(courtId, timeSlot)}
                                        colSpan={timeSlot.colspan}
                                        className={`border border-gray-600 px-4 py-2 text-center ${
                                            isSelected ? "bg-blue-200" : ""
                                        } ${isLocked ? "bg-red-200" : ""}`}
                                    ></TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    )
}