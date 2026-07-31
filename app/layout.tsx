import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://montessoriengine.com"),
  title: {
    default: "Montessori Engine — AI tools built for Montessori educators",
    template: "%s · Montessori Engine",
  },
  description:
    "Plan authentic activities, write observation notes, build daily plans, and track every child's progress — all in one place, designed around how Montessori teachers actually work.",
  keywords: [
    "Montessori",
    "Montessori software",
    "lesson planning",
    "observation notes",
    "student progress tracking",
    "AI for teachers",
    "early childhood education",
  ],
  authors: [{ name: "Montessori Engine" }],
  verification: {
    google: "6hazwcgmYDHyM8nOhasCAKz-h-7vLBtN0-8nPOVCaHk",
  },
  openGraph: {
    type: "website",
    url: "https://montessoriengine.com",
    siteName: "Montessori Engine",
    title: "Montessori Engine — AI tools built for Montessori educators",
    description:
      "The all-in-one platform for Montessori educators. Plan lessons, write observations, build daily plans, and track every child's progress in one place.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Montessori Engine — the all-in-one platform for Montessori educators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Montessori Engine — AI tools for Montessori educators",
    description:
      "Plan lessons, write observations, and track every child's progress — designed around how Montessori teachers actually work.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
