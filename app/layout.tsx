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
  title: "Toi bi ep (🥺)",
  description: "Game mini: Ca lop cung nhau danh boss! Tham gia va chien dau.",
  openGraph: {
    title: "Toi bi ep (🥺)",
    description: "Game mini: Ca lop cung nhau danh boss! Tham gia va chien dau.",
    siteName: "Ca Lop Danh Boss",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toi bi ep (🥺)",
    description: "Game mini: Ca lop cung nhau danh boss! Tham gia va chien dau.",
  },
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
