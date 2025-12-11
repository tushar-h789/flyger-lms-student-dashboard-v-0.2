"use client";

import { useEffect, useState } from "react";
import { Flight } from "@/lib/types/gds.type";

// Helper function to get day of week from date string (e.g., "20JUN" -> "MON")
function getDayOfWeek(dateStr: string): string {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  try {
    // Parse date string like "20JUN" or "15JUN"
    const day = parseInt(dateStr.substring(0, 2), 10);
    const monthStr = dateStr.substring(2, 5);
    const months: { [key: string]: number } = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };
    const month = months[monthStr];
    if (month === undefined) return "";

    // Use current year or next year if date has passed
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, month, day);

    // If date is in the past, use next year
    if (date < new Date()) {
      date.setFullYear(currentYear + 1);
    }

    return days[date.getDay()];
  } catch {
    return "";
  }
}

// Helper function to format flight number (remove airline prefix if present)
function formatFlightNumber(flightNumber: string, airline: string): string {
  // Remove airline code from flight number if it starts with it
  // e.g., "SQ 447" -> "447", "TG 322" -> "322"
  const airlineUpper = airline.toUpperCase().trim();
  const flightUpper = flightNumber.toUpperCase().trim();

  // Check if flight number starts with airline code
  if (flightUpper.startsWith(airlineUpper)) {
    return flightUpper.substring(airlineUpper.length).trim();
  }

  // Remove spaces and return
  return flightUpper.replace(/\s+/g, "");
}

interface Booking {
  numberOfPassengers: number;
  rbd: string;
  serialNumber: string;
  flight: Flight;
  command: string;
}

interface BookingDisplayProps {
  currentBooking?: Booking;
  version?: number;
}

interface PassengerName {
  lastName: string;
  firstName: string;
  title: string;
  formattedName: string;
}

interface AgencyDetails {
  agencyName: string;
  agencyPhone: string;
  reservationOfficerName: string;
  formatted: string;
}

interface Ticketing {
  formatted: string;
}

interface Received {
  formatted: string;
  officer: string;
}

interface MobileNumber {
  formatted: string;
  number: string;
}

interface EmailAddress {
  formatted: string;
  email: string;
}

interface DocsInsert {
  formatted: string;
  passportType: string;
  countryCode: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  passportExpiry: string;
  lastName: string;
  firstName: string;
}

