import { CommandResult, Flight } from "@/lib/types/gds.type";
import { mockFlights, mockBooking } from "./mock-data";

export class CommandParser {
  static parse(
    command: string,
    availableFlights: Flight[] = []
  ): CommandResult {
    const cmd = command.trim().toUpperCase();
    const timestamp = new Date();

    // Availability Check Pattern: Strict format - 1[DD][MON][FROM][TO][AIRLINE]
    // Example: 115JUNDACBKK BG or 115JUNDACBKK BGYBG
    if (this.isAvailabilityCheck(cmd)) {
      const validation = this.validateAvailabilityFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "1[DD][MON][FROM][TO][AIRLINE]",
            example: "115JUNDACBKK BG",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "availability",
        data: this.parseAvailability(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // End and Retrieve - build PNR view from localStorage
    if (cmd === "ER") {
      return {
        type: "pnr",
        data: { ...this.parseER(), mode: "ER" },
        rawCommand: command,
        timestamp,
      };
    }

    // Ignore and Retrieve: show the same PNR interface without changing storage
    if (cmd === "IR") {
      return {
        type: "pnr",
        data: { ...this.parseER(), mode: "IR" },
        rawCommand: command,
        timestamp,
      };
    }

    // Ticket Details: *A - Display complete ticket information
    if (cmd === "*A") {
      return {
        type: "ticket_details",
        data: this.parseTicketDetails(),
        rawCommand: command,
        timestamp,
      };
    }

    // Received Pattern: 6 [Reservation Officer Name]
    if (cmd.startsWith("6")) {
      const validation = this.validateReceivedFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "6 [Reservation Officer Name]",
            example: "6 IMRAN",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "received",
        data: this.parseReceived(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Ticketing Pattern: exact 7TAW/
    if (cmd.startsWith("7")) {
      const validation = this.validateTicketingFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "7TAW/",
            example: "7TAW/",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "ticketing",
        data: this.parseTicketing(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Seat Sell Pattern: 0[Number of Passenger][RBD][Serial Number]
    if (this.isSeatSell(cmd)) {
      const validation = this.validateSeatSellFormat(cmd, availableFlights);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "0[Number of Passenger][RBD][Serial Number]",
            example: "01Y2",
          },
          rawCommand: command,
          timestamp,
        };
      }
      const seatSellData = this.parseSeatSell(cmd, availableFlights);
      console.log("seatSellData", seatSellData);

      return {
        type: "booking",
        data: seatSellData,
        rawCommand: command,
        timestamp,
      };
    }

    // WPA Command: What Price Availability - Shows fare for booked class from localStorage
    if (cmd === "WPA") {
      return {
        type: "wpa",
        data: this.parseWPA(),
        rawCommand: command,
        timestamp,
      };
    }

    // WPNCB Command: What Price Next Class Best - Shows lowest fare across all classes
    if (cmd === "WPNCB") {
      return {
        type: "wpncb",
        data: this.parseWPNCB(availableFlights),
        rawCommand: command,
        timestamp,
      };
    }

    // Price Quote Save/Restore: PQ - Save price quote to localStorage
    if (cmd === "PQ") {
      return {
        type: "price_save_or_restored",
        data: this.parsePQ(),
        rawCommand: command,
        timestamp,
      };
    }

    // Price Quote Check: *PQ - Display saved price quote from localStorage
    if (cmd === "*PQ") {
      return {
        type: "price_check",
        data: this.parsePriceCheck(),
        rawCommand: command,
        timestamp,
      };
    }

    // Printer Designate: PE*[Agency Code] - Display printer designation list
    if (cmd.startsWith("PE*")) {
      const validation = this.validatePrinterDesignateFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "PE*[Agency Code(PCC)]",
            example: "PE*NL1L",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "printer_designate",
        data: this.parsePrinterDesignate(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Invoice: W'PQ1N1.1'ABG'FINVAGT'KP7 - Generate ticket number
    if (cmd.startsWith("W'")) {
      const validation = this.validateInvoiceFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "W'PQ1N1.1'ABG'FINVAGT'KP7",
            example: "W'PQ1N1.1'ABG'FINVAGT'KP7",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "invoice",
        data: this.parseInvoice(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Printer Designate Confirm: W*[Country Code] - Confirm printer designation
    if (cmd.startsWith("W*")) {
      const validation = this.validatePrinterDesignateConfirmFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "W*[Country Code]",
            example: "W*BD",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "printer_designate_confirm",
        data: this.parsePrinterDesignateConfirm(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // DSIV: DSIV[PTR NUMBER] - Assign PTR number
    if (cmd.startsWith("DSIV")) {
      const validation = this.validateDSIVFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "DSIV[PTR NUMBER]",
            example: "DSIV30B6B2",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "dsiv",
        data: this.parseDSIV(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // PTR Assigned: PTR/[PTR NUMBER] - Assign PTR number
    if (cmd.startsWith("PTR/")) {
      const validation = this.validatePTRAssignedFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "PTR/[PTR NUMBER]",
            example: "PTR/30B6B2",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "ptr_assigned",
        data: this.parsePTRAssigned(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Name Insert Pattern: -[Last Name]/[First Name][Space][Name Title]
    // Format: -[Last Name]/[First Name][Space][Name Title]
    // Example: -KHAN/MD TUSHAR MR or -HOSSEN/TUSHAR MR
    if (cmd.startsWith("-")) {
      const validation = this.validateNameInsertFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "-[Last Name]/[First Name][Space][Name Title]",
            example: "-HOSSEN/TUSHAR MR",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "name_insert",
        data: this.parseNameInsert(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    if (cmd.startsWith("9")) {
      const validation = this.validateAgencyDetailsFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format:
              "9[Space][Agency Name][Space][Agency Phone][Space][Reservation Officer Name]",
            example: "9 Flyger 01717171717 IMRAN",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "agency_details",
        data: this.parseAgencyDetails(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Mobile Number Pattern: 3CTCM/[Passenger Mobile Number]
    if (cmd.startsWith("3CTCM/")) {
      const validation = this.validateMobileNumberFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "3CTCM/[Passenger Mobile Number]",
            example: "3CTCM/01919919191",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "passenger_mobile_number",
        data: this.parseMobileNumber(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Email Address Pattern: 3CTCE/[Passenger Email Address]
    if (cmd.startsWith("3CTCE/")) {
      const validation = this.validateEmailAddressFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format: "3CTCE/[Passenger Email Address]",
            example: "3CTCE/example@gmail.com",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "passenger_email_address",
        data: this.parseEmailAddress(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // DOCS Insert Pattern: 3DOCS/[Passport type]/[Country Code]/[Passport Number]/[Nationality]/[Date of Birth]/[Gender]/[Passport Expiry Date]/[Passenger Name]
    if (cmd.startsWith("3DOCS/")) {
      const validation = this.validateDocsInsertFormat(cmd);
      if (!validation.valid) {
        return {
          type: "error",
          data: {
            message: validation.message,
            suggestion: validation.suggestion,
            format:
              "3DOCS/[Passport type]/[Country Code]/[Passport Number]/[Nationality]/[Date of Birth]/[Gender]/[Passport Expiry Date]/[Passenger Name]",
            example:
              "3DOCS/P/BGD/A1234567890/BGD/22JUN98/M/25DEC30/HOSSEN/TUSHAR",
          },
          rawCommand: command,
          timestamp,
        };
      }
      return {
        type: "docs_insert",
        data: this.parseDocsInsert(cmd),
        rawCommand: command,
        timestamp,
      };
    }

    // Ignore/Clear Pattern: IG - Clears all bookings from localStorage
    if (cmd === "IG" || cmd === "I") {
      return {
        type: "booking",
        data: {
          success: true,
          message: "ALL SEGMENTS REMOVED FROM PNR",
          clearStorage: true,
        },
        rawCommand: command,
        timestamp,
      };
    }

    // Check if command starts with '1' but is invalid - show availability check error format
    if (cmd.startsWith("1")) {
      const validation = this.validateAvailabilityFormat(cmd);
      return {
        type: "error",
        data: {
          message:
            validation.message ||
            "Invalid format: Availability check command is invalid",
          suggestion:
            validation.suggestion ||
            "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
          format: "1[DD][MON][FROM][TO][AIRLINE]",
          example: "115JUNDACBKK BG",
        },
        rawCommand: command,
        timestamp,
      };
    }

    // For all other invalid commands, show availability check format as default
    return {
      type: "error",
      data: {
        message:
          "Invalid format: Command too short. Please check the format and try again for checking availability.",
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK. For checking availability.",
        format: "1[DD][MON][FROM][TO][AIRLINE]",
        example: "115JUNDACBKK BG. For checking availability.",
      },
      rawCommand: command,
      timestamp,
    };
  }

  // STEP:1.0 Validate availability check format: 1[DD][MON][FROM][TO][AIRLINE]
  private static isAvailabilityCheck(cmd: string): boolean {
    // Must start with '1' for availability check
    // Format: 1[DD][MON][FROM][TO] or 1[DD][MON][FROM][TO][AIRLINE]
    // Minimum: 1 + 1 + 3 + 3 + 3 = 11 (without airline)
    // Maximum: 1 + 2 + 3 + 3 + 3 + 3 = 15 (with airline)
    return cmd.startsWith("1") && /^1\d{1,2}[A-Z]{3}[A-Z]{3}[A-Z]{3}/.test(cmd);
  }

  // STEP:1.1 Validate availability check format: 1[DD][MON][FROM][TO][AIRLINE]
  private static validateAvailabilityFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    // Remove spaces for validation
    const cleanedCmd = cmd.replace(/\s+/g, "");

    // Check if starts with '1'
    if (!cleanedCmd.startsWith("1")) {
      return {
        valid: false,
        message: "Invalid format: Availability check must start with '1'",
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    // Check length: Airline is optional (2-3 characters)
    // Format: 1[DD][MON][FROM][TO] or 1[DD][MON][FROM][TO][AIRLINE]
    // Without airline: 1 + 1-2 (date) + 3 (month) + 3 (from) + 3 (to) = 11-12 chars
    // With airline (2 chars): 1 + 1-2 (date) + 3 (month) + 3 (from) + 3 (to) + 2 (airline) = 13-14 chars
    // With airline (3 chars): 1 + 1-2 (date) + 3 (month) + 3 (from) + 3 (to) + 3 (airline) = 14-15 chars
    const minLengthWithoutAirline = 11; // 1 + 1 + 3 + 3 + 3
    const maxLengthWithoutAirline = 12; // 1 + 2 + 3 + 3 + 3
    const minLengthWithAirline = 13; // 1 + 1 + 3 + 3 + 3 + 2
    const maxLengthWithAirline = 15; // 1 + 2 + 3 + 3 + 3 + 3

    if (
      cleanedCmd.length < minLengthWithoutAirline ||
      (cleanedCmd.length > maxLengthWithoutAirline &&
        cleanedCmd.length < minLengthWithAirline) ||
      cleanedCmd.length > maxLengthWithAirline
    ) {
      return {
        valid: false,
        message: "Invalid format: Command length invalid",
        suggestion:
          "Format: 1[DD][MON][FROM][TO] or 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK or 115JUNDACBKK BG",
      };
    }

    // Extract components: 1[DD][MON][FROM][TO][AIRLINE]
    const dateMatch = cleanedCmd.match(/^1(\d{1,2})/);
    if (!dateMatch || dateMatch[1].length < 1 || dateMatch[1].length > 2) {
      return {
        valid: false,
        message: "Invalid format: Date must be 1-2 digits after '1'",
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    const date = dateMatch[1];
    const dateNum = parseInt(date, 10);
    if (dateNum < 1 || dateNum > 31) {
      return {
        valid: false,
        message: `Invalid format: Date must be between 01-31, got ${date}`,
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    // Check month (3 uppercase letters after date)
    const monthMatch = cleanedCmd.match(/^1\d{1,2}([A-Z]{3})/);
    if (!monthMatch) {
      return {
        valid: false,
        message:
          "Invalid format: Month must be 3 uppercase letters (JAN, FEB, MAR, etc.)",
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    const validMonths = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = monthMatch[1];
    if (!validMonths.includes(month)) {
      return {
        valid: false,
        message: `Invalid format: Invalid month '${month}'. Use: JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC`,
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    // Check FROM city (3 uppercase letters after month)
    const fromMatch = cleanedCmd.match(/^1\d{1,2}[A-Z]{3}([A-Z]{3})/);
    if (!fromMatch) {
      return {
        valid: false,
        message: "Invalid format: FROM city must be 3 uppercase letters",
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    // Check TO city (3 uppercase letters after FROM)
    const toMatch = cleanedCmd.match(/^1\d{1,2}[A-Z]{3}[A-Z]{3}([A-Z]{3})/);
    if (!toMatch) {
      return {
        valid: false,
        message: "Invalid format: TO city must be 3 uppercase letters",
        suggestion:
          "Format: 1[DD][MON][FROM][TO][AIRLINE]. Example: 115JUNDACBKK BG",
      };
    }

    // Check airline (optional - 3 uppercase letters after TO)
    // Airline is optional, so we don't require it in validation
    // It will be checked during parsing if the command length indicates it's present

    return { valid: true, message: "Valid format" };
  }

  // STEP:2.0 Validate seat sell format: 0[Number of Passenger][RBD][Serial Number]
  private static isSeatSell(cmd: string): boolean {
    return /^0\d*/.test(cmd) && !cmd.includes("OSI");
  }

  // Availability check
  // STEP:1.2 Parse availability check command and return flights data
  private static parseAvailability(cmd: string) {
    // Remove spaces for parsing
    const cleanedCmd = cmd.replace(/\s+/g, "");

    // Parse format: 1[DD][MON][FROM][TO] or 1[DD][MON][FROM][TO][AIRLINE]
    // Airline is optional - check if command has airline (13-15 chars) or not (11-12 chars)
    // Airline can be 2 or 3 characters (TG, MH, SQ, etc.) - NO "Y" prefix required
    const hasAirline = cleanedCmd.length >= 13;

    let date: string,
      month: string,
      origin: string,
      destination: string,
      airline: string | null = null;

    if (hasAirline) {
      // Parse with airline: 1[DD][MON][FROM][TO][AIRLINE]
      // Try to match with 3-char airline first, then 2-char
      let match = cleanedCmd.match(
        /^1(\d{1,2})([A-Z]{3})([A-Z]{3})([A-Z]{3})([A-Z]{3})$/
      );

      if (!match) {
        // Try with 2-character airline
        match = cleanedCmd.match(
          /^1(\d{1,2})([A-Z]{3})([A-Z]{3})([A-Z]{3})([A-Z]{2})$/
        );
      }

      if (!match) {
        return {
          flights: [],
          date: "",
          route: "",
          origin: "",
          destination: "",
          airline: "",
        };
      }

      date = match[1].padStart(2, "0");
      month = match[2];
      origin = match[3];
      destination = match[4];
      airline = match[5]; // 2 or 3 character airline code, NO "Y" prefix
    } else {
      // Parse without airline: 1[DD][MON][FROM][TO]
      const match = cleanedCmd.match(
        /^1(\d{1,2})([A-Z]{3})([A-Z]{3})([A-Z]{3})$/
      );

      if (!match) {
        return {
          flights: [],
          date: "",
          route: "",
          origin: "",
          destination: "",
          airline: "",
        };
      }

      date = match[1].padStart(2, "0");
      month = match[2];
      origin = match[3];
      destination = match[4];
      airline = null; // No airline specified
    }

    const searchDate = `${date}${month}`; // Format: "20JUN"

    // Strictly filter flights based on [DD][MON][FROM][TO][AIRLINE] pattern
    // Match date, exact origin and destination (including transit flights), and airline code
    // Use case-insensitive matching for origin and destination
    const originUpper = origin.toUpperCase();
    const destinationUpper = destination.toUpperCase();

    let filteredFlights = mockFlights.filter((flight) => {
      // Match date: flight must have the same date (case-sensitive for date format)
      const dateMatch = flight.date === searchDate;

      // Match origin: flight origin must match search origin (case-insensitive)
      const originMatch = flight.origin.toUpperCase() === originUpper;

      // Match destination: flight final destination must match search destination (case-insensitive)
      // This includes both direct flights and transit flights (where transit is intermediate)
      const destinationMatch =
        flight.destination.toUpperCase() === destinationUpper;

      // First filter by date, origin, and destination
      if (!dateMatch || !originMatch || !destinationMatch) {
        return false;
      }

      return true;
    });

    // Then filter by airline if provided
    // If airline is null/empty, show all flights (airline filter is optional)
    const shouldFilterByAirline = airline !== null && airline.trim() !== "";

    if (shouldFilterByAirline) {
      // Airline code provided - filter by exact match or partial match
      // No "Y" prefix is required or added - airline is used as-is
      const airlineUpper = airline!.toUpperCase().trim();

      // Some codes might be generic codes or should match all (but not common, so removed default generic codes)
      // User can still use specific airline codes like TG, MH, SQ, etc.

      // Filter by airline - match exactly or by prefix
      filteredFlights = filteredFlights.filter((flight) => {
        // Match airline: check if airline code is part of flight airline or matches exactly
        // Handle both single airline (TG) and combined (MH/FY) formats
        const airlineCodes = flight.airline.split("/");
        return airlineCodes.some((code) => {
          const codeUpper = code.toUpperCase();
          const searchUpper = airlineUpper;

          // Try multiple matching strategies:
          // 1. Exact match (case-insensitive) - most common for 2-char codes like TG, MH, SQ
          if (codeUpper === searchUpper) return true;

          // 2. Match first 2 characters (if search is 2 chars and code is 2+ chars)
          if (searchUpper.length === 2 && codeUpper.length >= 2) {
            if (codeUpper.substring(0, 2) === searchUpper) return true;
          }

          // 3. Match if search code is contained in flight airline code
          if (codeUpper.includes(searchUpper)) return true;

          return false;
        });
      });
    }
    // If airline is null/empty, show all flights that match date/origin/destination

    return {
      flights: filteredFlights,
      date: `${date}${month}`,
      route: `${origin}/${destination}`,
      origin,
      destination,
      airline: airline || "",
    };
  }

  // STEP:2.1 Validate seat sell format: 0[Number of Passenger][RBD][Serial Number]
  private static validateSeatSellFormat(
    cmd: string,
    availableFlights: Flight[]
  ): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    // Pattern: 0[Number of Passenger][RBD][Serial Number]
    // Example: 01Y1, 02K2, 01CC1 (invalid - CC starts with C)
    // Minimum length: 0 + 1 (passenger) + 1 (RBD) + 1 (serial) = 4
    // Maximum length: 0 + 1 (passenger) + 2 (RBD) + 2 (serial) = 5 or more

    if (!cmd.startsWith("0")) {
      return {
        valid: false,
        message: "Invalid format: Seat sell command must start with '0'",
        suggestion: "Format: 0[Number of Passenger][RBD][Serial Number]",
      };
    }

    // Extract components: 0[Number of Passenger][RBD][Serial Number]
    // After '0', we need at least 3 characters: passenger number, RBD, and serial number
    const rest = cmd.substring(1);
    if (rest.length < 3) {
      return {
        valid: false,
        message: "Invalid format: Command too short after '0'",
        suggestion:
          "Format: 0[Number of Passenger][RBD][Serial Number]. Example: 01Y1",
      };
    }

    // Extract passenger number (first digit after '0')
    // Note: For 10 passengers, the format would be "00" or we need to handle it differently
    // Currently supporting 1-9 as single digit, but validation allows 1-10
    const passengerMatch = rest.match(/^(\d)/);
    if (!passengerMatch) {
      return {
        valid: false,
        message: "Invalid format: Number of passengers must be a digit (1-10)",
        suggestion: "Format: 0[Number of Passenger][RBD][Serial Number]",
      };
    }

    const passengerCount = parseInt(passengerMatch[1], 10);
    if (passengerCount < 1 || passengerCount > 10) {
      return {
        valid: false,
        message: `Invalid format: Number of passengers must be 1-10, got ${passengerCount}`,
        suggestion: "Format: 0[Number of Passenger][RBD][Serial Number]",
      };
    }

    // Extract RBD (class) - can be 1 or 2 characters
    // After passenger number, RBD is the next 1-2 uppercase letters
    const rbdMatch = rest.match(/^\d([A-Z]{1,2})/);
    if (!rbdMatch) {
      return {
        valid: false,
        message: "Invalid format: RBD (class) must be 1-2 uppercase letters",
        suggestion: "Format: 0[Number of Passenger][RBD][Serial Number]",
      };
    }

    const rbd = rbdMatch[1];

    // Check if RBD starts with '0' or 'C' - these cannot be selected
    if (rbd.startsWith("0") || rbd.startsWith("C")) {
      return {
        valid: false,
        message: `Invalid RBD: Classes starting with '0' or 'C' cannot be selected. Got '${rbd}'`,
        suggestion:
          "Please select a valid class that doesn't start with '0' or 'C'",
      };
    }

    // Extract serial number (flight ID) - remaining digits after RBD
    const serialMatch = rest.match(/^\d[A-Z]{1,2}(\d+)/);
    if (!serialMatch) {
      return {
        valid: false,
        message: "Invalid format: Serial Number (flight ID) is required",
        suggestion: "Format: 0[Number of Passenger][RBD][Serial Number]",
      };
    }

    const serialNumber = serialMatch[1];
    const serialIndex = parseInt(serialNumber, 10);

    // Serial Number is the 1-based index position in the availability results array
    // So "1" means first flight (index 0), "2" means second flight (index 1), etc.
    if (serialIndex < 1 || serialIndex > availableFlights.length) {
      return {
        valid: false,
        message: `Invalid Serial Number: Flight at position '${serialNumber}' not found. Available positions: 1-${availableFlights.length}`,
        suggestion: `Please use a valid serial number (1-${availableFlights.length}) from the availability results`,
      };
    }

    // Get flight by index (convert 1-based to 0-based)
    const flight = availableFlights[serialIndex - 1];
    if (!flight) {
      return {
        valid: false,
        message: `Invalid Serial Number: Flight at position '${serialNumber}' not found`,
        suggestion: `Please use a valid serial number (1-${availableFlights.length}) from the availability results`,
      };
    }

    // Check if RBD exists in the flight's class list
    const flightClasses = flight.class.split(" ").filter(Boolean);
    const rbdExists = flightClasses.some((cls) => {
      // Extract class code (letters before numbers)
      const classCode = cls.match(/^([A-Z]{1,2})/)?.[1];
      return classCode === rbd;
    });

    if (!rbdExists) {
      return {
        valid: false,
        message: `Invalid RBD: Class '${rbd}' not available for flight ${flight.flightNumber}`,
        suggestion: `Available classes for this flight: ${flight.class}`,
      };
    }

    return { valid: true, message: "Valid format" };
  }

  // STEP:2.2 Parse seat sell command and return booking data
  private static parseSeatSell(
    cmd: string,
    availableFlights: Flight[]
  ): {
    success: boolean;
    message: string;
    booking?: {
      numberOfPassengers: number;
      rbd: string;
      serialNumber: string;
      flight: Flight;
      command: string;
    };
    flightNumber?: string;
  } {
    const rest = cmd.substring(1);
    const passengerMatch = rest.match(/^(\d)/);
    const rbdMatch = rest.match(/^\d([A-Z]{1,2})/);
    const serialMatch = rest.match(/^\d[A-Z]{1,2}(\d+)/);

    if (!passengerMatch || !rbdMatch || !serialMatch) {
      return {
        success: false,
        message: "Failed to parse seat sell command",
      };
    }

    const numberOfPassengers = parseInt(passengerMatch[1], 10);
    const rbd = rbdMatch[1];
    const serialNumber = serialMatch[1];
    const serialIndex = parseInt(serialNumber, 10);

    // Serial Number is the 1-based index position in the availability results array
    // Get flight by index (convert 1-based to 0-based)
    if (serialIndex < 1 || serialIndex > availableFlights.length) {
      return {
        success: false,
        message: `Flight at position '${serialNumber}' not found`,
      };
    }

    const flight = availableFlights[serialIndex - 1];
    if (!flight) {
      return {
        success: false,
        message: `Flight at position '${serialNumber}' not found`,
      };
    }

    return {
      success: true,
      message: "SEGMENTS ADDED TO PNR",
      booking: {
        numberOfPassengers,
        rbd,
        serialNumber,
        flight,
        command: cmd,
      },
      flightNumber: flight.flightNumber,
    };
  }

  // STEP:3 Parse WPA command - Get fare for booked class from localStorage
  private static parseWPA() {
    if (typeof window === "undefined") {
      return {
        success: false,
        message: "No booking found in localStorage",
      };
    }

    const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");

    if (bookings.length === 0) {
      return {
        success: false,
        message: "No segments found in PNR. Please add segments first.",
      };
    }

    // Get the most recent booking
    const latestBooking = bookings[bookings.length - 1];
    const { flight, rbd, numberOfPassengers } = latestBooking;

    // Get full flight data from mockFlights to ensure fareDetails are available
    const fullFlight = mockFlights.find((f) => f.id === flight.id);
    if (!fullFlight) {
      return {
        success: false,
        message: `Flight ${flight.flightNumber} not found`,
      };
    }

    // Find fare detail for the booked class
    if (!fullFlight.fareDetails || fullFlight.fareDetails.length === 0) {
      return {
        success: false,
        message: `No fare details available for flight ${flight.flightNumber}`,
      };
    }

    const fareDetail = fullFlight.fareDetails.find((f: any) => f.class === rbd);
    if (!fareDetail) {
      return {
        success: false,
        message: `No fare details found for class ${rbd} on flight ${flight.flightNumber}`,
      };
    }

    return {
      success: true,
      booking: { ...latestBooking, flight: fullFlight },
      fareDetail,
      passengerType: "ADT",
      passengerCount: numberOfPassengers,
    };
  }

  // STEP:4 Parse WPNCB command - Find lowest fare across all classes
  private static parseWPNCB(availableFlights: Flight[]) {
    if (availableFlights.length === 0) {
      return {
        success: false,
        message: "No flights available",
      };
    }

    // Collect all fare details from all flights
    const allFareDetails: Array<{
      flight: Flight;
      fareDetail: any;
    }> = [];

    availableFlights.forEach((flight) => {
      if (flight.fareDetails && flight.fareDetails.length > 0) {
        flight.fareDetails.forEach((fareDetail) => {
          allFareDetails.push({ flight, fareDetail });
        });
      }
    });

    if (allFareDetails.length === 0) {
      return {
        success: false,
        message: "No fare details available for any flights",
      };
    }

    // Find the lowest fare
    const lowestFare = allFareDetails.reduce((lowest, current) => {
      return current.fareDetail.totalBDT < lowest.fareDetail.totalBDT
        ? current
        : lowest;
    }, allFareDetails[0]);

    // Also get all fares for comparison
    const allFares = allFareDetails.map((item) => ({
      flight: item.flight,
      fareDetail: item.fareDetail,
    }));

    return {
      success: true,
      lowestFare,
      allFares: allFares.sort(
        (a, b) => a.fareDetail.totalBDT - b.fareDetail.totalBDT
      ),
    };
  }

  // STEP:5 Validate name insert format: -[Last Name]/[First Name][Space][Name Title]
  private static validateNameInsertFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    // Must start with "-"
    if (!cmd.startsWith("-")) {
      return {
        valid: false,
        message: "Invalid format: Name insert must start with '-'",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    // Check if there's a "/" separator
    if (!cmd.includes("/")) {
      return {
        valid: false,
        message:
          "Invalid format: Missing '/' separator between Last Name and First Name",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    // Split by "/"
    const parts = cmd.substring(1).split("/"); // Remove the "-" prefix first
    if (parts.length !== 2) {
      return {
        valid: false,
        message:
          "Invalid format: Expected format -[Last Name]/[First Name][Space][Name Title]",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    const lastName = parts[0].trim();
    const firstNameAndTitle = parts[1].trim();

    // Check if last name is not empty
    if (!lastName || lastName.length === 0) {
      return {
        valid: false,
        message: "Invalid format: Last Name cannot be empty",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    // Check if first name and title part is not empty
    if (!firstNameAndTitle || firstNameAndTitle.length === 0) {
      return {
        valid: false,
        message: "Invalid format: First Name and Title cannot be empty",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    // Check if there's a space before the title
    // Title should be at the end (MR, MRS, MS)
    const titleMatch = firstNameAndTitle.match(/\s+(MR|MRS|MS)$/i);
    if (!titleMatch) {
      return {
        valid: false,
        message:
          "Invalid format: Must include a space before title (MR/MRS/MS)",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    // Extract first name (everything before the title)
    const firstName = firstNameAndTitle.substring(0, titleMatch.index).trim();

    // Check if first name is not empty
    if (!firstName || firstName.length === 0) {
      return {
        valid: false,
        message: "Invalid format: First Name cannot be empty",
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    // Validate title is one of: MR, MRS, MS (case-insensitive)
    const title = titleMatch[1].toUpperCase();
    const validTitles = ["MR", "MRS", "MS"];
    if (!validTitles.includes(title)) {
      return {
        valid: false,
        message: `Invalid format: Title must be one of: MR, MRS, MS. Got: ${titleMatch[1]}`,
        suggestion:
          "Format: -[Last Name]/[First Name][Space][Name Title]. Example: -HOSSEN/TUSHAR MR",
      };
    }

    return { valid: true, message: "Valid format" };
  }

  // STEP:5.1 Parse name insert command
  private static parseNameInsert(cmd: string): {
    success: boolean;
    message: string;
    passengerName?: {
      lastName: string;
      firstName: string;
      title: string;
      formattedName: string; // Format: -KHAN/MD TUSHAR MR<<
    };
  } {
    // Remove leading "-"
    const parts = cmd.substring(1).split("/");
    const lastName = parts[0].trim();
    const firstNameAndTitle = parts[1].trim();

    // Extract title (MR, MRS, MS)
    const titleMatch = firstNameAndTitle.match(/\s+(MR|MRS|MS)$/i);
    const title = titleMatch ? titleMatch[1].toUpperCase() : "";
    const firstName = titleMatch
      ? firstNameAndTitle.substring(0, titleMatch.index).trim()
      : firstNameAndTitle.trim();

    // Format the name as shown in the image: -KHAN/MD TUSHAR MR<<
    const formattedName = `-${lastName.toUpperCase()}/${firstName.toUpperCase()} ${title}<<`;

    return {
      success: true,
      message: "NAME INSERTED SUCCESSFULLY",
      passengerName: {
        lastName: lastName.toUpperCase(),
        firstName: firstName.toUpperCase(),
        title,
        formattedName,
      },
    };
  }

  // STEP:5.2 Validate agency details format: 9[Space][Agency Name][Space][Agency Phone][Space][Reservation Officer Name]
  private static validateAgencyDetailsFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    // Must start with 9 and have exactly three parts after it
    if (!cmd.startsWith("9 ") && cmd !== "9") {
      return {
        valid: false,
        message: "Invalid format: Must start with '9 ' followed by details",
        suggestion:
          "Format: 9 [Agency Name] [Agency Phone] [Reservation Officer Name]",
      };
    }

    const tokens = cmd.split(/\s+/).filter(Boolean);
    // Expected tokens: ["9", agencyName, agencyPhone, officerName]
    if (tokens.length !== 4) {
      return {
        valid: false,
        message: "Invalid format: Provide Agency Name, Phone and Officer Name",
        suggestion: "Format: 9 FLYGER 01717452756 IMRAN",
      };
    }

    const [, agencyName, agencyPhone, officerName] = tokens;

    if (!/^[A-Z][A-Z0-9\- ]{1,}$/.test(agencyName)) {
      return {
        valid: false,
        message: "Invalid Agency Name",
        suggestion: "Use uppercase letters/numbers, e.g., FLYGER",
      };
    }

    if (!/^0\d{10,14}$/.test(agencyPhone)) {
      return {
        valid: false,
        message: "Invalid phone. Use leading 0 and 11-15 digits",
        suggestion: "Example: 01717452756",
      };
    }

    if (!/^[A-Z][A-Z0-9\-]{1,}$/.test(officerName)) {
      return {
        valid: false,
        message: "Invalid Reservation Officer Name",
        suggestion: "Use uppercase letters/numbers, e.g., IMRAN",
      };
    }

    return { valid: true, message: "Valid format" };
  }

  // STEP:5.3 Parse agency details command
  private static parseAgencyDetails(cmd: string): {
    success: boolean;
    message: string;
    agencyDetails?: {
      agencyName: string;
      agencyPhone: string;
      reservationOfficerName: string;
      formatted: string; // 9 FLYGER 01717452756 IMRAN«
    };
  } {
    const tokens = cmd.split(/\s+/).filter(Boolean);
    const agencyName = tokens[1].toUpperCase();
    const agencyPhone = tokens[2];
    const reservationOfficerName = tokens[3].toUpperCase();

    const formatted = `9 ${agencyName} ${agencyPhone} ${reservationOfficerName}«`;

    return {
      success: true,
      message: "AGENCY DETAILS ADDED",
      agencyDetails: {
        agencyName,
        agencyPhone,
        reservationOfficerName,
        formatted,
      },
    };
  }

  // STEP:5.4 Validate ticketing format - must be exactly 7TAW/
  private static validateTicketingFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    if (cmd !== "7TAW/") {
      return {
        valid: false,
        message: "Invalid format: Ticketing must be exactly '7TAW/'",
        suggestion: "Format: 7TAW/",
      };
    }
    return { valid: true, message: "Valid format" };
  }

  // STEP:5.5 Parse ticketing
  private static parseTicketing(cmd: string): {
    success: boolean;
    message: string;
    ticketing?: { formatted: string };
  } {
    return {
      success: true,
      message: "TICKETING ADDED",
      ticketing: { formatted: `${cmd}«` },
    };
  }

  // STEP:6 Build PNR data from localStorage for ER
  private static parseER() {
    if (typeof window === "undefined") {
      return { success: false, message: "Not available" };
    }

    const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");
    const passengerName = JSON.parse(
      localStorage.getItem("gds_passenger_name") || "null"
    );
    const agency = JSON.parse(
      localStorage.getItem("gds_agency_details") || "null"
    );
    const ticketing = JSON.parse(
      localStorage.getItem("gds_ticketing") || "null"
    );
    const received = JSON.parse(localStorage.getItem("gds_received") || "null");

    // Generate or reuse PNR
    let pnr = localStorage.getItem("gds_pnr");
    if (!pnr) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      pnr = Array.from({ length: 6 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
      localStorage.setItem("gds_pnr", pnr);
    }

    const latest = bookings[bookings.length - 1];
    const flight = latest?.flight;
    const rbd = latest?.rbd || "";

    // Helper day of week
    const getDow = (dateStr: string) => {
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      try {
        const day = parseInt(dateStr.substring(0, 2), 10);
        const monthStr = dateStr.substring(2, 5);
        const months: any = {
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
        const year = new Date().getFullYear();
        const d = new Date(year, months[monthStr], day);
        return days[d.getDay()];
      } catch {
        return "";
      }
    };

    // Build formatted lines
    const nameLine = passengerName
      ? `1.${passengerName.formattedName.replace(/^-/, "")}`
      : "";

    const segLine = flight
      ? `1 ${flight.airline} ${flight.flightNumber} ${rbd}${
          " " + flight.date
        } ${getDow(flight.date)} ${flight.origin}${flight.destination} HK1 ${
          flight.departureTime
        } ${flight.arrivalTime} /${flight.airline} /E`
      : "";

    const tktLimit = ticketing ? "1.TAW/" : "";

    const phones =
      agency && flight
        ? `1.${flight.origin} ${agency.agencyName} ${agency.agencyPhone} ${agency.reservationOfficerName}`
        : "";

    const receivedFrom = received ? `RECEIVED FROM - ${received.officer}` : "";

    return {
      success: true,
      pnr,
      nameLine,
      segLine,
      tktLimit,
      phones,
      receivedFrom,
      raw: { bookings, passengerName, agency, ticketing, received },
    };
  }

  // STEP:5.6 Validate received format - must be '6 ' + NAME
  private static validateReceivedFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    const parts = cmd.split(/\s+/).filter(Boolean);
    if (parts.length !== 2 || parts[0] !== "6") {
      return {
        valid: false,
        message:
          "Invalid format: Received must be '6 [Reservation Officer Name]'",
        suggestion: "Example: 6 IMRAN",
      };
    }
    const name = parts[1];
    if (!/^[A-Z][A-Z0-9\-]{1,}$/.test(name)) {
      return {
        valid: false,
        message: "Invalid officer name. Use uppercase letters/numbers",
        suggestion: "Example: 6 IMRAN",
      };
    }
    return { valid: true, message: "Valid format" };
  }

  // STEP:5.7 Parse received
  private static parseReceived(cmd: string): {
    success: boolean;
    message: string;
    received?: { formatted: string; officer: string };
  } {
    const officer = cmd.split(/\s+/)[1].toUpperCase();
    return {
      success: true,
      message: "RECEIVED ADDED",
      received: { formatted: `6${officer}«`, officer },
    };
  }

  // STEP:5.8 Validate mobile number format: 3CTCM/[Passenger Mobile Number]
  private static validateMobileNumberFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    if (!cmd.startsWith("3CTCM/")) {
      return {
        valid: false,
        message: "Invalid format: Mobile number must start with '3CTCM/'",
        suggestion:
          "Format: 3CTCM/[Passenger Mobile Number]. Example: 3CTCM/01919919191",
      };
    }

    const mobileNumber = cmd.substring(6); // Remove "3CTCM/"

    if (!mobileNumber || mobileNumber.length === 0) {
      return {
        valid: false,
        message: "Invalid format: Mobile number is required",
        suggestion:
          "Format: 3CTCM/[Passenger Mobile Number]. Example: 3CTCM/01919919191",
      };
    }

    // Validate mobile number: should be 11 digits starting with 0
    if (!/^0\d{10}$/.test(mobileNumber)) {
      return {
        valid: false,
        message: "Invalid mobile number: Must be 11 digits starting with 0",
        suggestion: "Example: 3CTCM/01919919191",
      };
    }

    return { valid: true, message: "Valid format" };
  }

  // STEP:5.9 Parse mobile number command
  private static parseMobileNumber(cmd: string): {
    success: boolean;
    message: string;
    mobileNumber?: {
      formatted: string;
      number: string;
    };
  } {
    const mobileNumber = cmd.substring(6); // Remove "3CTCM/"
    const formatted = `${cmd}«`;

    return {
      success: true,
      message: "MOBILE NUMBER ADDED",
      mobileNumber: {
        formatted,
        number: mobileNumber,
      },
    };
  }

  // STEP:5.10 Validate email address format: 3CTCE/[Passenger Email Address]
  private static validateEmailAddressFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    if (!cmd.startsWith("3CTCE/")) {
      return {
        valid: false,
        message: "Invalid format: Email address must start with '3CTCE/'",
        suggestion:
          "Format: 3CTCE/[Passenger Email Address]. Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    const emailAddress = cmd.substring(6); // Remove "3CTCE/"

    if (!emailAddress || emailAddress.length === 0) {
      return {
        valid: false,
        message: "Invalid format: Email address is required",
        suggestion:
          "Format: 3CTCE/[Passenger Email Address]. Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    // Validate email format strictly: LOCAL//DOMAIN.COM
    // Must have exactly '//' (double slash) instead of '@'
    // Must end with '.COM' (uppercase, not .co or other TLDs)
    // All parts must be uppercase

    // Check if contains '@' - reject it
    if (emailAddress.includes("@")) {
      return {
        valid: false,
        message: "Invalid format: Use '//' instead of '@'",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    // Check if has exactly '//' (double slash)
    if (!emailAddress.includes("//")) {
      return {
        valid: false,
        message: "Invalid format: Must use '//' (double slash) instead of '@'",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    // Split by '//' to get local and domain parts
    const parts = emailAddress.split("//");
    if (parts.length !== 2) {
      return {
        valid: false,
        message: "Invalid format: Must have exactly one '//' separator",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    const localPart = parts[0];
    const domainPart = parts[1];

    // Validate local part: uppercase letters, numbers, dots, underscores, hyphens
    if (!/^[A-Z0-9._\-]+$/.test(localPart) || localPart.length === 0) {
      return {
        valid: false,
        message:
          "Invalid local part. Use uppercase letters, numbers, dots, underscores, or hyphens",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    // Validate domain part: must end with .COM (uppercase, exactly COM)
    if (!domainPart.endsWith(".COM")) {
      return {
        valid: false,
        message: "Invalid format: Domain must end with '.COM' (uppercase)",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    // Extract domain name (without .COM)
    const domainName = domainPart.substring(0, domainPart.length - 4);
    if (domainName.length === 0) {
      return {
        valid: false,
        message: "Invalid format: Domain name cannot be empty",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    // Validate domain name: uppercase letters, numbers, dots, hyphens
    if (!/^[A-Z0-9.\-]+$/.test(domainName)) {
      return {
        valid: false,
        message:
          "Invalid domain name. Use uppercase letters, numbers, dots, or hyphens",
        suggestion: "Example: 3CTCE/EXAMPLE//GMAIL.COM",
      };
    }

    return { valid: true, message: "Valid format" };
  }

  // STEP:5.11 Parse email address command
  private static parseEmailAddress(cmd: string): {
    success: boolean;
    message: string;
    emailAddress?: {
      formatted: string;
      email: string;
    };
  } {
    const emailAddress = cmd.substring(6); // Remove "3CTCE/"
    const formatted = `${cmd}«`;

    return {
      success: true,
      message: "EMAIL ADDRESS ADDED",
      emailAddress: {
        formatted,
        email: emailAddress,
      },
    };
  }

  // STEP:5.12 Validate DOCS insert format
  private static validateDocsInsertFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion?: string;
  } {
    // Remove prefix
    const body = cmd.substring(6); // after "3DOCS/"
    const parts = body.split("/");
    if (parts.length !== 9) {
      return {
        valid: false,
        message: "Invalid DOCS: Must have 9 fields after 3DOCS/",
        suggestion:
          "Example: 3DOCS/P/BGD/A1234567890/BGD/22JUN98/M/25DEC30/HOSSEN/TUSHAR",
      };
    }

    const [
      ptype,
      country,
      passportNo,
      nationality,
      dob,
      gender,
      expiry,
      lastName,
      firstName,
    ] = parts;

    if (!/^[A-Z]$/.test(ptype)) {
      return {
        valid: false,
        message: "Invalid passport type (A-Z)",
        suggestion: "Use 'P'",
      };
    }
    if (!/^[A-Z]{3}$/.test(country)) {
      return {
        valid: false,
        message: "Invalid country code (3 letters)",
        suggestion: "BGD",
      };
    }
    if (!/^[A-Z0-9]{6,}$/.test(passportNo)) {
      return {
        valid: false,
        message: "Invalid passport number",
        suggestion: "A1234567890",
      };
    }
    if (!/^[A-Z]{3}$/.test(nationality)) {
      return {
        valid: false,
        message: "Invalid nationality (3 letters)",
        suggestion: "BGD",
      };
    }
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[A-Z]{3}\d{2}$/; // 22JUN98
    if (!dateRegex.test(dob)) {
      return {
        valid: false,
        message: "Invalid DOB (DDMONYY)",
        suggestion: "22JUN98",
      };
    }
    if (!/^[MF]$/.test(gender)) {
      return { valid: false, message: "Invalid gender (M/F)", suggestion: "M" };
    }
    if (!dateRegex.test(expiry)) {
      return {
        valid: false,
        message: "Invalid expiry (DDMONYY)",
        suggestion: "25DEC30",
      };
    }
    if (!/^[A-Z]+$/.test(lastName) || !/^[A-Z]+$/.test(firstName)) {
      return {
        valid: false,
        message: "Invalid name (uppercase letters only)",
        suggestion: "HOSSEN/TUSHAR",
      };
    }

    return { valid: true, message: "Valid format" };
  }

  // STEP:5.13 Parse DOCS insert
  private static parseDocsInsert(cmd: string): {
    success: boolean;
    message: string;
    docs?: {
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
    };
  } {
    const body = cmd.substring(6);
    const [
      ptype,
      country,
      passportNo,
      nationality,
      dob,
      gender,
      expiry,
      lastName,
      firstName,
    ] = body.split("/");
    const formatted = `${cmd}«`;
    return {
      success: true,
      message: "DOCS INSERTED",
      docs: {
        formatted,
        passportType: ptype,
        countryCode: country,
        passportNumber: passportNo,
        nationality,
        dateOfBirth: dob,
        gender,
        passportExpiry: expiry,
        lastName,
        firstName,
      },
    };
  }

  // STEP:6 Parse PQ command - Save price quote to localStorage
  private static parsePQ() {
    if (typeof window === "undefined") {
      return { success: false, message: "Not available" };
    }

    const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");
    if (bookings.length === 0) {
      return {
        success: false,
        message: "No segments found in PNR. Please add segments first.",
      };
    }

    const passengerName = JSON.parse(
      localStorage.getItem("gds_passenger_name") || "null"
    );

    // Get the most recent booking
    const latestBooking = bookings[bookings.length - 1];
    const { flight, rbd, numberOfPassengers } = latestBooking;

    // Get full flight data from mockFlights to ensure fareDetails are available
    const fullFlight = mockFlights.find((f) => f.id === flight.id);
    if (!fullFlight) {
      return {
        success: false,
        message: `Flight ${flight.flightNumber} not found`,
      };
    }

    // Find fare detail for the booked class
    if (!fullFlight.fareDetails || fullFlight.fareDetails.length === 0) {
      return {
        success: false,
        message: `No fare details available for flight ${fullFlight.flightNumber}`,
      };
    }

    const fareDetail = fullFlight.fareDetails.find((f: any) => f.class === rbd);
    if (!fareDetail) {
      return {
        success: false,
        message: `No fare details found for class ${rbd} on flight ${fullFlight.flightNumber}`,
      };
    }

    // Build passenger name line
    const passengerNameLine = passengerName
      ? `1.${passengerName.lastName}/${passengerName.firstName} ${passengerName.title}`
      : "";

    // Calculate ticketing deadline (30 days from now)
    const ticketingDeadline = new Date();
    ticketingDeadline.setDate(ticketingDeadline.getDate() + 30);
    const day = ticketingDeadline.getDate().toString().padStart(2, "0");
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = months[ticketingDeadline.getMonth()];
    const year = ticketingDeadline.getFullYear().toString().substring(2);
    const tktDeadline = `${day}${month}${year}/2359`;

    // Build flight segment line
    const getDow = (dateStr: string) => {
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      try {
        const day = parseInt(dateStr.substring(0, 2), 10);
        const monthStr = dateStr.substring(2, 5);
        const months: any = {
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
        const year = new Date().getFullYear();
        const d = new Date(year, months[monthStr], day);
        if (d < new Date()) d.setFullYear(year + 1);
        return days[d.getDay()];
      } catch {
        return "";
      }
    };

    // Simplified segment line format matching the image
    const dateOnly = fullFlight.date.substring(0, 5); // e.g., "12JAN" from "12JAN"
    const timeOnly = fullFlight.departureTime.replace(":", ""); // e.g., "0825" from "08:25"
    const segmentLine = `1 ${fullFlight.origin}${fullFlight.destination} ${
      fullFlight.airline
    } ${fullFlight.flightNumber.replace(
      /\s+/g,
      ""
    )}${rbd} ${dateOnly} ${timeOnly} ${fullFlight.destination}`;

    // Build fare construction
    const fareConstruction = `${fullFlight.origin} ${fullFlight.airline} ${
      fullFlight.destination
    }${fareDetail.baseFareUSD.toFixed(2)}NUC${fareDetail.nuc.toFixed(
      2
    )}END ROE${fareDetail.roe.toFixed(2)}`;

    // Save only fareDetail to localStorage (not the entire price quote object)
    if (typeof window !== "undefined") {
      localStorage.setItem("gds_fare_detail", JSON.stringify(fareDetail));
      // Dispatch event for real-time updates
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // Return success response
    return {
      success: true,
      message: "PRICE QUOTE RECORD RETAINED",
      fareDetail,
    };
  }

  // STEP:7 Parse *PQ command - Display saved fare detail from localStorage
  private static parsePriceCheck() {
    if (typeof window === "undefined") {
      return { success: false, message: "Not available" };
    }

    const savedFareDetail = localStorage.getItem("gds_fare_detail");
    if (!savedFareDetail) {
      return {
        success: false,
        message:
          "No price quote found. Please run PQ first to save a price quote.",
      };
    }

    try {
      const fareDetail = JSON.parse(savedFareDetail);
      return {
        success: true,
        message: "PRICE QUOTE RECORD RETAINED",
        fareDetail,
      };
    } catch (e) {
      return {
        success: false,
        message: "Error reading price quote from storage",
      };
    }
  }

  // STEP:8 Validate Printer Designate format: Must be exactly PE*NL1L
  private static validatePrinterDesignateFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion: string;
  } {
    // Strict validation: Must be exactly "PE*NL1L" - nothing more, nothing less
    // Only this exact command is accepted, any variation will be rejected

    // Check if command is exactly "PE*NL1L"
    if (cmd !== "PE*NL1L") {
      return {
        valid: false,
        message: "Invalid format: Command must be exactly 'PE*NL1L'",
        suggestion: "Format: PE*NL1L",
      };
    }

    return { valid: true, message: "Valid format", suggestion: "" };
  }

  // STEP:9 Parse Printer Designate command - Generate CRT and PTR entries
  private static parsePrinterDesignate(cmd: string): {
    success: boolean;
    message: string;
    entries: Array<{
      lniata: string;
      type: "CRT" | "PTR";
      tapool: string;
      pool: string;
      ind: string;
    }>;
  } {
    const agencyCode = cmd.substring(3);

    // Generate 5 CRT entries
    const crtEntries = [];
    for (let i = 0; i < 5; i++) {
      // Generate LNIATA for CRT - can be based on booking data or random
      const lniata = this.generateLNIATA();
      crtEntries.push({
        lniata,
        type: "CRT" as const,
        tapool: "",
        pool: "",
        ind: "",
      });
    }

    // Generate 2 PTR entries with random LNIATA (6-character format only, no hyphen)
    const ptrEntries = [];
    const ptrNumbers: string[] = [];
    for (let i = 0; i < 2; i++) {
      const lniata = this.generatePTRLNIATA(); // Use special method for PTR (6 chars only)
      ptrNumbers.push(lniata);
      ptrEntries.push({
        lniata,
        type: "PTR" as const,
        tapool: "",
        pool: "",
        ind: "",
      });
    }

    // Save PTR numbers to localStorage for DSIV validation
    if (typeof window !== "undefined") {
      localStorage.setItem("gds_ptr_numbers", JSON.stringify(ptrNumbers));
      // Dispatch event for real-time updates
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    // Combine all entries (CRT first, then PTR)
    const allEntries = [...crtEntries, ...ptrEntries];

    return {
      success: true,
      message: "Printer designation list",
      entries: allEntries,
    };
  }

  // Helper method to generate random LNIATA (alphanumeric identifier)
  // Used for CRT entries - can have various formats
  private static generateLNIATA(): string {
    // Generate a random alphanumeric string
    // Format can be: 6 characters (e.g., "02A1F4") or with hyphen (e.g., "06124A-51", "F00AFE-FF")
    const formats = [
      () => {
        // 6 character format: "02A1F4"
        const chars = "0123456789ABCDEF";
        let result = "";
        for (let i = 0; i < 6; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      },
      () => {
        // Format with hyphen: "06124A-51"
        const chars = "0123456789ABCDEF";
        let part1 = "";
        for (let i = 0; i < 6; i++) {
          part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        let part2 = "";
        for (let i = 0; i < 2; i++) {
          part2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `${part1}-${part2}`;
      },
      () => {
        // Format with hyphen: "F00AFE-FF"
        const chars = "0123456789ABCDEF";
        let part1 = "";
        for (let i = 0; i < 6; i++) {
          part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        let part2 = "";
        for (let i = 0; i < 2; i++) {
          part2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `${part1}-${part2}`;
      },
    ];

    // Randomly select a format
    const selectedFormat = formats[Math.floor(Math.random() * formats.length)];
    return selectedFormat();
  }

  // Helper method to generate PTR LNIATA (6-character format only, no hyphen)
  // PTR entries must be exactly 6 characters: e.g., "30B6B2"
  private static generatePTRLNIATA(): string {
    const chars = "0123456789ABCDEF";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // STEP:10 Validate Printer Designate Confirm format: W*[Country Code]
  private static validatePrinterDesignateConfirmFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion: string;
  } {
    // Format: W*[Country Code]
    // Example: W*BD
    // Strict validation: Must be exactly W* followed by 2 uppercase letters

    // Check if command starts with W*
    if (!cmd.startsWith("W*")) {
      return {
        valid: false,
        message: "Invalid format: Command must start with 'W*'",
        suggestion: "Format: W*[Country Code], Example: W*BD",
      };
    }

    // Extract country code (everything after W*)
    const countryCode = cmd.substring(2);

    // Check if country code exists
    if (!countryCode || countryCode.trim().length === 0) {
      return {
        valid: false,
        message: "Invalid format: Country code is required after 'W*'",
        suggestion: "Format: W*[Country Code], Example: W*BD",
      };
    }

    // Check for any spaces in the command (not allowed)
    if (cmd.includes(" ")) {
      return {
        valid: false,
        message: "Invalid format: Spaces are not allowed in the command",
        suggestion: "Format: W*[Country Code], Example: W*BD",
      };
    }

    // Country code should be 2 uppercase letters (standard country code format)
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return {
        valid: false,
        message:
          "Invalid format: Country code must be exactly 2 uppercase letters",
        suggestion: "Format: W*[Country Code], Example: W*BD",
      };
    }

    // Ensure the entire command matches the pattern exactly
    if (!/^W\*[A-Z]{2}$/.test(cmd)) {
      return {
        valid: false,
        message: "Invalid format: Command format is incorrect",
        suggestion: "Format: W*[Country Code], Example: W*BD",
      };
    }

    return { valid: true, message: "Valid format", suggestion: "" };
  }

  // STEP:11 Parse Printer Designate Confirm command - Generate OK-[random number]
  private static parsePrinterDesignateConfirm(cmd: string): {
    success: boolean;
    message: string;
    countryCode: string;
    okNumber: string;
    formatted: string;
  } {
    const countryCode = cmd.substring(2);

    // Generate random 4-digit number (0000-9999)
    const randomNumber = Math.floor(Math.random() * 10000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");

    // Create OK-[number] format
    const okNumber = `OK-${formattedNumber}`;

    // Format the response: W*BD«
    const formatted = `${cmd}«`;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gds_printer_designate_confirm", okNumber);
      // Dispatch event for real-time updates
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    return {
      success: true,
      message: "Printer designation confirmed",
      countryCode,
      okNumber,
      formatted,
    };
  }

  // STEP:12 Validate DSIV format: DSIV[PTR NUMBER]
  private static validateDSIVFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion: string;
  } {
    // Format: DSIV[PTR NUMBER]
    // Example: DSIV30B6B2
    // PTR number must be exactly 6 alphanumeric characters (hexadecimal)

    // Check if command starts with DSIV
    if (!cmd.startsWith("DSIV")) {
      return {
        valid: false,
        message: "Invalid format: Command must start with 'DSIV'",
        suggestion: "Format: DSIV[PTR NUMBER], Example: DSIV30B6B2",
      };
    }

    // Extract PTR number (everything after DSIV)
    const ptrNumber = cmd.substring(4);

    // Check if PTR number exists
    if (!ptrNumber || ptrNumber.trim().length === 0) {
      return {
        valid: false,
        message: "Invalid format: PTR number is required after 'DSIV'",
        suggestion: "Format: DSIV[PTR NUMBER], Example: DSIV30B6B2",
      };
    }

    // Check for any spaces in the command (not allowed)
    if (cmd.includes(" ")) {
      return {
        valid: false,
        message: "Invalid format: Spaces are not allowed in the command",
        suggestion: "Format: DSIV[PTR NUMBER], Example: DSIV30B6B2",
      };
    }

    // PTR number should be exactly 6 hexadecimal characters (0-9, A-F)
    if (!/^[0-9A-F]{6}$/.test(ptrNumber)) {
      return {
        valid: false,
        message:
          "Invalid format: PTR number must be exactly 6 hexadecimal characters (0-9, A-F)",
        suggestion: "Format: DSIV[PTR NUMBER], Example: DSIV30B6B2",
      };
    }

    // Check if PTR number exists in localStorage (from PE*NL1L command)
    if (typeof window !== "undefined") {
      const storedPtrNumbers = localStorage.getItem("gds_ptr_numbers");
      if (!storedPtrNumbers) {
        return {
          valid: false,
          message:
            "Invalid: No PTR numbers found. Please run PE*NL1L first to generate PTR numbers.",
          suggestion: "Format: DSIV[PTR NUMBER], Example: DSIV30B6B2",
        };
      }

      try {
        const ptrNumbers: string[] = JSON.parse(storedPtrNumbers);
        if (!ptrNumbers.includes(ptrNumber)) {
          return {
            valid: false,
            message: `Invalid: PTR number '${ptrNumber}' not found. Available PTR numbers: ${ptrNumbers.join(
              ", "
            )}`,
            suggestion:
              "Please use a valid PTR number from the PE*NL1L command output.",
          };
        }
      } catch (e) {
        return {
          valid: false,
          message: "Invalid: Error reading PTR numbers from storage",
          suggestion: "Format: DSIV[PTR NUMBER], Example: DSIV30B6B2",
        };
      }
    }

    return { valid: true, message: "Valid format", suggestion: "" };
  }

  // STEP:13 Parse DSIV command - Assign PTR number
  private static parseDSIV(cmd: string): {
    success: boolean;
    message: string;
    ptrNumber: string;
    formatted: string;
  } {
    const ptrNumber = cmd.substring(4);

    // Format the response: DSIV6B8893«
    const formatted = `${cmd}«`;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gds_dsiv_ptr", ptrNumber);
      // Dispatch event for real-time updates
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    return {
      success: true,
      message: "OK PTR ASSIGNED",
      ptrNumber,
      formatted,
    };
  }

  // STEP:14 Validate PTR Assigned format: PTR/[PTR NUMBER]
  private static validatePTRAssignedFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion: string;
  } {
    // Format: PTR/[PTR NUMBER]
    // Example: PTR/30B6B2
    // PTR number must be exactly 6 alphanumeric characters (hexadecimal)

    // Check if command starts with PTR/
    if (!cmd.startsWith("PTR/")) {
      return {
        valid: false,
        message: "Invalid format: Command must start with 'PTR/'",
        suggestion: "Format: PTR/[PTR NUMBER], Example: PTR/30B6B2",
      };
    }

    // Extract PTR number (everything after PTR/)
    const ptrNumber = cmd.substring(4);

    // Check if PTR number exists
    if (!ptrNumber || ptrNumber.trim().length === 0) {
      return {
        valid: false,
        message: "Invalid format: PTR number is required after 'PTR/'",
        suggestion: "Format: PTR/[PTR NUMBER], Example: PTR/30B6B2",
      };
    }

    // Check for any spaces in the command (not allowed)
    if (cmd.includes(" ")) {
      return {
        valid: false,
        message: "Invalid format: Spaces are not allowed in the command",
        suggestion: "Format: PTR/[PTR NUMBER], Example: PTR/30B6B2",
      };
    }

    // PTR number should be exactly 6 hexadecimal characters (0-9, A-F)
    if (!/^[0-9A-F]{6}$/.test(ptrNumber)) {
      return {
        valid: false,
        message:
          "Invalid format: PTR number must be exactly 6 hexadecimal characters (0-9, A-F)",
        suggestion: "Format: PTR/[PTR NUMBER], Example: PTR/30B6B2",
      };
    }

    // Check if PTR number matches the one stored in gds_dsiv_ptr (from DSIV command)
    if (typeof window !== "undefined") {
      const storedDsivPtr = localStorage.getItem("gds_dsiv_ptr");
      if (!storedDsivPtr) {
        return {
          valid: false,
          message:
            "Invalid: No PTR assigned via DSIV command. Please run DSIV[PTR NUMBER] first.",
          suggestion: "Format: PTR/[PTR NUMBER], Example: PTR/30B6B2",
        };
      }

      // Check if the PTR number matches the one from DSIV command
      if (storedDsivPtr !== ptrNumber) {
        return {
          valid: false,
          message: `Invalid: PTR number '${ptrNumber}' does not match the assigned PTR '${storedDsivPtr}' from DSIV command.`,
          suggestion: `Please use the PTR number '${storedDsivPtr}' that was assigned via DSIV command.`,
        };
      }
    }

    return { valid: true, message: "Valid format", suggestion: "" };
  }

  // STEP:15 Parse PTR Assigned command - Assign PTR number
  private static parsePTRAssigned(cmd: string): {
    success: boolean;
    message: string;
    ptrNumber: string;
    formatted: string;
  } {
    const ptrNumber = cmd.substring(4);

    // Format the response: PTR/6B8893 «
    const formatted = `${cmd} «`;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gds_ptr_assigned", ptrNumber);
      // Dispatch event for real-time updates
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    return {
      success: true,
      message: "PRINTER DESIGNATED",
      ptrNumber,
      formatted,
    };
  }

  // STEP:16 Parse Ticket Details (*A) - Aggregate all data from localStorage
  private static parseTicketDetails() {
    if (typeof window === "undefined") {
      return { success: false, message: "Not available" };
    }

    // Get all data from localStorage
    const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");
    const passengerName = JSON.parse(
      localStorage.getItem("gds_passenger_name") || "null"
    );
    const agency = JSON.parse(
      localStorage.getItem("gds_agency_details") || "null"
    );
    const ticketing = JSON.parse(
      localStorage.getItem("gds_ticketing") || "null"
    );
    const received = JSON.parse(localStorage.getItem("gds_received") || "null");
    const mobileNumber = JSON.parse(
      localStorage.getItem("gds_passenger_mobile") || "null"
    );
    const emailAddress = JSON.parse(
      localStorage.getItem("gds_passenger_email") || "null"
    );
    const docs = JSON.parse(localStorage.getItem("gds_docs") || "null");
    const fareDetail = JSON.parse(
      localStorage.getItem("gds_fare_detail") || "null"
    );
    const ticketNumber = localStorage.getItem("gds_ticket_number") || null;

    // Generate or reuse PNR
    let pnr = localStorage.getItem("gds_pnr");
    if (!pnr) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      pnr = Array.from({ length: 6 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
      localStorage.setItem("gds_pnr", pnr);
    }

    // Helper day of week
    const getDow = (dateStr: string) => {
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      try {
        const day = parseInt(dateStr.substring(0, 2), 10);
        const monthStr = dateStr.substring(2, 5);
        const months: any = {
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
        const year = new Date().getFullYear();
        const d = new Date(year, months[monthStr], day);
        if (d < new Date()) d.setFullYear(year + 1);
        return days[d.getDay()];
      } catch {
        return "";
      }
    };

    // Build passenger name line: 1.1BHUIYAN/SHILA MS
    const passengerNameLine = passengerName
      ? `1.1${passengerName.lastName}/${passengerName.firstName} ${passengerName.title}`
      : "";

    // Build flight segment line
    let segmentLine = "";
    if (bookings.length > 0) {
      const latest = bookings[bookings.length - 1];
      const flight = latest?.flight;
      const rbd = latest?.rbd || "";
      const numberOfPassengers = latest?.numberOfPassengers || 1;

      if (flight) {
        const dateOnly = flight.date.substring(0, 5); // e.g., "12JAN"
        const depTime = flight.departureTime.replace(":", ""); // e.g., "0825"
        const arrTime = flight.arrivalTime.replace(":", ""); // e.g., "1440"
        const flightNum = flight.flightNumber.replace(/\s+/g, ""); // Remove spaces

        // Format: 1 BG 584C 12JAN 1 DACSIN HK1 0825 1440 /DCBG*SZTGXF /E
        segmentLine = `1 ${flight.airline} ${flightNum}${rbd} ${dateOnly} ${numberOfPassengers} ${flight.origin}${flight.destination} HK${numberOfPassengers} ${depTime} ${arrTime} /DC${flight.airline}*SZTGXF /E`;
      }
    }

    // Build TKT/TIME LIMIT
    const tktTimeLimit = ticketing ? "1.TAW/" : "";

    // Build PHONES line: 1. DAC FLYGER
    const phonesLine = agency
      ? `1. ${
          bookings.length > 0 && bookings[0]?.flight?.origin
            ? bookings[0].flight.origin
            : "DAC"
        } ${agency.agencyName}`
      : "";

    // Build GENERAL FACTS (SSR lines)
    const generalFacts: string[] = [];
    if (emailAddress && emailAddress.email) {
      // Format: SSR CTCE BG HK1/BHUIYANSHILA5//GMAIL.COM
      const emailFormatted = emailAddress.email
        .replace("@", "//")
        .toUpperCase();
      const passengerNameForSSR = passengerName
        ? `${passengerName.lastName}${passengerName.firstName}${passengerName.firstName.length}`
        : "PASSENGER";
      generalFacts.push(
        `1.SSR CTCE ${
          bookings.length > 0 ? bookings[0]?.flight?.airline || "BG" : "BG"
        } HK1/${passengerNameForSSR}${emailFormatted}`
      );
    }
    if (mobileNumber && mobileNumber.number) {
      // Format: SSR CTCM BG HK1/01686018002
      generalFacts.push(
        `2.SSR CTCM ${
          bookings.length > 0 ? bookings[0]?.flight?.airline || "BG" : "BG"
        } HK1/${mobileNumber.number}`
      );
    }
    if (fareDetail) {
      // Format: OSI 1B PLEASE TICKET FARE AS PER TKT/TL IN PQ
      generalFacts.push(`4.OSI 1B PLEASE TICKET FARE AS PER TKT/TL IN PQ`);
    }

    // Build RECEIVED FROM
    const receivedFrom = received ? `RECEIVED FROM - ${received.officer}` : "";

    // Build record locator line: NL1L.NL1L*AAK 0426/06NOV25 SFEPPN H
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = months[now.getMonth()];
    const year = now.getFullYear().toString().substring(2);
    const recordLocator = `NL1L.NL1L*AAK ${hours}${minutes}/${day}${month}${year} ${pnr} H`;

    // Build complete ticket details object
    const ticketDetails = {
      success: true,
      pnr,
      ticketNumber, // Include ticket number from localStorage
      passengerNameLine,
      segmentLine,
      tktTimeLimit,
      phonesLine,
      generalFacts,
      receivedFrom,
      recordLocator,
      hasPassengerDetail: docs !== null && docs !== "null",
      hasPriceQuote: fareDetail !== null && fareDetail !== "null",
      hasSecurityInfo: true, // Always show this
      hasTicketNumber: ticketNumber !== null, // Flag to show download button
    };

    // Save to localStorage
    localStorage.setItem("gds_ticket_details", JSON.stringify(ticketDetails));
    // Dispatch event for real-time updates
    window.dispatchEvent(new Event("gds_booking_updated"));

    return ticketDetails;
  }

  // STEP:17 Validate Invoice format: W'PQ1N1.1'ABG'FINVAGT'KP7
  private static validateInvoiceFormat(cmd: string): {
    valid: boolean;
    message: string;
    suggestion: string;
  } {
    // Format: W'PQ1N1.1'ABG'FINVAGT'KP7
    // Must match exactly

    const exactFormat = "W'PQ1N1.1'ABG'FINVAGT'KP7";

    if (cmd !== exactFormat) {
      return {
        valid: false,
        message:
          "Invalid format: Command must match exactly 'W'PQ1N1.1'ABG'FINVAGT'KP7'",
        suggestion:
          "Format: W'PQ1N1.1'ABG'FINVAGT'KP7, Example: W'PQ1N1.1'ABG'FINVAGT'KP7",
      };
    }

    return { valid: true, message: "Valid format", suggestion: "" };
  }

  // STEP:18 Parse Invoice command - Generate Airline Ticket Number
  private static parseInvoice(cmd: string): {
    success: boolean;
    message: string;
    ticketNumber: string;
    formatted: string;
  } {
    // Generate random 13-digit Airline Ticket Number
    // Format: 3-digit airline code + 10-digit number
    // Example: 1571234567890
    const airlineCode = "157"; // BG (Biman Bangladesh Airlines) IATA code in numeric
    const randomDigits = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const ticketNumber = `${airlineCode}${randomDigits}`;

    // Format the response: W'PQ1N1.1'ABG'FINVAGT'KP7«
    const formatted = `${cmd}«`;

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("gds_ticket_number", ticketNumber);
      // Dispatch event for real-time updates
      window.dispatchEvent(new Event("gds_booking_updated"));
    }

    return {
      success: true,
      message: "Ticket number generated",
      ticketNumber,
      formatted,
    };
  }
}
