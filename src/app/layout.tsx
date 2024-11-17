import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { magilio, pally } from "./fonts/fonts";
import { GeistSans } from "geist/font/sans";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Memory Lane",
  description: "Memory Lane is a simple memory tracking app.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
