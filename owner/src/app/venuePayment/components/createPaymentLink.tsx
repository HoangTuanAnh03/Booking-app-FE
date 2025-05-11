'use client'

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {useMakePaymentURL} from "@/queries/useVenue";


interface Props {
    venueId: string
}

export default function CreatingPaymentLink({ venueId }: Props) {
    const [currentUrl, setCurrentUrl] = useState("")

    useEffect(() => {
        setCurrentUrl(`${window.location.origin}/venue`)
    }, [])
    const { data, isLoading, error } = useMakePaymentURL(venueId, currentUrl)

    const handlePayment = () => {
        const checkoutUrl = data?.original?.checkoutUrl
        if (checkoutUrl) {
            window.location.href = checkoutUrl
        }
    }
    return (
        <div className="flex flex-col items-center justify-center py-10">
            {isLoading ? (
                <>
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3"/>
                    <p className="text-muted-foreground text-sm">Đang tạo link thanh toán...</p>
                </>
            ) : error ? (
                <p className="text-red-500 text-sm">Có lỗi xảy ra: {error.message}</p>
            ) : !data?.original?.checkoutUrl ? (
                <p className="text-red-500 text-sm">Không thể tạo link thanh toán. Vui lòng thử lại.</p>
            ) : (
                <Button onClick={handlePayment}>Tiếp tục thanh toán</Button>
            )}
        </div>
    )
}