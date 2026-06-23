import type { Metadata } from "next";
import { poppins } from '@/lib/fonts';
import ThemeProvider from '@/components/Providers/ThemeProvider';
import { AnimeFilterProvider } from '@/components/Providers/AnimeFilterContext';
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
      <body className={`${poppins.className} antialiased min-h-full flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimeFilterProvider>
            {children}
          </AnimeFilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}