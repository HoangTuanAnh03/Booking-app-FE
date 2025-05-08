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
