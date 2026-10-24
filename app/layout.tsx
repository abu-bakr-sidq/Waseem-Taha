import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Waseem Taha — Brand & Creative Designer", template: "%s — Waseem Taha" },
  description: "Portfolio of Waseem Taha, a Brand & Creative Designer in Chennai: campaigns, social media, packaging, exhibition graphics and UX/UI case studies.",
  metadataBase: new URL("https://waseem-taha.vercel.app"),
  openGraph: {
    title: "Waseem Taha — Portfolio",
    description: "Case studies, visual systems, and digital experiences.",
    type: "website",
    // Bump ?v= whenever the card changes: chat apps and LinkedIn cache preview images by URL.
    images: [{ url: "/images/brand/link-preview.jpg?v=2", width: 1200, height: 630, alt: "Waseem Taha — Brand & Creative Designer" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
