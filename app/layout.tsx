import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shakeweight | Healthy Weight Management Shake",
  description: "Order shakeweight with Cash On Delivery. Fresh, convenient, and made for healthy weight goals.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/fav icon.png", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
