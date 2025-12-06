"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Flight } from "@/lib/types/gds.type";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FlightDetailsProps {
  flight: Flight;
  index: number;
}

// Utility function to parse class codes and extract unique class codes
// Examples:
// "J7 C7 D7 Z7 Y9 B9" -> ["J", "C", "D", "Z", "Y", "B"]
// "CC DC JC Z9 Y9" -> ["CC", "DC", "JC", "Z", "Y"]
// "T9 V9 L9" -> ["T", "V", "L"]
function parseClassCodes(classString: string): string[] {
  const classes = classString.split(" ").filter(Boolean);
  const uniqueClasses = new Set<string>();

  classes.forEach((cls) => {
    // Extract class code - can be 1 or 2 letters followed by numbers or special chars
    // Match patterns like: "J7" -> "J", "CC" -> "CC", "DC" -> "DC", "T9" -> "T", "V9" -> "V", "L9" -> "L", "ZC" -> "ZC"
    const match = cls.match(/^([A-Z]{1,2})/);
    if (match) {
      uniqueClasses.add(match[1]);
    }
  });

  // Sort: single letters first, then double letters
  const sorted = Array.from(uniqueClasses);
  return sorted.sort((a, b) => {
    if (a.length === 1 && b.length === 2) return -1;
    if (a.length === 2 && b.length === 1) return 1;
    return a.localeCompare(b);
  });
}

