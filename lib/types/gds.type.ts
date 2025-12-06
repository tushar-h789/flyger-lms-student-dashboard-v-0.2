export interface FareDetail {
  class: string; // Booking class (e.g., "Y", "N", "B")
  baseFareUSD: number;
  baseFareBDT: number;
  fareBasis: string; // e.g., "N15BDOA"
  nvb: string; // Not Valid Before date
  nva: string; // Not Valid After date
  baggage: string; // e.g., "25K"
  taxes: {
    BD: number; // Airport tax
    UT: number; // Utility tax
    XT: number; // Other taxes
    W?: number; // Fuel surcharge
    E5?: number; // Security tax
    YR?: number; // Passenger service charge
    P8?: number; // Additional tax
    P7?: number; // Additional tax
  };
  totalBDT: number;
  nuc: number; // Neutral Unit of Construction
  roe: number; // Rate of Exchange
  rateUsed: string; // e.g., "1USD-122.48BDT"
  validatingCarrier: string;
  brandedFare?: string; // e.g., "ECONOMY VALUE-YCLVALUE"
  changeFee: boolean;
  refundFee: boolean;
  noShowFee: boolean;
  paymentFees?: Array<{
    description: string;
    fee: number;
    total: number;
  }>;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  date: string; // Format: "20JUN" (DDMON)
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  class: string;
  seats: number;
  fare: number;
  operates: string;
  onTime: string;
  airMiles: number;
  meals?: string;
  equipment?: string;
  terminal?: string;
  connectivity?: string;
  fareDetails?: FareDetail[]; // Fare details for each class
  transit?: {
    city: string;
    arrivalTime: string;
    departureTime: string;
    layoverDuration: string;
  };
}

export interface BookingDetails {
  pnr: string;
  passengers: Passenger[];
  flights: Flight[];
  totalFare: number;
  status: string;
  bookingDate: string;
}

export interface Passenger {
  title: string;
  firstName: string;
  lastName: string;
  type: "ADT" | "CHD" | "INF";
  dateOfBirth?: string;
}

export interface CommandResult {
  type:
    | "availability"
    | "booking"
    | "fare"
    | "pnr"
    | "error"
    | "wpa"
    | "wpncb"
    | "name_insert"
    | "agency_details"
    | "ticketing"
    | "received"
    | "passenger_mobile_number"
    | "passenger_email_address"
    | "docs_insert"
    | "price_save_or_restored"
    | "price_check"
    | "printer_designate"
    | "printer_designate_confirm"
    | "dsiv"
    | "ptr_assigned"
    | "invoice"
    | "ticket_details";
  data: any;
  rawCommand: string;
  timestamp: Date;
}

export type CommandType =
  | "AVAILABILITY_CHECK"
  | "SEAT_SELL"
  | "CLEAR_SEGMENTS"
  | "CLASS_CHANGE"
  | "DATE_CHANGE"
  | "FARE_CHECK"
  | "WPA"
  | "WPNCB"
  | "NAME_INSERT"
  | "AGENCY_DETAILS"
  | "TICKETING"
  | "RECEIVED"
  | "END_RETRIEVE"
  | "IGNORE_RETRIEVE"
  | "PASSENGER_MOBILE_NUMBER"
  | "PASSENGER_EMAIL_ADDRESS"
  | "DOCS_INSERT"
  | "PRICE_SAVE_OR_RESTORED"
  | "PRICE_CHECK"
  | "PRINTER_DESIGNATE"
  | "PRINTER_DESIGNATE_CONFIRM"
  | "DSIV"
  | "PTR_ASSIGNED"
  | "INVOICE"
  | "TICKET_DETAILS";
export interface Command {
  type: CommandType;
  title: string;
  format: string;
  example: string;
  description: string;
}
