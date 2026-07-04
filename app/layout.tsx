import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { ExitModal } from "@/components/modals/exit-modal";
import { PracticeModal } from "@/components/modals/practice-modal";
import { SupabaseProvider } from "@/components/supabase-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";

import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#22C55E" },
    { media: "(prefers-color-scheme: dark)", color: "#166534" },
  ],
};

export const metadata: Metadata = siteConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider>
          <SupabaseProvider>
            <Toaster richColors closeButton />
            <ExitModal />
            <PracticeModal />
            {children}
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
