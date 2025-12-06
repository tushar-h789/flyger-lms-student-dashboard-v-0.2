// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/src/redux/redux-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secure App - Professional Authentication",
  description:
    "Enterprise-grade authentication system with industry standard security",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <div className="min-h-screen bg-gray-50">{children}</div>
        </ReduxProvider>
      </body>
    </html>
  );
}
