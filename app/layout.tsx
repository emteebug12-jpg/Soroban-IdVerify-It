import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "soroban-IDVerifier-It",
  description: "Minimal Stellar Soroban PoC for identity hash verification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
