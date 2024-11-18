import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { magilio, pally } from "./fonts/fonts";
import { GeistSans } from "geist/font/sans";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Memory Lane - Create and Share Your Memories",
  description: "Memory Lane is an interactive platform for capturing, organizing, and sharing cherished moments with friends and family. Built with the T3 Stack, it features customizable lanes, images, and timestamps for an enriching user experience.",
  icons: [
    {
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>M</text></svg>",
    },
  ],
  openGraph: {
    title: "Memory Lane - Create and Share Your Memories",
    description: "Explore Memory Lane, a platform to organize and share life events. Capture moments with images, add descriptions, and create unique collections.",
    type: "website",
    url: "https://ervin-memorylane.vercel.app",
    images: [
      {
        url: "/images/meta-banner.png",
        width: 1200,
        height: 630,
        alt: "Memory Lane Banner showcasing events and memories.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Lane - Capture and Relive Your Memories",
    description: "Discover and share memories through an interactive platform that allows you to create detailed and visually appealing timelines.",
    images: "/images/meta-banner.png",
  }
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${pally.variable} ${magilio.variable}`}
    >
      <body>
        <TRPCReactProvider>
          <TooltipProvider>
            <Header />
            {children}
          </TooltipProvider>
          <Toaster pauseWhenPageIsHidden />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
