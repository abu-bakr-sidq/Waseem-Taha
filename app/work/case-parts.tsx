"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { contact, howIWork } from "../content";
import { Reveal, SectionLabel, ease } from "../components/ui";

export const pad = (value: number) => String(value).padStart(2, "0");

export function IntroRow({ label, title, note }: { label: string; title: React.ReactNode; note?: string }) {
  return <div className="cs-intro-row">
    <Reveal><SectionLabel>{label}</SectionLabel><h2 className="cs-title">{title}</h2></Reveal>
    {note && <Reveal delay={0.1}><p className="cs-note">{note}</p></Reveal>}
  </div>;
}

export function ResearchBlock({ label, title, note, items, footer }: { label: string; title: string; note: string; items: { title: string; text: string }[]; footer?: string }) {
  return <div className="cs-split cs-block">
    <Reveal className="cs-side"><SectionLabel>{label}</SectionLabel><h2 className="cs-label">{title}</h2><p className="cs-note">{note}</p></Reveal>
    <div>
      <ul className="cs-list">{items.map((item, index) => <motion.li key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: index * 0.05, duration: 0.5, ease }}><b>{item.title}</b><span>{item.text}</span></motion.li>)}</ul>
      {footer && <Reveal><p className="cs-insight">{footer}</p></Reveal>}
    </div>
  </div>;
}

export function HowIWork() {
  return <section className="cs-section cs-paper">
    <div className="cs-split">
      <Reveal className="cs-side"><SectionLabel>Process</SectionLabel><h2 className="cs-label">How I work</h2><p className="cs-note">Every project starts by understanding the people and the market before opening a design tool.</p></Reveal>
      <ol className="ux-how-list">{howIWork.map((step, index) => <motion.li key={step} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: (index % 4) * 0.07, duration: 0.5, ease }}><span>{pad(index + 1)}</span>{step}</motion.li>)}</ol>
    </div>
  </section>;
}

export function NextCase({ href, title }: { href: string; title: string }) {
  return <Link href={href} className="cs-next">
    <span className="cs-next-kicker">Next case study</span>
    <span className="cs-next-title">{title}</span>
    <ArrowRight className="cs-next-arrow" size={44} strokeWidth={1.5} />
  </Link>;
}

export function CaseCta() {
  return <section className="cs-cta">
    <Reveal><SectionLabel>Let&apos;s talk</SectionLabel><h2>Let&apos;s design something people <em>trust.</em></h2></Reveal>
    <Reveal delay={0.1} className="actions"><a className="button" href={`mailto:${contact.email}`}><Mail size={16} /> Email Waseem <ArrowUpRight size={16} /></a><a className="button-ghost" href="#top">Back to top</a></Reveal>
  </section>;
}
