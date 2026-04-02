import type { Metadata, Viewport } from "next";
import { Geist, Noto_Serif_SC } from "next/font/google";
import { PwaRegistry } from "@/components/pwa-registry";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Noto_Serif_SC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Three Moves",
    template: "%s | Three Moves",
  },
  description: "Local-first daily reflection web app for three priorities, reminders, and nightly review.",
  applicationName: "Three Moves",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Three Moves",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4ecde",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegistry />
        {children}
      </body>
    </html>
  );
}