export function FlightDetails({ flight, index }: FlightDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedPassengers, setSelectedPassengers] = useState<number>(1);
  const hasTransit = !!flight.transit;

  // Parse class codes to get unique class letters
  const availableClasses = useMemo(() => {
    return parseClassCodes(flight.class);
  }, [flight.class]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-full border-b border-slate-700 hover:bg-slate-800 transition-colors bg-slate-800/50">
        {hasTransit ? (
          <>
            {/* First Row: Origin -> Transit */}
            <CollapsibleTrigger className="block w-full">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 py-3 px-2 sm:px-3 text-xs sm:text-sm md:text-base font-mono whitespace-nowrap">
                {/* Index */}
                <span className="w-5 sm:w-6 shrink-0 text-slate-100 font-bold">
                  {index}
                </span>

                {/* Airline */}
                {/* <span className="w-10 sm:w-12 shrink-0 text-slate-100 font-bold">
                  {flight.airline}
                </span> */}

                {/* Flight Number */}
                <span className="w-14 sm:w-16 shrink-0 text-slate-100">
                  {flight.flightNumber}
                </span>

                {/* Class Availability - wrapped in two lines like image */}
                <div className="flex-1 text-left min-w-[150px] sm:min-w-[180px]">
                  <div className="text-slate-300 leading-tight text-[10px] sm:text-xs md:text-sm">
                    {flight.class.split(" ").slice(0, 9).join(" ")}
                  </div>
                  <div className="text-slate-300 leading-tight text-[10px] sm:text-xs md:text-sm">
                    {flight.class.split(" ").slice(9).join(" ")}
                  </div>
                </div>

                {/* Origin */}
                <span className="w-14 sm:w-16 shrink-0 text-slate-100 font-semibold">
                  {flight.origin}
                </span>

                {/* Transit Destination */}
                <span className="w-14 sm:w-16 shrink-0 text-slate-100 font-semibold">
                  {flight.transit?.city}
                </span>

                {/* Departure Time */}
                <span className="w-14 sm:w-16 shrink-0 text-slate-300">
                  {flight.departureTime}
                </span>

                {/* Transit Arrival Time */}
                <span className="w-14 sm:w-16 shrink-0 text-slate-300">
                  {flight.transit?.arrivalTime}
                </span>

                {/* Seats Available */}
                <span className="w-12 sm:w-14 shrink-0 text-slate-300">
                  {flight.seats}
                </span>

                {/* Fare */}
                <span className="w-12 sm:w-14 shrink-0 text-slate-300">
                  {flight.fare}
                </span>

                {/* Expand icon */}
                <span className="w-6 sm:w-7 flex justify-center shrink-0">
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </span>
              </div>
            </CollapsibleTrigger>

            {/* Second Row: Transit -> Destination (empty first column) */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 py-3 px-2 sm:px-3 text-xs sm:text-sm md:text-base font-mono border-t border-slate-700/50 whitespace-nowrap">
              {/* Empty Index - First column is empty for transit continuation */}
              <span className="w-5 sm:w-6 shrink-0"></span>

              {/* Airline */}
              <span className="w-10 sm:w-12 shrink-0 text-slate-100 font-bold">
                {flight.airline}
              </span>

              {/* Flight Number */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-100">
                {flight.flightNumber}
              </span>

              {/* Class Availability - same as first row */}
              <div className="flex-1 text-left min-w-[150px] sm:min-w-[180px]">
                <div className="text-slate-300 leading-tight text-[10px] sm:text-xs md:text-sm">
                  {flight.class.split(" ").slice(0, 9).join(" ")}
                </div>
                <div className="text-slate-300 leading-tight text-[10px] sm:text-xs md:text-sm">
                  {flight.class.split(" ").slice(9).join(" ")}
                </div>
              </div>

              {/* Transit Origin */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-100 font-semibold">
                {flight.transit?.city}
              </span>

              {/* Final Destination */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-100 font-semibold">
                {flight.destination}
              </span>

              {/* Transit Departure Time */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-300">
                {flight.transit?.departureTime}
              </span>

              {/* Final Arrival Time */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-300">
                {flight.arrivalTime}
              </span>

              {/* Seats Available */}
              <span className="w-12 sm:w-14 shrink-0 text-slate-300">
                {flight.seats}
              </span>

              {/* Fare */}
              <span className="w-12 sm:w-14 shrink-0 text-slate-300">
                {flight.fare}
              </span>

              {/* Empty space for icon alignment */}
              <span className="w-6 sm:w-7 flex justify-center shrink-0"></span>
            </div>
          </>
        ) : (
          /* Non-transit flight display (original) */
          <CollapsibleTrigger className="block w-full">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 py-3 px-2 sm:px-3 text-xs sm:text-sm md:text-base font-mono whitespace-nowrap">
              {/* Index */}
              <span className="w-5 sm:w-6 shrink-0 text-slate-100 font-bold">
                {index}
              </span>

              {/* Airline */}
              <span className="w-10 sm:w-12 shrink-0 text-slate-100 font-bold">
                {flight.airline}
              </span>

              {/* Flight Number */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-100">
                {flight.flightNumber}
              </span>

              {/* Class Availability - wrapped in two lines like image */}
              <div className="flex-1 text-left min-w-[150px] sm:min-w-[180px]">
                <div className="text-slate-300 leading-tight text-[10px] sm:text-xs md:text-sm">
                  {flight.class.split(" ").slice(0, 9).join(" ")}
                </div>
                <div className="text-slate-300 leading-tight text-[10px] sm:text-xs md:text-sm">
                  {flight.class.split(" ").slice(9).join(" ")}
                </div>
              </div>

              {/* Origin */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-100 font-semibold">
                {flight.origin}
              </span>

              {/* Destination */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-100 font-semibold">
                {flight.destination}
              </span>

              {/* Departure Time */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-300">
                {flight.departureTime}
              </span>

              {/* Arrival Time */}
              <span className="w-14 sm:w-16 shrink-0 text-slate-300">
                {flight.arrivalTime}
              </span>

              {/* Seats Available */}
              <span className="w-12 sm:w-14 shrink-0 text-slate-300">
                {flight.seats}
              </span>

              {/* Fare */}
              <span className="w-12 sm:w-14 shrink-0 text-slate-300">
                {flight.fare}
              </span>

              {/* Expand icon */}
              <span className="w-6 sm:w-7 flex justify-center shrink-0">
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </span>
            </div>
          </CollapsibleTrigger>
        )}

        <CollapsibleContent>
          {/* Inline class dropdown in the same row - GDS style */}
          <div className="border-t border-slate-700 bg-slate-800/30">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 py-2 px-2 sm:px-3 text-xs sm:text-sm md:text-base font-mono whitespace-nowrap">
              {/* Empty space for index alignment */}
              <span className="w-5 sm:w-6 shrink-0"></span>

              {/* Empty space for airline */}
              <span className="w-10 sm:w-12 shrink-0"></span>

              {/* Empty space for flight number */}
              <span className="w-14 sm:w-16 shrink-0"></span>

              {/* Passengers number Dropdown */}
              <div className="flex-1 flex items-center gap-3 min-w-[200px] sm:min-w-[250px]">
                <span className="text-slate-400 text-[10px] sm:text-xs text-xl shrink-0 font-semibold">
                  Passengers:
                </span>
                <select
                  value={selectedPassengers}
                  onChange={(e) =>
                    setSelectedPassengers(Number(e.target.value))
                  }
                  className="bg-slate-900 border border-slate-600 text-slate-100 rounded-none px-3 py-1.5 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[80px] appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23cbd5e1' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    paddingRight: "2rem",
                  }}
                >
                  <option value="" className="bg-slate-800 text-slate-300">
                    -- SELECT --
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((passenger) => (
                    <option
                      key={passenger}
                      className="bg-slate-800 text-slate-100"
                    >
                      {passenger}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Availability Dropdown - GDS style */}
              <div className="flex-1 flex items-center gap-3 min-w-[200px] sm:min-w-[250px]">
                <span className="text-slate-400 text-[10px] sm:text-xs text-xl shrink-0 font-semibold">
                  Class {flight.origin} - {flight.destination}:
                </span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="bg-slate-900 border border-slate-600 text-slate-100 rounded-none px-3 py-1.5 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px] appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23cbd5e1' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    paddingRight: "2rem",
                  }}
                >
                  <option value="" className="bg-slate-800 text-slate-300">
                    -- SELECT --
                  </option>
                  {availableClasses.map((cls) => (
                    <option
                      key={cls}
                      value={cls}
                      className="bg-slate-800 text-slate-100"
                    >
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
