import type { Metadata } from "next";
import { Inter, Space_Grotesk, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pressStart2P = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-press-start-2p" });

export const metadata: Metadata = {
  title: "Kickstart | Retro Job Tracker",
  description: "Track every application. Land more interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          spaceGrotesk.variable,
          pressStart2P.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
