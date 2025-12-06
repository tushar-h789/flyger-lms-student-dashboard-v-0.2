"use client";

import jsPDF from "jspdf";
import logo from "@/public/images/logo.png";

interface TicketData {
  pnr?: string;
  ticketNumber?: string;
  [key: string]: any;
}

// Helper function to format date
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const day = dateStr.substring(0, 2);
    const monthStr = dateStr.substring(2, 5);
    const months: { [key: string]: string } = {
      JAN: "01",
      FEB: "02",
      MAR: "03",
      APR: "04",
      MAY: "05",
      JUN: "06",
      JUL: "07",
      AUG: "08",
      SEP: "09",
      OCT: "10",
      NOV: "11",
      DEC: "12",
    };
    const month = months[monthStr] || "01";
    const currentYear = new Date().getFullYear();
    return `${day}/${month}/${currentYear}`;
  } catch {
    return dateStr;
  }
}

// Helper function to get day of week
function getDayOfWeek(dateStr: string): string {
  if (!dateStr) return "";
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  try {
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
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, month, day);
    if (date < new Date()) {
      date.setFullYear(currentYear + 1);
    }
    return days[date.getDay()];
  } catch {
    return "";
  }
}

// Helper function to format email properly
function formatEmail(email: string): string {
  if (!email) return "N/A";
  // Remove any spaces and convert // to @
  return email.trim().replace(/\/\//g, "@").toLowerCase();
}

// Function to create itinerary HTML template matching the image format
export function createItineraryHTML(ticketData: TicketData): string {
  // Get all data from localStorage
  const bookings = JSON.parse(localStorage.getItem("gds_bookings") || "[]");
  const passengerName = JSON.parse(
    localStorage.getItem("gds_passenger_name") || "null"
  );
  const agencyDetails = JSON.parse(
    localStorage.getItem("gds_agency_details") || "null"
  );
  const emailAddress = JSON.parse(
    localStorage.getItem("gds_passenger_email") || "null"
  );

  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format passenger name
  const passengerNameFormatted = passengerName
    ? `${passengerName.lastName}/${passengerName.firstName} ${passengerName.title}`
    : "N/A";

  // Get PNR
  const pnr = ticketData.pnr || "N/A";

  // Get booking reference (from PNR or generate)
  const bookingRef = pnr || "N/A";

  // Get and format email properly
  const rawEmail = emailAddress?.email || agencyDetails?.agencyEmail || "N/A";
  const email = formatEmail(rawEmail);

  // Build flight segments HTML
  let flightSegmentsHTML = "";

  if (bookings.length === 0) {
    flightSegmentsHTML = `<tr><td colspan="6">No flight segments available</td></tr>`;
  } else {
    bookings.forEach((booking: any) => {
      const flight = booking.flight;
      const dayOfWeek = getDayOfWeek(flight.date);
      const formattedDate = formatDate(flight.date);

      // Format flight number (remove airline prefix if present)
      let flightNumber = flight.flightNumber || "";
      if (flightNumber.toUpperCase().startsWith(flight.airline.toUpperCase())) {
        flightNumber = flightNumber.substring(flight.airline.length).trim();
      }
      const fullFlightNumber = `${flight.airline} ${flightNumber}`;

      // Departure segment
      flightSegmentsHTML += `
        <tr>
          <td>${dayOfWeek}</td>
          <td>${formattedDate}</td>
          <td>DEP<br/>${flight.origin} ${flight.terminal || ""}</td>
          <td>${flight.departureTime}</td>
          <td>${fullFlightNumber}</td>
          <td>NON-STOP</td>
        </tr>
      `;

      // Arrival segment
      if (flight.transit) {
        // Transit arrival (intermediate stop)
        const transitDay = getDayOfWeek(
          flight.transit.arrivalDate || flight.date
        );
        const transitDate = formatDate(
          flight.transit.arrivalDate || flight.date
        );
        flightSegmentsHTML += `
          <tr>
            <td>${transitDay}</td>
            <td>${transitDate}</td>
            <td>ARR<br/>${flight.transit.city} ${
          flight.transit.terminal || ""
        }</td>
            <td>${flight.transit.arrivalTime}</td>
            <td>ECONOMY (${booking.rbd})<br/>CONFIRMED</td>
            <td>${flight.equipment || "BOEING 737-800"}<br/>${
          flight.duration || "06HR 00MIN"
        }<br/>${flight.meals || "MEALS"}</td>
          </tr>
        `;

        // Final destination arrival
        const finalDay = getDayOfWeek(flight.date);
        const finalDate = formatDate(flight.date);
        flightSegmentsHTML += `
          <tr>
            <td>${finalDay}</td>
            <td>${finalDate}</td>
            <td>ARR<br/>${flight.destination} ${flight.terminal || ""}</td>
            <td>${flight.arrivalTime}</td>
            <td>ECONOMY (${booking.rbd})<br/>CONFIRMED</td>
            <td>${flight.equipment || "BOEING 737-800"}<br/>${
          flight.duration || "06HR 00MIN"
        }<br/>${flight.meals || "MEALS"}</td>
          </tr>
        `;
      } else {
        // Direct arrival
        flightSegmentsHTML += `
          <tr>
            <td>${dayOfWeek}</td>
            <td>${formattedDate}</td>
            <td>ARR<br/>${flight.destination} ${flight.terminal || ""}</td>
            <td>${flight.arrivalTime}</td>
            <td>ECONOMY (${booking.rbd})<br/>CONFIRMED</td>
            <td>${flight.equipment || "BOEING 737-800"}<br/>${
          flight.duration || "06HR 00MIN"
        }<br/>${flight.meals || "MEALS"}</td>
          </tr>
        `;
      }
    });
  }

  // Get ticket number if available
  const ticketNumber = ticketData.ticketNumber || "N/A";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          font-size: 9px;
          line-height: 1.2;
          color: #000;
          background: #fff;
          padding: 0;
          margin: 0;
          width: 210mm;
          max-width: 210mm;
        }
        .content-wrapper {
          padding: 15mm 15mm 15mm 15mm;
          width: 100%;
          box-sizing: border-box;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
        }
        .header-left {
          flex: 1;
        }
        .logo-container {
          margin-bottom: 5px;
        }
        .logo-container img {
          height: 42px;
          width: auto;
          display: block;
        }
        .header-left > div {
          line-height: 1.3;
        }
        .header-right {
          text-align: right;
          flex: 1;
          line-height: 1.3;
        }
        .itinerary-prepared {
          margin: 15px 0 5px 0;
          border-bottom: 1px solid #000;
          padding-bottom: 2px;
          font-weight: normal;
          font-size: 9px;
        }
        .passenger-name {
          margin: 5px 0 15px 0;
          font-size: 9px;
          font-weight: normal;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          font-size: 8px;
        }
        th {
          text-align: left;
          padding: 5px 5px 5px 0;
          border-bottom: 1px solid #000;
          font-weight: normal;
          font-size: 8px;
          line-height: 1.2;
        }
        td {
          padding: 6px 5px 6px 0;
          border-bottom: none;
          vertical-align: top;
          line-height: 1.4;
        }
        tr {
          border-bottom: 1px solid #e0e0e0;
        }
        tbody tr:last-child {
          border-bottom: 1px solid #000;
        }
        .ticket-number {
          margin: 15px 0;
          font-weight: normal;
          font-size: 9px;
          line-height: 1.5;
        }
        .data-protection {
          margin-top: 20px;
          font-size: 9px;
          line-height: 1.5;
          text-align: justify;
          color: #000000;
        }
        .data-protection a {
          color: #0000ff;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="content-wrapper">
      <div class="header">
        <div class="header-left">
          <div class="logo-container"><img src="${logo.src}" alt="Logo" /></div>
          <div>FLYGER ACADEMY</div>
          <div>EMAIL ADDRESS: ${email.toUpperCase()}</div>
        </div>
        <div class="header-right">
          <div>DATE:${dateStr}</div>
          <div>TIME:${timeStr}</div>
          <div>ITINERARY</div>
          <div>CONSULTANT NAME: ${
            agencyDetails?.reservationOfficerName || "IMRAN"
          }</div>
          <div>ID11</div>
          <div>BOOKING REF: ${bookingRef}</div>
        </div>
      </div>
      
      <div class="itinerary-prepared">ITINERARY PREPARED FOR:</div>
      <div class="passenger-name">${passengerNameFormatted}</div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 7%;">DAY</th>
            <th style="width: 11%;">DATE</th>
            <th style="width: 30%;">CITY/TERMINAL/<br/>STOPOVER CITY</th>
            <th style="width: 9%;">TIME</th>
            <th style="width: 18%;">FLIGHT<br/>CLASS<br/>STATUS</th>
            <th style="width: 25%;">STOP/EQP/<br/>FLYING TIME<br/>SERVICES</th>
          </tr>
        </thead>
        <tbody>
          ${flightSegmentsHTML}
        </tbody>
      </table>
      
      <div class="ticket-number">
        AIRLINE TICKET NUMBER:<br/>
        ${ticketNumber} - ${passengerNameFormatted}
      </div>
      
      <div class="data-protection">
        <strong>IMPORTANT NOTICE:</strong> THIS DOCUMENT IS GENERATED FOR EDUCATIONAL AND TRAINING PURPOSES ONLY AS PART OF THE FLYGER ACADEMY AIR TICKETING & RESERVATION TRAINING PROGRAM. THIS IS NOT A REAL TICKET AND CANNOT BE USED FOR ACTUAL TRAVEL. THIS ITINERARY IS CREATED FOR STUDENT PRACTICE WITH SABRE GDS SIMULATION SYSTEM.
        <br/><br/>
        FOR REAL FLIGHT BOOKINGS, TRAVEL PACKAGES, VISA SERVICES, OR TO ENROLL IN OUR PROFESSIONAL AIR TICKETING & RESERVATION COURSES, PLEASE VISIT OUR OFFICIAL WEBSITES:
        <br/>
        TRAVEL SERVICES: <a href="https://flygerholidays.com/">HTTPS://FLYGERHOLIDAYS.COM/</a>
        <br/>
        ACADEMY & COURSES: <a href="https://flygeracademy.com/">HTTPS://FLYGERACADEMY.COM/</a>
        <br/><br/>
        FOR INQUIRIES OR TO CONTACT US, PLEASE VISIT OUR WEBSITES OR CALL +8801847-451115.
      </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

// Function to add watermark to PDF - multiple watermarks in a structured pattern
function addWatermark(pdf: jsPDF, pageWidth: number, pageHeight: number) {
  const watermarkText = "Flyger Academy * Just For Practice";

  // Save graphics state
  try {
    pdf.saveGraphicsState();
  } catch (e) {
    // Ignore if not available
  }

  // Set watermark properties - made more visible
  pdf.setTextColor(140, 140, 140);
  pdf.setFontSize(20);

  try {
    if (pdf.GState) {
      pdf.setGState(pdf.GState({ opacity: 0.15 }));
    }
  } catch (e) {
    pdf.setTextColor(120, 120, 120);
  }

  // Create a structured grid pattern for watermarks
  // Define grid dimensions - increased rows to add 4 more watermarks (from 6 to 10 total)
  const rows = 5; // Number of rows (increased from 3 to 5 for 10 total watermarks)
  const cols = 2; // Number of columns
  const margin = 30; // Margin from edges (increased)
  const extraGap = 40; // Extra gap between watermarks (in mm)

  // Calculate available space
  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;

  // Calculate spacing with extra gap
  const spacingX = (availableWidth - extraGap * (cols - 1)) / (cols + 1);
  const spacingY = (availableHeight - extraGap * (rows - 1)) / (rows + 1);

  // Fixed angle for consistency (45 degrees)
  const angle = 45;

  // Add watermarks in a grid pattern with more spacing
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Calculate position in sequence with extra gap
      const x = margin + (col + 1) * spacingX + col * extraGap;
      const y = margin + (row + 1) * spacingY + row * extraGap;

      try {
        pdf.text(watermarkText, x, y, {
          angle: angle,
          align: "center",
        });
      } catch (e) {
        // Fallback if angle not supported
        pdf.text(watermarkText, x, y, {
          align: "center",
        });
      }
    }
  }

  // Restore graphics state
  try {
    if (pdf.restoreGraphicsState) {
      pdf.restoreGraphicsState();
    }
  } catch (e) {
    pdf.setTextColor(0, 0, 0);
  }
}

