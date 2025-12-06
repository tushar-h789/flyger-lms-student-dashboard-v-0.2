"use client";

import { useState, useEffect } from "react";
import { CommandResult } from "@/lib/types/gds.type";
import { FlightDetails } from "./fligth-details";
import { BookingDisplay } from "./booking-display";
import { WPADisplay } from "./wpa-display";
import { WPNCBDisplay } from "./wpncb-display";
import { TicketDownloadButton } from "./ticket-download";

interface ResultDisplayProps {
  results: CommandResult[];
}

export function ResultDisplay({ results }: ResultDisplayProps) {
  // Get the most recent booking result for display
  const latestBookingResult = results
    .filter((r) => r.type === "booking" && r.data.booking)
    .slice(-1)[0];

  // Check if there's a recent price quote result in the results array
  const hasRecentPriceQuoteResult = results.some(
    (r) =>
      (r.type === "price_save_or_restored" || r.type === "price_check") &&
      r.data.success
  );

  // Check if there are any bookings in local storage (client-side only)
  const [hasBookings, setHasBookings] = useState(false);
  const [hasDetails, setHasDetails] = useState(false);
  const [bookingVersion, setBookingVersion] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");
      setHasBookings(bookings.length > 0);

      // Listen for booking updates
      const handleUpdate = () => {
        const updatedBookings = JSON.parse(
          localStorage.getItem("gds_bookings") || "[]"
        );
        setHasBookings(updatedBookings.length > 0);
        // Check for any details presence in localStorage
        const hasAnyDetails = [
          "gds_passenger_name",
          "gds_agency_details",
          "gds_ticketing",
          "gds_received",
          "gds_passenger_mobile",
          "gds_passenger_email",
          "gds_docs",
        ].some((k) => !!localStorage.getItem(k));
        setHasDetails(hasAnyDetails);
      };

      window.addEventListener("gds_booking_updated", handleUpdate);
      window.addEventListener("gds_booking_updated", () =>
        setBookingVersion((v) => v + 1)
      );
      return () =>
        window.removeEventListener("gds_booking_updated", handleUpdate);
    }
  }, []);

  // Price quote display removed - now shown in BOOKING STATUS section

  return (
    <div className="flex-1 bg-slate-900 overflow-y-auto">
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Booking Status Display - Show at the top if there are bookings */}
        {(hasBookings || hasDetails || latestBookingResult) && (
          <BookingDisplay
            currentBooking={latestBookingResult?.data.booking}
            version={bookingVersion}
          />
        )}

        {results.length === 0 ? (
          <div className="text-slate-400 text-center py-12 sm:py-20 font-mono text-sm sm:text-base">
            Enter a command to see results
          </div>
        ) : (
          results.map((result, index) => (
            <div key={index} className="space-y-3 w-full">
              {result.type === "availability" && (
                <div className="space-y-1">
                  {/* Scrollable table container - includes header and table */}
                  <div
                    className="overflow-x-auto w-full overflow-y-visible bg-slate-800/50"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#475569 #1e293b",
                      // @ts-ignore - WebkitOverflowScrolling is a valid CSS property
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {/* Table wrapper with minimum width to force horizontal scroll */}
                    <div style={{ minWidth: "max-content", width: "100%" }}>
                      {/* Header with date and route info - scrolls with table */}
                      <div className="bg-slate-800 p-2 sm:p-3 font-mono text-sm sm:text-base text-slate-100 border border-slate-700 rounded-t whitespace-nowrap">
                        {result.data.date ? result.data.date.toUpperCase() : ""}{" "}
                        {result.data.route || "ALL FLIGHTS"}
                      </div>

                      {/* Flight list */}
                      {result.data.flights.map((flight: any, idx: number) => (
                        <FlightDetails
                          key={idx}
                          flight={flight}
                          index={idx + 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fare Display */}
              {result.type === "fare" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100 font-bold text-base sm:text-lg">
                    FARE CHECK - {result.data.route}
                  </div>
                  <div className="mt-2 space-y-1 text-slate-300 text-sm sm:text-base">
                    <div>
                      Base Fare: {result.data.baseFare} {result.data.currency}
                    </div>
                    <div>
                      Tax: {result.data.tax} {result.data.currency}
                    </div>
                    <div className="font-bold text-slate-100 text-lg sm:text-xl">
                      Total: {result.data.total} {result.data.currency}
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Display */}
              {result.type === "booking" && (
                <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                  <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                    ✓ {result.data.message}
                  </div>
                  {result.data.flightNumber && (
                    <div className="text-slate-300 text-sm sm:text-base mt-1">
                      Flight: {result.data.flightNumber}
                    </div>
                  )}
                  {result.data.booking && (
                    <div className="text-slate-300 text-xs sm:text-sm mt-2 font-mono">
                      Command: {result.data.booking.command} | Passengers:{" "}
                      {result.data.booking.numberOfPassengers} | Class:{" "}
                      {result.data.booking.rbd}
                    </div>
                  )}
                </div>
              )}

              {/* WPA Display */}
              {result.type === "wpa" && (
                <div>
                  {result.data.success ? (
                    <WPADisplay data={result.data} />
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WPNCB Display */}
              {result.type === "wpncb" && (
                <div>
                  {result.data.success ? (
                    <WPNCBDisplay data={result.data} />
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Name Insert Display */}
              {result.type === "name_insert" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.passengerName && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          Passenger: {result.data.passengerName.formattedName}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Agency Details Display */}
              {result.type === "agency_details" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.agencyDetails && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          9 {result.data.agencyDetails.agencyName}{" "}
                          {result.data.agencyDetails.agencyPhone}{" "}
                          {result.data.agencyDetails.reservationOfficerName}«
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ticketing Display */}
              {result.type === "ticketing" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.ticketing && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          {result.data.ticketing.formatted}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Received Display */}
              {result.type === "received" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.received && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          {result.data.received.formatted}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Number Display */}
              {result.type === "passenger_mobile_number" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.mobileNumber && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          {result.data.mobileNumber.formatted}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Email Address Display */}
              {result.type === "passenger_email_address" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.emailAddress && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          {result.data.emailAddress.formatted}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DOCS Insert Display */}
              {result.type === "docs_insert" && (
                <div>
                  {result.data.success ? (
                    <div className="bg-green-900/30 border border-green-600 p-3 sm:p-4 rounded-lg shadow-lg">
                      <div className="text-green-400 font-mono font-semibold text-base sm:text-lg">
                        ✓ {result.data.message}
                      </div>
                      {result.data.docs && (
                        <div className="text-slate-300 text-sm sm:text-base mt-2 font-mono">
                          {result.data.docs.formatted}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                      <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                        ✗ {result.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Printer Designate Display */}
              {result.type === "printer_designate" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100">
                    {/* Header with command */}
                    <div className="text-green-400">
                      {result.rawCommand.toUpperCase()}«
                    </div>

                    {result.data.success && result.data.entries ? (
                      <div className="mt-3 space-y-1">
                        {/* Column Headers */}
                        <div className="grid grid-cols-5 gap-2 text-xs sm:text-sm font-semibold border-b border-slate-600 pb-1">
                          <div>LNIATA</div>
                          <div>TYPE</div>
                          <div>TAPOOL</div>
                          <div>POOL</div>
                          <div>IND</div>
                        </div>

                        {/* Dashed Separator */}
                        <div className="text-slate-500 text-xs border-b border-slate-600 pb-1">
                          ----------------------------------------------------------------
                        </div>

                        {/* Data Rows */}
                        {result.data.entries.map(
                          (entry: any, index: number) => (
                            <div
                              key={index}
                              className="grid grid-cols-5 gap-2 text-xs sm:text-sm"
                            >
                              <div className="text-slate-200">
                                {entry.lniata}
                              </div>
                              <div className="text-slate-200">{entry.type}</div>
                              <div className="text-slate-400">
                                {entry.tapool || ""}
                              </div>
                              <div className="text-slate-400">
                                {entry.pool || ""}
                              </div>
                              <div className="text-slate-400">
                                {entry.ind || ""}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-amber-400 mt-2">
                        {result.data.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Printer Designate Confirm Display */}
              {result.type === "printer_designate_confirm" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100">
                    {result.data.success ? (
                      <>
                        {/* First line: W*BD« */}
                        <div className="text-green-400">
                          {result.data.formatted}
                        </div>
                        {/* Second line: OK-[random number] */}
                        <div className="mt-1 text-slate-200">
                          {result.data.okNumber}
                        </div>
                      </>
                    ) : (
                      <div className="text-amber-400">
                        {result.data.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DSIV Display */}
              {result.type === "dsiv" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100">
                    {result.data.success ? (
                      <>
                        {/* First line: DSIV6B8893« */}
                        <div className="text-green-400">
                          {result.data.formatted}
                        </div>
                        {/* Second line: OK PTR ASSIGNED */}
                        <div className="mt-1 text-slate-200">
                          {result.data.message}
                        </div>
                      </>
                    ) : (
                      <div className="text-amber-400">
                        {result.data.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PTR Assigned Display */}
              {result.type === "ptr_assigned" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100">
                    {result.data.success ? (
                      <>
                        {/* First line: PTR/6B8893 « */}
                        <div className="text-green-400">
                          {result.data.formatted}
                        </div>
                        {/* Dotted separator line */}
                        <div className="mt-1 text-slate-500 border-b border-dotted border-slate-600"></div>
                        {/* Second line: PRINTER DESIGNATED */}
                        <div className="mt-1 text-slate-200">
                          {result.data.message}
                        </div>
                      </>
                    ) : (
                      <div className="text-amber-400">
                        {result.data.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invoice Display (W'PQ1N1.1'ABG'FINVAGT'KP7) */}
              {result.type === "invoice" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100">
                    {result.data.success ? (
                      <>
                        {/* First line: W'PQ1N1.1'ABG'FINVAGT'KP7« */}
                        <div className="text-green-400">
                          {result.data.formatted}
                        </div>
                        {/* Second line: Ticket number */}
                        <div className="mt-1 text-slate-200">
                          Ticket Number: {result.data.ticketNumber}
                        </div>
                      </>
                    ) : (
                      <div className="text-amber-400">
                        {result.data.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ticket Details Display (*A) */}
              {result.type === "ticket_details" && result.data.success && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100 space-y-1">
                    {/* Header: *A« */}
                    <div className="text-green-400">*A«</div>

                    {/* PNR */}
                    <div>{result.data.pnr}</div>

                    {/* Ticket Number - Show if available */}
                    {result.data.ticketNumber && (
                      <div className="text-green-400">
                        Ticket Number: {result.data.ticketNumber}
                      </div>
                    )}

                    {/* Passenger Name */}
                    {result.data.passengerNameLine && (
                      <div>{result.data.passengerNameLine}</div>
                    )}

                    {/* Flight Segment */}
                    {result.data.segmentLine && (
                      <div>{result.data.segmentLine}</div>
                    )}

                    {/* TKT/TIME LIMIT */}
                    {result.data.tktTimeLimit && (
                      <>
                        <div>TKT/TIME LIMIT</div>
                        <div>{result.data.tktTimeLimit}</div>
                      </>
                    )}

                    {/* PHONES */}
                    {result.data.phonesLine && (
                      <>
                        <div>PHONES</div>
                        <div>{result.data.phonesLine}</div>
                      </>
                    )}

                    {/* System Messages */}
                    {result.data.hasPassengerDetail && (
                      <div>
                        PASSENGER DETAIL FIELD EXISTS - USE PD TO DISPLAY
                      </div>
                    )}
                    {result.data.hasPriceQuote && (
                      <div>PRICE QUOTE RECORD - AUTOPRICED</div>
                    )}
                    {result.data.hasSecurityInfo && (
                      <div>SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY</div>
                    )}

                    {/* GENERAL FACTS */}
                    {result.data.generalFacts &&
                      result.data.generalFacts.length > 0 && (
                        <>
                          <div>GENERAL FACTS</div>
                          {result.data.generalFacts.map(
                            (fact: string, idx: number) => (
                              <div key={idx}>{fact}</div>
                            )
                          )}
                        </>
                      )}

                    {/* RECEIVED FROM */}
                    {result.data.receivedFrom && (
                      <div>{result.data.receivedFrom}</div>
                    )}

                    {/* Record Locator */}
                    <div>{result.data.recordLocator}</div>
                  </div>

                  {/* Download Button - Only show if ticket number exists (after invoice command) */}
                  {result.data.hasTicketNumber && result.data.ticketNumber && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <TicketDownloadButton ticketData={result.data} />
                    </div>
                  )}
                </div>
              )}

              {/* PNR (ER) Display */}
              {result.type === "pnr" && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100">
                    <div className="text-green-400">
                      {result.data.mode || "ER"}«
                    </div>
                    <div className="mt-1">{result.data.pnr}</div>
                    {(!result.data.mode || result.data.mode === "ER") && (
                      <div className="mt-1">RECORD LOCATOR REQUESTED</div>
                    )}
                    {result.data.nameLine && (
                      <div className="mt-1">{result.data.nameLine}</div>
                    )}
                    {result.data.segLine && (
                      <div className="mt-1">{result.data.segLine}</div>
                    )}
                    <div className="mt-2">TKT/TIME LIMIT</div>
                    {result.data.tktLimit && (
                      <div className="ml-3">{result.data.tktLimit}</div>
                    )}
                    <div className="mt-2">PHONES</div>
                    {result.data.phones && (
                      <div className="ml-3">{result.data.phones}</div>
                    )}
                    <div className="mt-2 text-slate-300">
                      PASSENGER DETAIL FIELD EXISTS - USE PD TO DISPLAY
                    </div>
                    {result.data.receivedFrom && (
                      <div className="mt-1">{result.data.receivedFrom}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Quote Save/Restore Display */}
              {(result.type === "price_save_or_restored" ||
                result.type === "price_check") && (
                <div className="bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-700 font-mono text-sm sm:text-base shadow-lg">
                  <div className="text-slate-100 space-y-1">
                    {/* Header - Show *PQ for price_check, PQ for price_save_or_restored */}
                    <div className="text-green-400">
                      {result.type === "price_check" ? "*PQ«" : "PQ«"}
                    </div>
                    <div className="mt-1">{result.data.message}</div>

                    {result.data.success && (
                      <>
                        {/* Fare Record */}
                        <div className="mt-2">
                          FARE RECORD-{result.data.passengerType}-AUTO PRICED
                          -ATPC
                        </div>
                        <div className="mt-1">
                          PQ 1 LAST DAY TO TICKET TKT/TL{" "}
                          {result.data.tktDeadline}
                        </div>
                        <div className="mt-1">
                          INPUT PTC - {result.data.passengerType}
                        </div>

                        {/* Passenger Name */}
                        {result.data.passengerNameLine && (
                          <div className="mt-2">
                            {result.data.passengerNameLine}
                          </div>
                        )}

                        {/* Validating Carrier */}
                        <div className="mt-2">
                          VALIDATING CARRIER - {result.data.validatingCarrier}
                        </div>

                        {/* Flight Segment */}
                        {result.data.segmentLine && (
                          <div className="mt-2">{result.data.segmentLine}</div>
                        )}

                        {/* Pricing Table */}
                        {result.data.fareDetail && (
                          <div className="mt-4 space-y-2">
                            {/* Table Header */}
                            <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm border-b border-slate-600 pb-1">
                              <div>BASE FARE</div>
                              <div>EQUIV AMT</div>
                              <div>TAXES/FEES/CHARGES</div>
                              <div>TOTAL</div>
                            </div>

                            {/* Table Content */}
                            <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
                              {/* Base Fare Column */}
                              <div className="space-y-1">
                                <div>
                                  USD
                                  {result.data.fareDetail.baseFareUSD.toFixed(
                                    2
                                  )}
                                </div>
                              </div>

                              {/* Equivalent Amount Column */}
                              <div className="space-y-1">
                                <div>
                                  BDT
                                  {result.data.fareDetail.baseFareBDT.toLocaleString()}
                                </div>
                                {result.data.fareDetail.taxes.UT > 0 && (
                                  <div>{result.data.fareDetail.taxes.UT}UT</div>
                                )}
                              </div>

                              {/* Taxes/Fees/Charges Column */}
                              <div className="space-y-1">
                                {result.data.fareDetail.taxes.XT > 0 && (
                                  <div>{result.data.fareDetail.taxes.XT}XT</div>
                                )}
                                {result.data.fareDetail.taxes.W > 0 && (
                                  <div>{result.data.fareDetail.taxes.W}W</div>
                                )}
                                {result.data.fareDetail.taxes.P7 > 0 && (
                                  <div>{result.data.fareDetail.taxes.P7}P7</div>
                                )}
                                {result.data.fareDetail.taxes.P8 > 0 && (
                                  <div>{result.data.fareDetail.taxes.P8}P8</div>
                                )}
                                {result.data.fareDetail.taxes.BD > 0 && (
                                  <div>{result.data.fareDetail.taxes.BD}BD</div>
                                )}
                                {result.data.fareDetail.taxes.E5 > 0 && (
                                  <div>{result.data.fareDetail.taxes.E5}E5</div>
                                )}
                              </div>

                              {/* Total Column */}
                              <div className="space-y-1">
                                <div>
                                  BDT
                                  {result.data.fareDetail.totalBDT.toLocaleString()}
                                </div>
                                {result.data.fareDetail.taxes.E5 > 0 && (
                                  <div>{result.data.fareDetail.taxes.E5}E5</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fare Construction */}
                        {result.data.fareConstruction && (
                          <div className="mt-3">
                            {result.data.fareConstruction}
                          </div>
                        )}

                        {/* Validating Carrier Info */}
                        <div className="mt-2">
                          VALID ON {result.data.validatingCarrier} ONLY/NONEND
                        </div>

                        {/* Trailer */}
                        <div className="mt-3">
                          <div>PRICING TRAILER MSG</div>
                          <div className="mt-1">
                            VALIDATING CARRIER SPECIFIED -{" "}
                            {result.data.validatingCarrier}
                          </div>
                        </div>
                      </>
                    )}

                    {!result.data.success && (
                      <div className="text-amber-400 mt-2">
                        {result.data.message}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {result.type === "error" && (
                <div className="bg-amber-900/20 border border-amber-600 p-4 rounded-lg shadow-lg">
                  <div className="text-amber-400 font-mono font-semibold mb-2 text-base sm:text-lg">
                    ✗ {result.data.message}
                  </div>
                  {result.data.suggestion && (
                    <div className="text-amber-300 text-sm sm:text-base font-mono mb-2">
                      {result.data.suggestion}
                    </div>
                  )}
                  {result.data.format && (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm text-amber-400 font-semibold uppercase">
                        Correct Format:
                      </div>
                      <div className="bg-slate-800 p-3 rounded border border-slate-700 font-mono text-sm sm:text-base text-slate-100">
                        {result.data.format}
                      </div>
                      {result.data.example && (
                        <>
                          <div className="text-sm text-amber-400 font-semibold uppercase mt-2">
                            Example:
                          </div>
                          <div className="bg-slate-950 text-green-400 p-3 rounded border border-slate-700 font-mono text-sm sm:text-base">
                            {result.data.example}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
