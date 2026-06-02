import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/lib/context/sidebar-context";
import { ClientLayout } from "@/components/client-layout";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIKADERA - Sistem Informasi Manajemen Kaderisasi",
  description: "Sistem Informasi Manajemen Kaderisasi DPC Dramaga",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground dark">
        <SidebarProvider>
          <ClientLayout>{children}</ClientLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
