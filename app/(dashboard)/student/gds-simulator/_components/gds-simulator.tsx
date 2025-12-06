"use client";

import { useState, useEffect } from "react";
import { CommandInput } from "./command-input";
import { ResultDisplay } from "./result-display";
import { CommandSidebar } from "./command-sidebar";
import { CommandResult, Flight } from "@/lib/types/gds.type";
import { mockFlights } from "@/lib/gds/mock-data";

export function GDSSimulator() {
  const [results, setResults] = useState<CommandResult[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Load all flights on initial mount
  useEffect(() => {
    if (!hasSearched) {
      const initialResult: CommandResult = {
        type: "availability",
        data: {
          flights: mockFlights,
          date: "",
          route: "ALL FLIGHTS",
          origin: "",
          destination: "",
          airline: "",
        },
        rawCommand: "",
        timestamp: new Date(),
      };
      setResults([initialResult]);
    }
  }, [hasSearched]);

  const handleCommandSubmit = (result: CommandResult) => {
    console.log("result", result);

    // Mark that user has searched - this will prevent showing initial "ALL FLIGHTS"
    setHasSearched(true);

    // If this is a clear storage command (IG), remove all bookings and passenger name from localStorage
    if (result.type === "booking" && result.data.clearStorage) {
      localStorage.removeItem("gds_bookings");
      localStorage.removeItem("gds_passenger_name");
      localStorage.removeItem("gds_agency_details");
      localStorage.removeItem("gds_ticketing");
      localStorage.removeItem("gds_received");
      localStorage.removeItem("gds_passenger_mobile");
      localStorage.removeItem("gds_passenger_email");
      localStorage.removeItem("gds_docs");
      localStorage.removeItem("gds_fare_detail");
      localStorage.removeItem("gds_printer_designate_confirm");
      localStorage.removeItem("gds_ptr_numbers");
      localStorage.removeItem("gds_dsiv_ptr");
      localStorage.removeItem("gds_ptr_assigned");
      localStorage.removeItem("gds_ticket_details");
      localStorage.removeItem("gds_ticket_number");
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful booking (seat sell), save to local storage
    if (result.type === "booking" && result.data.booking) {
      const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");
      bookings.push(result.data.booking);
      localStorage.setItem("gds_bookings", JSON.stringify(bookings));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful received command, save to local storage
    if (
      result.type === "received" &&
      result.data.success &&
      result.data.received
    ) {
      localStorage.setItem(
        "gds_received",
        JSON.stringify(result.data.received)
      );
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful ticketing command, save to local storage
    if (
      result.type === "ticketing" &&
      result.data.success &&
      result.data.ticketing
    ) {
      localStorage.setItem(
        "gds_ticketing",
        JSON.stringify(result.data.ticketing)
      );
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful agency details insert, save to local storage
    if (
      result.type === "agency_details" &&
      result.data.success &&
      result.data.agencyDetails
    ) {
      localStorage.setItem(
        "gds_agency_details",
        JSON.stringify(result.data.agencyDetails)
      );
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful name insert, save to local storage
    if (
      result.type === "name_insert" &&
      result.data.success &&
      result.data.passengerName
    ) {
      localStorage.setItem(
        "gds_passenger_name",
        JSON.stringify(result.data.passengerName)
      );
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful mobile number command, save to local storage
    if (
      result.type === "passenger_mobile_number" &&
      result.data.success &&
      result.data.mobileNumber
    ) {
      localStorage.setItem(
        "gds_passenger_mobile",
        JSON.stringify(result.data.mobileNumber)
      );
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful email address command, save to local storage
    if (
      result.type === "passenger_email_address" &&
      result.data.success &&
      result.data.emailAddress
    ) {
      localStorage.setItem(
        "gds_passenger_email",
        JSON.stringify(result.data.emailAddress)
      );
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful docs insert command, save to local storage
    if (
      result.type === "docs_insert" &&
      result.data.success &&
      result.data.docs
    ) {
      localStorage.setItem("gds_docs", JSON.stringify(result.data.docs));
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is a successful price quote save (PQ), it's already saved in parsePQ
    // Just dispatch event to update real-time display
    if (result.type === "price_save_or_restored" && result.data.success) {
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // If this is an availability check, replace all previous availability results
    // This ensures only filtered results are shown, not the initial "ALL FLIGHTS"
    if (result.type === "availability") {
      // Remove all previous availability results and show only this new filtered result
      setResults((prev) => {
        const nonAvailabilityResults = prev.filter(
          (r) => r.type !== "availability"
        );
        return [result, ...nonAvailabilityResults];
      });
    } else {
      // For other result types (booking, fare, etc.), add to the list
      setResults((prev) => [result, ...prev]);
    }
  };

  const handleCommandSelect = (command: string) => {
    setSelectedCommand(command);
  };

  // Get available flights from the most recent availability result
  const getAvailableFlights = (): Flight[] => {
    const availabilityResult = results.find((r) => r.type === "availability");
    return availabilityResult?.data?.flights || [];
  };

  return (
    <div className="w-full flex flex-col lg:flex-row h-screen bg-slate-900">
      {/* Left Side - Command Input & Results */}
      <div className="flex-1 flex flex-col min-w-0 lg:border-r border-slate-700">
        <CommandInput
          onCommandSubmit={handleCommandSubmit}
          selectedCommand={selectedCommand}
          availableFlights={getAvailableFlights()}
        />
        <ResultDisplay results={results} />

        {/* Command Helper - Below table on mobile/tablet, hidden on desktop (1024px+) */}
        <div className="lg:hidden border-t border-slate-700">
          <CommandSidebar onCommandSelect={handleCommandSelect} />
        </div>
      </div>

      {/* Right Side - Commands FAQ - Hidden on mobile/tablet, shown on desktop (1024px+) */}
      <div className="hidden lg:block">
        <CommandSidebar onCommandSelect={handleCommandSelect} />
      </div>
    </div>
  );
}
