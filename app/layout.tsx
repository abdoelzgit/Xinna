"use client";

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { AiChatWidget } from "@/components/ai-chat-widget";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSpecialPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <AuthProvider>
          {!isSpecialPage && <Header />}
          <main className="flex-1">
            {children}
          </main>
          {!isSpecialPage && <Footer />}
          {!isSpecialPage && <AiChatWidget />}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
