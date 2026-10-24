import type { Metadata } from "next";
import { EvCaseStudy } from "./ev-case-study";

export const metadata: Metadata = {
  title: "EV charge finder",
  description: "UX case study by Waseem Taha: research, wireframes, high-fidelity screens and a clickable prototype for finding a charger you can trust.",
};

export default function Page() {
  return <EvCaseStudy />;
}
