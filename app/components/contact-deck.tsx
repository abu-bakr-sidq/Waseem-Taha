"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Check, Copy, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useRef, useState } from "react";
import { contact } from "../content";
import { LocalTime, WhatsAppGlyph, ease } from "./ui";
import { qrLogo, qrRows, qrSize } from "./whatsapp-qr-data";

/* Contact deck: spotlight cards for email, phone, Instagram and location around a WhatsApp card whose QR
   assembles module by module, then gets swept by a scanner line. The QR is vector data, so it stays crisp
   and scannable at any size. */

const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  shown: (index: number) => ({ opacity: 1, y: 0, transition: { delay: index * 0.08, duration: 0.7, ease } }),
};

const inLogo = (x: number, y: number) => x >= qrLogo.start && x < qrLogo.start + qrLogo.size && y >= qrLogo.start && y < qrLogo.start + qrLogo.size;
const cells = qrRows.flatMap((row, y) => [...row].flatMap((cell, x) => (cell === "1" && !inLogo(x, y) ? [{ x, y }] : [])));
const QUIET = 2;

// The spotlight follows the pointer inside each card.
const spotlight = (event: React.PointerEvent<HTMLElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
};

function WhatsAppQr() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const box = qrSize + QUIET * 2;
  const logoPad = 0.45;
  const glyph = qrLogo.size * 0.66;
  return <div ref={ref} className={`wa-qr${inView || reduce ? " is-on" : ""}`}>
    <svg viewBox={`${-QUIET} ${-QUIET} ${box} ${box}`} role="img" aria-label="WhatsApp QR code. Scan it to chat with Waseem.">
      <rect className="wa-qr-bg" x={-QUIET} y={-QUIET} width={box} height={box} rx="2.2" />
      {cells.map(({ x, y }) => <rect key={`${x}-${y}`} className="wa-qr-cell" x={x} y={y} width="1.03" height="1.03" style={{ "--d": (x + y) * 13 } as React.CSSProperties} />)}
      <g className="wa-qr-logo">
        <rect x={qrLogo.start - logoPad} y={qrLogo.start - logoPad} width={qrLogo.size + logoPad * 2} height={qrLogo.size + logoPad * 2} rx="2" fill="#fff" />
        <g transform={`translate(${qrLogo.start + (qrLogo.size - glyph) / 2} ${qrLogo.start + (qrLogo.size - glyph) / 2}) scale(${glyph / 24})`} style={{ color: "#111" }}>
          <WhatsAppGlyph size={24} />
        </g>
      </g>
    </svg>
    <span className="wa-qr-scan" aria-hidden="true" />
    <span className="wa-qr-corners" aria-hidden="true"><i /><i /><i /><i /></span>
  </div>;
}

export function ContactDeck() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return <motion.div className="cdeck" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.15 }}>
    <motion.div className="cdeck-card is-email" custom={0} variants={rise} onPointerMove={spotlight}>
      <div className="cdeck-top"><span className="cdeck-icon"><Mail size={18} /></span><span className="cdeck-label">Email</span></div>
      <a className="cdeck-value cdeck-link" href={`mailto:${contact.email}`}>{contact.email}</a>
      <div className="cdeck-foot">
        <span className="cdeck-cta">Write to me <ArrowUpRight size={15} /></span>
        <button type="button" className="cdeck-copy" onClick={copyEmail} aria-live="polite">{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}</button>
      </div>
    </motion.div>

    <motion.div className="cdeck-card is-phone" custom={1} variants={rise} onPointerMove={spotlight}>
      <div className="cdeck-top"><span className="cdeck-icon"><Phone size={18} /></span><span className="cdeck-label">Phone</span></div>
      <a className="cdeck-value cdeck-link" href={contact.phoneHref}>{contact.phone}</a>
      <div className="cdeck-foot"><span className="cdeck-cta">Call now <ArrowUpRight size={15} /></span></div>
    </motion.div>

    <motion.div className="cdeck-card is-whatsapp" custom={2} variants={rise} onPointerMove={spotlight}>
      <div className="cdeck-top"><span className="cdeck-icon"><WhatsAppGlyph size={18} /></span><span className="cdeck-label">WhatsApp</span><span className="cdeck-tag">Scan to chat</span></div>
      <WhatsAppQr />
      <div className="cdeck-wa-side">
        <p className="cdeck-qr-note">Point your phone camera at the code to start a chat, or tap the button.</p>
        <a className="cdeck-wa-btn" href={contact.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppGlyph size={18} /> Chat on WhatsApp <ArrowUpRight size={16} /></a>
      </div>
    </motion.div>

    <motion.div className="cdeck-card is-insta" custom={3} variants={rise} onPointerMove={spotlight}>
      <div className="cdeck-top"><span className="cdeck-icon"><Instagram size={18} /></span><span className="cdeck-label">Instagram</span></div>
      <div className="cdeck-insta">
        <span className="cdeck-ring"><Image src="/images/contact/avatar.jpg" alt="" width={64} height={64} /></span>
        <div><a className="cdeck-value cdeck-link" href={contact.instagram} target="_blank" rel="noopener noreferrer">{contact.instagramHandle}</a><small>Say hi or follow along</small></div>
      </div>
      <div className="cdeck-foot"><span className="cdeck-cta">Follow on Instagram <ArrowUpRight size={15} /></span></div>
    </motion.div>

    <motion.div className="cdeck-card is-place" custom={4} variants={rise} onPointerMove={spotlight}>
      <div className="cdeck-top"><span className="cdeck-icon"><MapPin size={18} /></span><span className="cdeck-label">Based in</span></div>
      <b className="cdeck-value">Perambur, Chennai</b>
      <div className="cdeck-foot"><span className="cdeck-time">India · <LocalTime /> IST</span></div>
      <span className="cdeck-radar" aria-hidden="true"><i /><i /><b /></span>
    </motion.div>
  </motion.div>;
}
