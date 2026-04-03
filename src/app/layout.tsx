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
  description: "Three Moves 是一个本地优先的日常记录 Web App，用于写下今天最重要的三件事、查看提醒和夜间回顾。",
  applicationName: "Three Moves",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
