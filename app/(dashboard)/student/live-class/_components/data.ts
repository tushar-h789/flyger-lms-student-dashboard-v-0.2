export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  description: string;
  startTime: Date;
  duration: number; // in minutes
  meetingLink: string;
  platform: "google-meet";
  participants: number;
  isLive: boolean;
  meetingId?: string;
  passcode?: string;
}

export const mockClasses: LiveClass[] = [
  {
    id: "1",
    title: "Basic Air Ticketing with Sabre GDS + Live Practice",
    instructor: "Md. Arif Rahman",
    description:
      "Hands-on introduction to Sabre GDS: PNR creation, fare quote, availability, seat maps, SSRs, and live practice of essential commands.",
    startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    duration: 90,
    meetingLink: "https://zoom.us/j/123456789",
    platform: "google-meet",
    participants: 24,
    isLive: false,
    meetingId: "123 456 789",
    passcode: "sabre101",
  },
  {
    id: "2",
    title: "Advance Air Ticketing & Visa Processing",
    instructor: "Fatema Noor",
    description:
      "Advanced reissue/exchange, fare rules, ADM/ACM handling, and end-to-end visa processing workflow with country-specific documentation tips.",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    platform: "google-meet",
    participants: 18,
    isLive: false,
  },
  {
    id: "3",
    title: "Fare Rules and Refund Policies Workshop",
    instructor: "Shahriar Kabir",
    description:
      "Decode airline fare rules (RT/OW/CT), penalty matrices, invol/refund scenarios, and practical refund processing steps.",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    duration: 75,
    meetingLink: "#",
    platform: "google-meet",
    participants: 32,
    isLive: false,
  },
];
