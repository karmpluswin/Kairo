import type { Metadata } from "next";
import { poppins } from '@/lib/fonts';
import { minecraft } from "@/lib/fonts";
import { sukajan } from "@/lib/fonts";
import ThemeProvider from '@/components/Providers/ThemeProvider';
import { AnimeFilterProvider } from '@/components/Providers/AnimeFilterContext';
import Footer from '@/components/Footer/Footer';
import "./globals.css";

export const metadata: Metadata = {
  title: "Kairo",
  description: "Your seasonal anime tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} ${minecraft.variable} ${sukajan.variable} antialiased min-h-full flex flex-col`}>
        <ThemeProvider>
          <AnimeFilterProvider>
            <div>
              {children}
            </div>
            <div className="hidden lg:block">
              <Footer />
            </div>
          </AnimeFilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}