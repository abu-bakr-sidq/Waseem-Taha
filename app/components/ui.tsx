"use client";

import { ArrowUp, ArrowUpRight, Instagram, Mail, Menu, X } from "lucide-react";
import { contact } from "../content";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const navItems = [
  { label: "Work", id: "work" },
  { label: "UX / UI", id: "ux" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

export const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay, duration: 0.6, ease }}>{children}</motion.div>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="eyebrow"><span />{children}</p>; }

/* Waseem's signature logo as a colourable mask; it can sign itself left to right behind a pen nib.
   The unclipped wrapper owns the trigger: a fully clipped element never registers as in view.
   "view" re-signs every time it scrolls back into sight; leaving resets it instantly. */
export function Signature({ draw, delay = 0, label, cap = true, className = "" }: { draw?: "mount" | "view"; delay?: number; label?: string; cap?: boolean; className?: string }) {
  const timing = { delay, duration: 1.15, ease: [0.45, 0.05, 0.35, 1] as const };
  const reset = { duration: 0 };
  const ink: Variants = { hidden: { clipPath: "inset(-12% 102% -12% -2%)", transition: reset }, signed: { clipPath: "inset(-12% -2% -12% -2%)", transition: timing } };
  const nib: Variants = {
    hidden: { left: "0%", opacity: 0, transition: reset },
    signed: { left: "100%", opacity: [0, 1, 1, 0], y: [0, -8, 4, -6, 3, -2, 0], transition: { ...timing, opacity: { delay, duration: 1.15, times: [0, 0.08, 0.9, 1] }, y: { delay, duration: 1.15, ease: "easeInOut" } } },
  };
  // Once the pen passes the T, the cap drops onto it and swings to rest from its strap.
  const drop = delay + 0.95;
  const capDrop: Variants = {
    hidden: { opacity: 0, y: "-38%", rotate: -22, transition: reset },
    signed: { opacity: 1, y: "0%", rotate: [-22, 15, -9, 5, -2, 0], transition: { opacity: { delay: drop, duration: 0.15 }, y: { delay: drop, duration: 0.32, ease: "easeIn" }, rotate: { delay: drop + 0.22, duration: 1.5, ease: "easeOut" } } },
  };
  const trigger = draw === "view" ? { initial: "hidden", whileInView: "signed", viewport: { once: false, amount: 0.6 } } : draw === "mount" ? { initial: "hidden", animate: "signed" } : {};
  return <motion.span className={`signature ${className}`} {...trigger} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}>
    <motion.span className="signature-ink" variants={draw ? ink : undefined} />
    {cap && <motion.span className="signature-cap" variants={draw ? capDrop : undefined} />}
    {draw && <motion.i className="signature-nib" variants={nib} />}
  </motion.span>;
}

/* A stat number that counts up once it scrolls into view. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(value, (latest) => String(Math.round(latest)));
  useEffect(() => {
    if (!inView) return;
    if (reduce) { value.set(to); return; }
    const controls = animate(value, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduce, to, value]);
  return <motion.b ref={ref}>{text}</motion.b>;
}

/* WhatsApp glyph (24 × 24), drawn in currentColor so it follows the surrounding text colour. */
export function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>;
}

/* Chennai time, rendered after mount so server and client markup match. */
export function LocalTime({ seconds = false }: { seconds?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), seconds ? 1000 : 15000);
    return () => window.clearInterval(timer);
  }, [seconds]);
  const text = now ? now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", ...(seconds ? { second: "2-digit" } : {}), hour12: true }).toUpperCase() : seconds ? "--:--:-- --" : "--:-- --";
  return <time suppressHydrationWarning>{text}</time>;
}

export function Topline({ label, index, className = "" }: { label: string; index: string; className?: string }) {
  return <motion.div className={`topline ${className}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55, ease }}><SectionLabel>{label}</SectionLabel><span>{index}</span></motion.div>;
}

export function SiteNav({ base = "" }: { base?: string }) {
  const [open, setOpen] = useState(false);
  const href = (id: string) => `${base}#${id}`;
  return <>
    <header className="nav shell">
      <a className="logo" href={href("top")} aria-label="Waseem Taha, home"><Signature draw="mount" delay={0.2} /></a>
      <nav aria-label="Main navigation">{navItems.map((item) => <a key={item.id} href={href(item.id)}>{item.label}</a>)}</nav>
      <a className="button small" href={href("contact")}>Let&apos;s work <ArrowUpRight size={14} /></a>
      <button className="menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button>
    </header>
    <AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button>{navItems.map((item) => <a onClick={() => setOpen(false)} key={item.id} href={href(item.id)}>{item.label}</a>)}</motion.div>}</AnimatePresence>
  </>;
}

export function SiteFooter({ base = "" }: { base?: string }) {
  return <footer className="site-footer shell">
    <div className="site-footer-top">
      <a className="site-footer-brand" href={`${base}#top`} aria-label="Waseem Taha, back to top">
        <Signature draw="view" />
        <span className="site-footer-tag" aria-hidden="true"><i />UI &amp; Brand Designer<i /></span>
      </a>
      <nav aria-label="Footer navigation">{navItems.map((item) => <a key={item.id} href={`${base}#${item.id}`}>{item.label}</a>)}</nav>
      <div className="site-footer-social">
        <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppGlyph size={17} /></a>
        <a href={`mailto:${contact.email}`} aria-label="Email"><Mail size={17} /></a>
      </div>
      <a className="site-footer-up" href={`${base}#top`}>Back to top <ArrowUp size={13} /></a>
    </div>
    <div className="site-footer-bottom"><small>© {new Date().getFullYear()} Waseem Taha. All rights reserved.</small><small>Brand · Campaign · Social · Packaging · UX / UI</small></div>
  </footer>;
}
