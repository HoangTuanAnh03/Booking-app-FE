export interface Venue {
    venue_id: string;
    // owner_id: string;
    name: string;
    address?: string;
    status?: string;
    bank_account_number: string;
    bank_name:string;
    phone_number: string;
    longitude:string,
    latitude: string,
};
export interface VenueImg {
    image_id: string,
    venue_id: string,
    image_url: string,
    type: string,
    markedForDeletion?: boolean;
};

export interface VenuePayment {
    original: OriginalPayment
}

interface OriginalPayment {
    checkoutUrl: string;
    orderCode: string;
}

export interface VenueCard {
    venue_id: string;
    name: string;
    address: string;
    thumbnail: string;
    cover: string;
    status: string;
    payment_status: boolean;
}