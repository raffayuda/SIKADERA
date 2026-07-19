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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <SidebarProvider>
          <ClientLayout>{children}</ClientLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
