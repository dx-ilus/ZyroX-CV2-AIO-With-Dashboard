/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║    ░█▀▀░█▀█░█▀▄░█▀▀░█░█    ░█▀▄░█▀▀░█░█░█▀▀                       ║
 * ║    ░█░░░█░█░█░█░█▀▀░▄▀▄    ░█░█░█▀▀░▀▄▀░▀▀█                       ║
 * ║    ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀    ░▀▀░░▀▀▀░░▀░░▀▀▀                       ║
 * ║                                                                  ║
 * ║            © 2026 CodeX Devs — All Rights Reserved               ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "ZyroX // Advanced Discord Infrastructure",
    template: "%s | ZyroX Engine"
  },
  description: "The hyper-performance Discord engine. Automated security, cinematic leveling, and precision tools.",
  metadataBase: new URL("https://zyrox.dev"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#020617] text-slate-200 antialiased selection:bg-amber-500/30 selection:text-amber-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
