import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stranger Mingle - Free Stranger Chat (Text + Video)",
  description: "Free Stranger Chat (Text + Video) service. No Login, No Credit Card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Stranger Mingle",
              "url": "https://strangermingle.com",
              "logo": "https://strangermingle.com/icon.png",
              "sameAs": [
                "https://www.instagram.com/strangermingle/",
                "https://www.youtube.com/@strangermingle",
                "https://x.com/strangermingle",
                "https://www.linkedin.com/company/strangermingle",
                "https://www.facebook.com/strangermingle"
              ]
            }),
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
