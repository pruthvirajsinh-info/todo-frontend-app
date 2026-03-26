import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider.js";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Aura Todo | Full-Stack Task Management",
  description: "Experience the next generation of productivity with Aura Todo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
