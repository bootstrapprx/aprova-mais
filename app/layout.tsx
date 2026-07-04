import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { ExitModal } from "@/components/modals/exit-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { SupabaseProvider } from "@/components/supabase-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#22C55E",
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SupabaseProvider>
      <html lang="pt-BR">
        <body className={font.className}>
          <Toaster theme="light" richColors closeButton />
          <ExitModal />
          <PracticeModal />
          {children}
        </body>
      </html>
    </SupabaseProvider>
  );
}
