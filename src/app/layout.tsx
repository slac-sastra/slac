import type { Metadata } from "next";
import { Inter, Noto_Sans_Tamil } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
  variable: "--font-noto-tamil",
  subsets: ["tamil"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SASTRA AI Legal Aid Clinic",
  description:
    "AI-powered legal assistance for rural communities. Get instant legal guidance, petition drafts, and case summaries in Tamil and English.",
  keywords: ["legal aid", "SASTRA", "AI", "Tamil", "rural communities", "DLSA", "legal petition"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoTamil.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
