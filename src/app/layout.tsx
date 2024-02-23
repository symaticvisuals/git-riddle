import type { Metadata } from "next";

import { Inter, Kdam_Thmor_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import MainNavbar from "@/components/navbar";

const inter = Kdam_Thmor_Pro({
  weight: "400",
  subsets: ["khmer"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark min-h-screen ${inter.className}`}>
        <Providers>
          <MainNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
