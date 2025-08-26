import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets:['latin'],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets:['latin'],
  variable: "--font-playfair", 
})

export const metadata: Metadata = {
  title: {
    template:`%s | Prostore`,
    default: APP_NAME
  },
  description: `${APP_DESCRIPTION}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-inter antialiased`}
      >
        <ThemeProvider attribute='class' defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