export function BookingDisplay({
  currentBooking,
  version = 0,
}: BookingDisplayProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [passengerName, setPassengerName] = useState<PassengerName | null>(
    null
  );
  const [agencyDetails, setAgencyDetails] = useState<AgencyDetails | null>(
    null
  );
  const [ticketing, setTicketing] = useState<Ticketing | null>(null);
  const [received, setReceived] = useState<Received | null>(null);
  const [mobileNumber, setMobileNumber] = useState<MobileNumber | null>(null);
  const [emailAddress, setEmailAddress] = useState<EmailAddress | null>(null);
  const [docs, setDocs] = useState<DocsInsert | null>(null);
  const [printerDesignateConfirm, setPrinterDesignateConfirm] = useState<
    string | null
  >(null);
  const [fareDetail, setFareDetail] = useState<any | null>(null);
  const [dsivPtrAssigned, setDsivPtrAssigned] = useState<string | null>(null);
  const [ptrAssigned, setPtrAssigned] = useState<string | null>(null);

  useEffect(() => {
    // Load bookings from local storage
    const storedBookings = JSON.parse(
      localStorage.getItem("gds_bookings") || "[]"
    );
    setBookings(storedBookings);

    // Load passenger name from local storage
    const storedName = localStorage.getItem("gds_passenger_name");
    if (storedName) {
      try {
        setPassengerName(JSON.parse(storedName));
      } catch (e) {
        console.error("Error parsing passenger name:", e);
      }
    }

    // Load agency details
    const storedAgency = localStorage.getItem("gds_agency_details");
    if (storedAgency) {
      try {
        setAgencyDetails(JSON.parse(storedAgency));
      } catch (e) {
        console.error("Error parsing agency details:", e);
      }
    }

    // Load ticketing
    const storedTicket = localStorage.getItem("gds_ticketing");
    if (storedTicket) {
      try {
        setTicketing(JSON.parse(storedTicket));
      } catch (e) {
        console.error("Error parsing ticketing:", e);
      }
    }

    // Load received
    const storedReceived = localStorage.getItem("gds_received");
    if (storedReceived) {
      try {
        setReceived(JSON.parse(storedReceived));
      } catch (e) {
        console.error("Error parsing received:", e);
      }
    }

    // Load mobile number
    const storedMobile = localStorage.getItem("gds_passenger_mobile");
    if (storedMobile) {
      try {
        setMobileNumber(JSON.parse(storedMobile));
      } catch (e) {
        console.error("Error parsing mobile number:", e);
      }
    }

    // Load email address
    const storedEmail = localStorage.getItem("gds_passenger_email");
    if (storedEmail) {
      try {
        setEmailAddress(JSON.parse(storedEmail));
      } catch (e) {
        console.error("Error parsing email address:", e);
      }
    }

    // Load docs
    const storedDocs = localStorage.getItem("gds_docs");
    if (storedDocs) {
      try {
        setDocs(JSON.parse(storedDocs));
      } catch (e) {
        console.error("Error parsing docs:", e);
      }
    }

    // Load printer designate confirm
    const storedPrinterConfirm = localStorage.getItem(
      "gds_printer_designate_confirm"
    );
    if (storedPrinterConfirm) {
      setPrinterDesignateConfirm(storedPrinterConfirm);
    } else {
      setPrinterDesignateConfirm(null);
    }

    // Load fare detail
    const storedFareDetail = localStorage.getItem("gds_fare_detail");
    if (storedFareDetail) {
      try {
        setFareDetail(JSON.parse(storedFareDetail));
      } catch (e) {
        console.error("Error parsing fare detail:", e);
        setFareDetail(null);
      }
    } else {
      setFareDetail(null);
    }

    // Load DSIV PTR assigned
    const storedDsivPtr = localStorage.getItem("gds_dsiv_ptr");
    if (storedDsivPtr) {
      setDsivPtrAssigned(storedDsivPtr);
    } else {
      setDsivPtrAssigned(null);
    }

    // Load PTR assigned
    const storedPtrAssigned = localStorage.getItem("gds_ptr_assigned");
    if (storedPtrAssigned) {
      setPtrAssigned(storedPtrAssigned);
    } else {
      setPtrAssigned(null);
    }

    // Listen for storage changes (in case of multiple tabs)
    const handleStorageChange = () => {
      const updatedBookings = JSON.parse(
        localStorage.getItem("gds_bookings") || "[]"
      );
      setBookings(updatedBookings);

      const updatedName = localStorage.getItem("gds_passenger_name");
      if (updatedName) {
        try {
          setPassengerName(JSON.parse(updatedName));
        } catch (e) {
          console.error("Error parsing passenger name:", e);
        }
      } else {
        setPassengerName(null);
      }

      const updatedAgency = localStorage.getItem("gds_agency_details");
      if (updatedAgency) {
        try {
          setAgencyDetails(JSON.parse(updatedAgency));
        } catch (e) {
          console.error("Error parsing agency details:", e);
        }
      } else {
        setAgencyDetails(null);
      }

      const updatedTicket = localStorage.getItem("gds_ticketing");
      if (updatedTicket) {
        try {
          setTicketing(JSON.parse(updatedTicket));
        } catch (e) {
          console.error("Error parsing ticketing:", e);
        }
      } else {
        setTicketing(null);
      }

      const updatedReceived = localStorage.getItem("gds_received");
      if (updatedReceived) {
        try {
          setReceived(JSON.parse(updatedReceived));
        } catch (e) {
          console.error("Error parsing received:", e);
        }
      } else {
        setReceived(null);
      }

      const updatedMobile = localStorage.getItem("gds_passenger_mobile");
      if (updatedMobile) {
        try {
          setMobileNumber(JSON.parse(updatedMobile));
        } catch (e) {
          console.error("Error parsing mobile number:", e);
        }
      } else {
        setMobileNumber(null);
      }

      const updatedEmail = localStorage.getItem("gds_passenger_email");
      if (updatedEmail) {
        try {
          setEmailAddress(JSON.parse(updatedEmail));
        } catch (e) {
          console.error("Error parsing email address:", e);
        }
      } else {
        setEmailAddress(null);
      }

      const updatedDocs = localStorage.getItem("gds_docs");
      if (updatedDocs) {
        try {
          setDocs(JSON.parse(updatedDocs));
        } catch (e) {
          console.error("Error parsing docs:", e);
        }
      } else {
        setDocs(null);
      }

      // Update printer designate confirm
      const updatedPrinterConfirm = localStorage.getItem(
        "gds_printer_designate_confirm"
      );
      if (updatedPrinterConfirm) {
        setPrinterDesignateConfirm(updatedPrinterConfirm);
      } else {
        setPrinterDesignateConfirm(null);
      }

      // Update fare detail
      const updatedFareDetail = localStorage.getItem("gds_fare_detail");
      if (updatedFareDetail) {
        try {
          setFareDetail(JSON.parse(updatedFareDetail));
        } catch (e) {
          console.error("Error parsing fare detail:", e);
          setFareDetail(null);
        }
      } else {
        setFareDetail(null);
      }

      // Update DSIV PTR assigned
      const updatedDsivPtr = localStorage.getItem("gds_dsiv_ptr");
      if (updatedDsivPtr) {
        setDsivPtrAssigned(updatedDsivPtr);
      } else {
        setDsivPtrAssigned(null);
      }

      // Update PTR assigned
      const updatedPtrAssigned = localStorage.getItem("gds_ptr_assigned");
      if (updatedPtrAssigned) {
        setPtrAssigned(updatedPtrAssigned);
      } else {
        setPtrAssigned(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update bookings when currentBooking changes (new booking added)
  useEffect(() => {
    const storedBookings = JSON.parse(
      localStorage.getItem("gds_bookings") || "[]"
    );
    setBookings(storedBookings);

    // Also update passenger name
    const storedName = localStorage.getItem("gds_passenger_name");
    if (storedName) {
      try {
        setPassengerName(JSON.parse(storedName));
      } catch (e) {
        console.error("Error parsing passenger name:", e);
      }
    }

    // Also update agency details
    const storedAgency2 = localStorage.getItem("gds_agency_details");
    if (storedAgency2) {
      try {
        setAgencyDetails(JSON.parse(storedAgency2));
      } catch (e) {
        console.error("Error parsing agency details:", e);
      }
    }

    // Also update ticketing
    const storedTicket2 = localStorage.getItem("gds_ticketing");
    if (storedTicket2) {
      try {
        setTicketing(JSON.parse(storedTicket2));
      } catch (e) {
        console.error("Error parsing ticketing:", e);
      }
    }

    // Also update received
    const storedReceived2 = localStorage.getItem("gds_received");
    if (storedReceived2) {
      try {
        setReceived(JSON.parse(storedReceived2));
      } catch (e) {
        console.error("Error parsing received:", e);
      }
    }

    // Also update mobile number
    const storedMobile2 = localStorage.getItem("gds_passenger_mobile");
    if (storedMobile2) {
      try {
        setMobileNumber(JSON.parse(storedMobile2));
      } catch (e) {
        console.error("Error parsing mobile number:", e);
      }
    }

    // Also update email address
    const storedEmail2 = localStorage.getItem("gds_passenger_email");
    if (storedEmail2) {
      try {
        setEmailAddress(JSON.parse(storedEmail2));
      } catch (e) {
        console.error("Error parsing email address:", e);
      }
    }

    // Also update docs
    const storedDocs2 = localStorage.getItem("gds_docs");
    if (storedDocs2) {
      try {
        setDocs(JSON.parse(storedDocs2));
      } catch (e) {
        console.error("Error parsing docs:", e);
      }
    }

    // Also update printer designate confirm
    const storedPrinterConfirm2 = localStorage.getItem(
      "gds_printer_designate_confirm"
    );
    if (storedPrinterConfirm2) {
      setPrinterDesignateConfirm(storedPrinterConfirm2);
    } else {
      setPrinterDesignateConfirm(null);
    }

    // Also update fare detail
    const storedFareDetail2 = localStorage.getItem("gds_fare_detail");
    if (storedFareDetail2) {
      try {
        setFareDetail(JSON.parse(storedFareDetail2));
      } catch (e) {
        console.error("Error parsing fare detail:", e);
        setFareDetail(null);
      }
    } else {
      setFareDetail(null);
    }

    // Also update DSIV PTR assigned
    const storedDsivPtr2 = localStorage.getItem("gds_dsiv_ptr");
    if (storedDsivPtr2) {
      setDsivPtrAssigned(storedDsivPtr2);
    } else {
      setDsivPtrAssigned(null);
    }

    // Also update PTR assigned
    const storedPtrAssigned2 = localStorage.getItem("gds_ptr_assigned");
    if (storedPtrAssigned2) {
      setPtrAssigned(storedPtrAssigned2);
    } else {
      setPtrAssigned(null);
    }
  }, [currentBooking]);

  // Refresh from localStorage when version changes (forced re-sync)
  useEffect(() => {
    const storedName = localStorage.getItem("gds_passenger_name");
    if (storedName) {
      try {
        setPassengerName(JSON.parse(storedName));
      } catch {}
    }

    const storedAgency = localStorage.getItem("gds_agency_details");
    if (storedAgency) {
      try {
        setAgencyDetails(JSON.parse(storedAgency));
      } catch {}
    }

    const storedTicket = localStorage.getItem("gds_ticketing");
    if (storedTicket) {
      try {
        setTicketing(JSON.parse(storedTicket));
      } catch {}
    }

    const storedReceived = localStorage.getItem("gds_received");
    if (storedReceived) {
      try {
        setReceived(JSON.parse(storedReceived));
      } catch {}
    }

    const storedMobile = localStorage.getItem("gds_passenger_mobile");
    if (storedMobile) {
      try {
        setMobileNumber(JSON.parse(storedMobile));
      } catch {}
    }

    const storedEmail = localStorage.getItem("gds_passenger_email");
    if (storedEmail) {
      try {
        setEmailAddress(JSON.parse(storedEmail));
      } catch {}
    }

    const storedDocs = localStorage.getItem("gds_docs");
    if (storedDocs) {
      try {
        setDocs(JSON.parse(storedDocs));
      } catch {}
    }

    const storedPrinterConfirm = localStorage.getItem(
      "gds_printer_designate_confirm"
    );
    if (storedPrinterConfirm) {
      setPrinterDesignateConfirm(storedPrinterConfirm);
    } else {
      setPrinterDesignateConfirm(null);
    }

    const storedFareDetail = localStorage.getItem("gds_fare_detail");
    if (storedFareDetail) {
      try {
        setFareDetail(JSON.parse(storedFareDetail));
      } catch (e) {
        setFareDetail(null);
      }
    } else {
      setFareDetail(null);
    }

    const storedDsivPtr = localStorage.getItem("gds_dsiv_ptr");
    if (storedDsivPtr) {
      setDsivPtrAssigned(storedDsivPtr);
    } else {
      setDsivPtrAssigned(null);
    }

    const storedPtrAssigned = localStorage.getItem("gds_ptr_assigned");
    if (storedPtrAssigned) {
      setPtrAssigned(storedPtrAssigned);
    } else {
      setPtrAssigned(null);
    }
  }, [version]);

  // Also listen for custom events to update when bookings change
  useEffect(() => {
    const handleBookingUpdate = () => {
      const storedBookings = JSON.parse(
        localStorage.getItem("gds_bookings") || "[]"
      );
      setBookings(storedBookings);

      // Also update passenger name
      const storedName = localStorage.getItem("gds_passenger_name");
      if (storedName) {
        try {
          setPassengerName(JSON.parse(storedName));
        } catch (e) {
          console.error("Error parsing passenger name:", e);
        }
      } else {
        setPassengerName(null);
      }

      // Also update agency details
      const storedAgency = localStorage.getItem("gds_agency_details");
      if (storedAgency) {
        try {
          setAgencyDetails(JSON.parse(storedAgency));
        } catch (e) {
          console.error("Error parsing agency details:", e);
        }
      } else {
        setAgencyDetails(null);
      }

      // Also update ticketing
      const storedTicket = localStorage.getItem("gds_ticketing");
      if (storedTicket) {
        try {
          setTicketing(JSON.parse(storedTicket));
        } catch (e) {
          console.error("Error parsing ticketing:", e);
        }
      } else {
        setTicketing(null);
      }

      // Also update mobile number
      const storedMobile = localStorage.getItem("gds_passenger_mobile");
      if (storedMobile) {
        try {
          setMobileNumber(JSON.parse(storedMobile));
        } catch (e) {
          console.error("Error parsing mobile number:", e);
        }
      } else {
        setMobileNumber(null);
      }

      // Also update email address
      const storedEmail = localStorage.getItem("gds_passenger_email");
      if (storedEmail) {
        try {
          setEmailAddress(JSON.parse(storedEmail));
        } catch (e) {
          console.error("Error parsing email address:", e);
        }
      } else {
        setEmailAddress(null);
      }

      // Also update docs
      const storedDocs = localStorage.getItem("gds_docs");
      if (storedDocs) {
        try {
          setDocs(JSON.parse(storedDocs));
        } catch (e) {
          console.error("Error parsing docs:", e);
        }
      } else {
        setDocs(null);
      }

      // Also update printer designate confirm
      const storedPrinterConfirm = localStorage.getItem(
        "gds_printer_designate_confirm"
      );
      if (storedPrinterConfirm) {
        setPrinterDesignateConfirm(storedPrinterConfirm);
      } else {
        setPrinterDesignateConfirm(null);
      }

      // Also update fare detail
      const storedFareDetail = localStorage.getItem("gds_fare_detail");
      if (storedFareDetail) {
        try {
          setFareDetail(JSON.parse(storedFareDetail));
        } catch (e) {
          console.error("Error parsing fare detail:", e);
          setFareDetail(null);
        }
      } else {
        setFareDetail(null);
      }

      // Also update DSIV PTR assigned
      const storedDsivPtr = localStorage.getItem("gds_dsiv_ptr");
      if (storedDsivPtr) {
        setDsivPtrAssigned(storedDsivPtr);
      } else {
        setDsivPtrAssigned(null);
      }

      // Also update PTR assigned
      const storedPtrAssigned = localStorage.getItem("gds_ptr_assigned");
      if (storedPtrAssigned) {
        setPtrAssigned(storedPtrAssigned);
      } else {
        setPtrAssigned(null);
      }
    };

    // Listen for custom booking update event
    window.addEventListener("gds_booking_updated", handleBookingUpdate);
    return () =>
      window.removeEventListener("gds_booking_updated", handleBookingUpdate);
  }, []);

  if (bookings.length === 0 && !currentBooking) {
    return null;
  }

  // Combine stored bookings with current booking if it exists
  // Check if currentBooking is already in bookings (to avoid duplicates)
  const currentBookingExists = currentBooking
    ? bookings.some(
        (b) =>
          b.serialNumber === currentBooking.serialNumber &&
          b.rbd === currentBooking.rbd &&
          b.command === currentBooking.command
      )
    : false;

  const allBookings =
    currentBooking && !currentBookingExists
      ? [...bookings, currentBooking]
      : bookings;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg mb-4">
      {/* BOOKING STATUS Header */}
      <div className="bg-slate-900 p-3 border-b border-slate-700">
        <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
          BOOKING STATUS: SEGMENTS ADDED TO PNR
        </div>
      </div>

      {/* Booking Rows */}
      <div className="divide-y divide-slate-700">
        {allBookings.map((booking, index) => (
          <BookingRow
            key={`${booking.serialNumber}-${booking.rbd}-${index}-${booking.command}`}
            booking={booking}
            index={index + 1}
            showCommand={false}
            passengerName={passengerName}
            agencyDetails={agencyDetails}
            ticketing={ticketing}
            received={received}
            mobileNumber={mobileNumber}
            emailAddress={emailAddress}
            docs={docs}
          />
        ))}
      </div>

      {/* Price Display - Show total price from fareDetail */}
      {fareDetail && fareDetail.totalBDT && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-3">
          <div className="text-slate-100 font-mono text-sm sm:text-base">
            TOTAL: BDT {fareDetail.totalBDT.toLocaleString()}
          </div>
        </div>
      )}

      {/* Printer Designate Confirm Display */}
      {printerDesignateConfirm && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-3">
          <div className="text-slate-100 font-mono text-sm sm:text-base">
            {printerDesignateConfirm}
          </div>
        </div>
      )}

      {/* DSIV PTR Assigned Display */}
      {dsivPtrAssigned && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-3">
          <div className="text-slate-100 font-mono text-sm sm:text-base">
            OK PTR ASSIGNED
          </div>
        </div>
      )}

      {/* PTR Assigned Display */}
      {ptrAssigned && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-3">
          <div className="text-slate-100 font-mono text-sm sm:text-base space-y-1">
            {/* First line: PTR/6B8893 « */}
            <div className="text-green-400">PTR/{ptrAssigned} «</div>
            {/* Dotted separator line */}
            <div className="border-b border-dotted border-slate-600"></div>
            {/* Second line: PRINTER DESIGNATED */}
            <div className="text-slate-200">PRINTER DESIGNATED</div>
          </div>
        </div>
      )}

      {/* Command Row at Bottom - Show the command that was just entered */}
      {currentBooking && (
        <div className="border-t border-slate-700 bg-slate-900/50 p-3">
          <div className="text-green-400 font-mono text-xs sm:text-sm">
            Command:{" "}
            <span className="text-slate-100 font-bold">
              {currentBooking.command}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface BookingRowProps {
  booking: Booking;
  index: number;
  showCommand?: boolean;
  passengerName?: PassengerName | null;
  agencyDetails?: AgencyDetails | null;
  ticketing?: Ticketing | null;
  received?: Received | null;
  mobileNumber?: MobileNumber | null;
  emailAddress?: EmailAddress | null;
  docs?: DocsInsert | null;
}

function BookingRow({
  booking,
  index,
  showCommand = false,
  passengerName,
  agencyDetails,
  ticketing,
  received,
  mobileNumber,
  emailAddress,
  docs,
}: BookingRowProps) {
  const { flight, rbd, numberOfPassengers } = booking;
  const hasTransit = !!flight.transit;
  const dayOfWeek = getDayOfWeek(flight.date);
  const formattedFlightNumber = formatFlightNumber(
    flight.flightNumber,
    flight.airline
  );

  return (
    <div className="p-3 font-mono text-sm">
      {hasTransit ? (
        <>
          {/* First Row: Origin -> Transit */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base overflow-x-auto">
            <span className="w-6 shrink-0 text-slate-100 font-bold">
              {index}
            </span>
            <span className="w-12 shrink-0 text-slate-100 font-bold">
              {flight.airline}
            </span>
            <span className="w-16 shrink-0 text-slate-100">
              {formattedFlightNumber}
            </span>
            <span className="w-8 shrink-0 text-slate-300">{rbd}</span>
            <span className="w-16 shrink-0 text-slate-100 font-semibold">
              {flight.origin}
            </span>
            <span className="w-16 shrink-0 text-slate-100 font-semibold">
              {flight.transit?.city}
            </span>
            <span className="w-16 shrink-0 text-slate-300">
              {flight.departureTime}
            </span>
            <span className="w-16 shrink-0 text-slate-300">
              {flight.transit?.arrivalTime}
            </span>
            <span className="w-12 shrink-0 text-slate-300">
              {numberOfPassengers} PAX
            </span>
          </div>

          {/* Second Row: Transit -> Destination */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base overflow-x-auto border-t border-slate-700/50 mt-2 pt-2">
            <span className="w-6 shrink-0"></span>
            <span className="w-12 shrink-0 text-slate-100 font-bold">
              {flight.airline}
            </span>
            <span className="w-16 shrink-0 text-slate-100">
              {formattedFlightNumber}
            </span>
            <span className="w-8 shrink-0 text-slate-300">{rbd}</span>
            <span className="w-16 shrink-0 text-slate-100 font-semibold">
              {flight.transit?.city}
            </span>
            <span className="w-16 shrink-0 text-slate-100 font-semibold">
              {flight.destination}
            </span>
            <span className="w-16 shrink-0 text-slate-300">
              {flight.transit?.departureTime}
            </span>
            <span className="w-16 shrink-0 text-slate-300">
              {flight.arrivalTime}
            </span>
            <span className="w-12 shrink-0 text-slate-300">
              {numberOfPassengers} PAX
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base overflow-x-auto">
          <span className="w-6 shrink-0 text-slate-100 font-bold">{index}</span>
          <span className="w-12 shrink-0 text-slate-100 font-bold">
            {flight.airline}
          </span>
          <span className="w-16 shrink-0 text-slate-100">
            {formattedFlightNumber}
          </span>
          <span className="w-8 shrink-0 text-slate-300">{rbd}</span>
          <span className="w-16 shrink-0 text-slate-100">{flight.date}</span>
          <span className="w-12 shrink-0 text-slate-300 uppercase">
            {dayOfWeek}
          </span>
          <span className="w-12 shrink-0 text-slate-100 font-semibold">
            {flight.origin}
          </span>
          <span className="w-12 shrink-0 text-slate-100 font-semibold">
            {flight.destination}
          </span>
          <span className="w-12 shrink-0 text-green-400 font-semibold">
            SS1
          </span>
          <span className="w-16 shrink-0 text-slate-300">
            {flight.departureTime}
          </span>
          <span className="w-20 shrink-0 text-slate-300">
            {flight.arrivalTime}
          </span>
        </div>
      )}

      {/* Passenger Name Display - Show below the flight segment */}
      {passengerName && (
        <div className="mt-1 text-slate-100 font-mono text-sm whitespace-nowrap">
          {passengerName.formattedName}
        </div>
      )}

      {/* Star lines and Agency details */}
      {agencyDetails && (
        <>
          <div className="text-slate-400 font-mono text-sm">*</div>
          <div className="text-slate-100 font-mono text-sm whitespace-nowrap">
            {agencyDetails.formatted}
          </div>
          <div className="text-slate-400 font-mono text-sm">*</div>
        </>
      )}

      {/* Ticketing */}
      {ticketing && (
        <>
          <div className="text-slate-100 font-mono text-sm whitespace-nowrap">
            {ticketing.formatted}
          </div>
          <div className="text-slate-400 font-mono text-sm">*</div>
        </>
      )}

      {/* Received */}
      {received && (
        <>
          <div className="text-slate-100 font-mono text-sm whitespace-nowrap">
            {received.formatted}
          </div>
          <div className="text-slate-400 font-mono text-sm">*</div>
        </>
      )}

      {/* Mobile Number */}
      {mobileNumber && (
        <>
          <div className="text-slate-100 font-mono text-sm whitespace-nowrap">
            {mobileNumber.formatted}
          </div>
          <div className="text-slate-400 font-mono text-sm border-b border-dotted border-slate-500 w-full my-1"></div>
          <div className="text-slate-400 font-mono text-sm">*</div>
        </>
      )}

      {/* Email Address */}
      {emailAddress && (
        <>
          <div className="text-slate-100 font-mono text-sm whitespace-nowrap">
            {emailAddress.formatted}
          </div>
          <div className="text-slate-400 font-mono text-sm border-b border-dotted border-slate-500 w-full my-1"></div>
          <div className="text-slate-400 font-mono text-sm">*</div>
        </>
      )}

      {/* DOCS */}
      {docs && (
        <>
          <div className="text-slate-100 font-mono text-sm whitespace-nowrap">
            {docs.formatted}
          </div>
          <div className="text-slate-400 font-mono text-sm border-b border-dotted border-slate-500 w-full my-1"></div>
          <div className="text-slate-400 font-mono text-sm">*</div>
        </>
      )}
    </div>
  );
}
