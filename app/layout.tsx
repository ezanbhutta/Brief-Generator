import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Brief Generator",
  description:
    "Generate a complete branding brief — name, positioning, palette, typography, and visual identity — in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
