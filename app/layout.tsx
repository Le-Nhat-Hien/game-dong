import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

// FRONTEND - Root layout, chỉ dùng 1 font: Nunito
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cả Lớp Đánh Boss",
  description: "Game mini: Cả lớp cùng nhau đánh boss! Tham gia và chiến đấu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-nunito">{children}</body>
    </html>
  );
}
