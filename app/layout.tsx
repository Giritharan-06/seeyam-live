import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0056D2",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seeyamtechnologies.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "/seeyam-lion.png" },
  title: {
    default: "Seeyam Technologies | Premier Data Analytics, Digital Marketing & Placement Institute",
    template: "%s | Seeyam Technologies",
  },
  description:
    "Explore practical training in Data Analytics and Digital Marketing at SEEYAM in Thoraipakkam, Chennai, or learn online.",
  keywords: [
    "Data Analytics Training Institute",
    "Digital Marketing Course Chennai",
    "Power BI Tableau Certification",
    "Python for Data Science",
    "Business Intelligence Certification",
    "Seeyam Technologies",
    "100% Placement Guarantee Institute",
    "OMR Analytics Training Center",
    "Velachery Digital Marketing",
  ],
  authors: [{ name: "Seeyam Technologies", url: siteUrl }],
  creator: "Seeyam Technologies",
  publisher: "Seeyam Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Seeyam Technologies | Premier Data Analytics & Digital Marketing Institute",
    description:
      "Master high-demand tech skills: Data Analytics, Power BI, Digital Marketing, SEO & Performance Ads with dedicated placement drives.",
    url: siteUrl,
    siteName: "Seeyam Technologies",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seeyam Technologies | Data Analytics & Digital Marketing Institute",
    description:
      "Learn Data Analytics, Power BI, Digital Marketing, SEO and paid ads with career support in Chennai and online.",
    creator: "@seeyamtech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">

        {children}
      </body>
    </html>
  );
}
