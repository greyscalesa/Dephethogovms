import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dephethogo Access | Enterprise Visitor Management",
  description: "Advanced cloud-based visitor management for corporate, industrial, and residential sites by Dephethogo.",
};

import { LayoutProvider } from "@/lib/LayoutContext";
import { SiteProvider } from "@/lib/context/SiteContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-[16px]`}>
        <SiteProvider>
          <LayoutProvider>
            <div className="flex min-h-screen relative">
              <Sidebar />
              <main className="flex-1 flex flex-col min-w-0 bg-[#f4f7f6]">
                {children}
              </main>
            </div>
          </LayoutProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
