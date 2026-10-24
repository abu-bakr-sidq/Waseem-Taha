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
    images: [{ url: "/images/hero/waseem-taha.png", width: 1536, height: 1024, alt: "Waseem Taha portfolio" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
