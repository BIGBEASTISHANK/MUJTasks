import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MUJ Tasks",
  description:
    "Centralized platform for handwritten paid assignments and lab manuals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="!scroll-smooth bg-[#1A1E23] text-white"
      suppressHydrationWarning={true}
    >
      <head>
        <script
          src="https://cdn.counter.dev/script.js"
          data-id="97b223ea-ee69-4ce7-8e2c-dd4875f6565a"
          data-utcoffset="6"
          async
        ></script>
      </head>
      <body className={`${geistMono.className}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