// Function to generate PDF with watermark from HTML
export async function generateTicketDetailsPDF(ticketData: TicketData) {
  try {
    // Dynamically import html2canvas
    const html2canvas = (await import("html2canvas")).default;

    // Create HTML content
    const htmlContent = createItineraryHTML(ticketData);

    // Create a temporary container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = "210mm";
    container.style.backgroundColor = "#fff";
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Wait for content to render
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get the body element from the container
    const bodyElement = container.querySelector("body") || container;

    // Convert HTML to canvas
    const canvas = await html2canvas(bodyElement as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794, // A4 width in pixels at 96 DPI
      height: bodyElement.scrollHeight || container.scrollHeight,
      backgroundColor: "#ffffff",
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Define margins
    const marginTop = 15;
    const marginLeft = 15;
    const marginRight = 15;
    const marginBottom = 25;

    // Calculate content area dimensions
    const contentWidth = pageWidth - marginLeft - marginRight;
    const contentHeight = pageHeight - marginTop - marginBottom;

    // Calculate image dimensions to fit content area
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // Calculate number of pages needed
    const totalPages = Math.ceil(imgHeight / contentHeight);

    // Add pages with image and watermark
    let heightLeft = imgHeight;
    let position = 0;

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      // Calculate the portion of image for this page
      const sourceHeight = Math.min(contentHeight, heightLeft);
      const sourceY = (position * canvas.height) / imgHeight;
      const sourceHeightPx = (sourceHeight * canvas.height) / imgHeight;

      // Create a temporary canvas for this page
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = sourceHeightPx;
      const ctx = pageCanvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sourceHeightPx,
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );

        const pageImgData = pageCanvas.toDataURL("image/png", 1.0);
        // Add image with margins - position from marginLeft and marginTop
        pdf.addImage(
          pageImgData,
          "PNG",
          marginLeft,
          marginTop,
          imgWidth,
          sourceHeight
        );
      }

      // Add watermark after image so it appears on top of ticket content
      addWatermark(pdf, pageWidth, pageHeight);

      heightLeft -= contentHeight;
      position += contentHeight;
    }

    // Save PDF
    const fileName = `ticket_details_${ticketData.pnr || "ticket"}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback: try to install html2canvas or show error
    alert(
      "Error generating PDF. Please ensure html2canvas is installed: npm install html2canvas"
    );
  }
}

// Component for ticket download button
interface TicketDownloadButtonProps {
  ticketData: TicketData;
  className?: string;
}

export function TicketDownloadButton({
  ticketData,
  className = "w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors cursor-pointer",
}: TicketDownloadButtonProps) {
  const handleDownload = async () => {
    await generateTicketDetailsPDF(ticketData);
  };

  return (
    <button onClick={handleDownload} className={className}>
      Download Ticket Details
    </button>
  );
}
