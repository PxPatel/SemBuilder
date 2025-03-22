import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/shadcn-ui/toaster";
import { ErrorUIProvider } from "../hooks/use-error-ui";
import { SchedulerProvider } from "../hooks/use-scheduler";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SemBuilder - Home",
  description: "NJIT's student-made registration tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`m-0 h-full min-h-screen w-full p-0 ${inter.className}`}>
        <ErrorUIProvider>
          <SchedulerProvider>{children}</SchedulerProvider>
        </ErrorUIProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
