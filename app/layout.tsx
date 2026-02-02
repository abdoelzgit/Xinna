"use client";

import type { Metadata } from "next";
import { Darker_Grotesque } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { AiChatWidget } from "@/components/ai-chat-widget";
import { ChatProvider } from "@/components/chat-context";

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
      <body className={`${darkerGrotesque.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <AuthProvider>
          <ChatProvider>
            {!isSpecialPage && <Header />}
            <main className="flex-1">
              {children}
            </main>
            {!isSpecialPage && <Footer />}
            {!isSpecialPage && <AiChatWidget />}
            <Toaster position="top-center" richColors />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
