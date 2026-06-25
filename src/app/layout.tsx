import type { Metadata } from "next";
import { poppins } from '@/lib/fonts';
import { minecraft } from "@/lib/fonts";
import { sukajan } from "@/lib/fonts";
import ThemeProvider from '@/components/Providers/ThemeProvider';
import { AnimeFilterProvider } from '@/components/Providers/AnimeFilterContext';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader';
import PageTransition from '@/components/PageTransition';
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
            {/* Loader sits on top of everything */}
            <PageLoader />
            <PageTransition>
              <div>
                {children}
              </div>
              <div>
                <Footer />
              </div>
            </PageTransition>
          </AnimeFilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}