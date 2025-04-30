type VenueMap = {
  venue_id: string;
  venue_name: string;
  latitude: string;
  longitude: string;
  address: string;
  sport_types: SportType[];
};

type Venue = {
  venue_id: string;
  venue_name: string;
  venue_address: string;
  phone_number: string;
  image_cover: string;
  thumbnail: string;
  opening: string;
  closing: string;
};

type CoordinateVenue = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  type: SportTypeEnum;
};

type SportType = {
  id: number;
  name: string;
};

enum SportTypeEnum {
  BADMINTON = "badminton",
  TENNIS = "tennis",
  TABLE_TENNIS = "table_tennis",
  SQUASH = "squash",
  PICKLEBALL = "pickleball",
  BASKETBALL = "basketball",
  VOLLEYBALL = "volleyball",
  FOOTBALL = "football",
  HOCKEY = "hockey",
  ICE_HOCKEY = "ice_hockey",
}
