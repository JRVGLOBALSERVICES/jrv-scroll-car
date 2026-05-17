import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JRV Car Rental | Sewa Lama Lagi Murah",
  description:
    "Rent the ride. Own the road. 50+ cars, zero deposit, free delivery Seremban. Premium car rental in Seremban, KLIA & KLIA2.",
  keywords:
    "car rental, seremban, sewa kereta, zero deposit, free delivery, jrv",
  openGraph: {
    title: "JRV Car Rental | Sewa Lama Lagi Murah",
    description:
      "Rent the ride. Own the road. 50+ cars, zero deposit, free delivery.",
    url: "https://jrvservices.co",
    siteName: "JRV Car Rental",
    locale: "ms_MY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className={`${inter.variable} ${interDisplay.variable}`}>
      <body className="font-body antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
