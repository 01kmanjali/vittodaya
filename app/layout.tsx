import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vittodaya Financial Services – Best FD Rates in India",
  description: "Compare fixed deposit rates from top banks and NBFCs. Calculate returns and invest in the best FDs online. Vittodaya Financial Services Pvt. Ltd.",
  keywords: "fixed deposit, FD rates, best FD, investment, NBFC FD, small finance bank FD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
