const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export class APIClient {
  static async searchFlights(params: {
    origin: string;
    destination: string;
    date: string;
    class?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/flights/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  static async checkFare(params: {
    origin: string;
    destination: string;
    flightNumber: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/fares/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  static async createBooking(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  }

  static async retrievePNR(pnr: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${pnr}`);
    return response.json();
  }
}
