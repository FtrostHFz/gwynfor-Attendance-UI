import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo, Lexend } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo_black = Archivo ({
  weight: "900",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

const lexend = Lexend ({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "GWYNFOR Attendance V1",
  description: "Gwynfor student attendance and monitoring system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo_black.variable} ${lexend.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
