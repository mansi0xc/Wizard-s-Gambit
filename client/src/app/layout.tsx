import type React from "react";
import "./globals.css";
import { Inter, Cinzel } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Wizarding Realms: The Arcane Duel",
  description: "A magical dueling experience in the wizarding world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cinzel.variable} font-sans`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <MainNav />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

