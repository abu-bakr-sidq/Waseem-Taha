"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ease } from "./ui";

/* WooCommerce card visual: the live sites in a browser that switches tabs, with the AI product banners
   dealt in front of it like a deck. Everything pauses while the pointer rests on it. */

const sites = [
  { url: "drtalats.com", src: "/images/work/woocommerce/01.jpg" },
  { url: "sehatclinic.com", src: "/images/work/woocommerce/02.jpg" },
];
const visuals = [
  { src: "/images/work/woocommerce/03.jpg", name: "Nannari sharbat" },
  { src: "/images/work/woocommerce/04.jpg", name: "Hyzin hair oil" },
  { src: "/images/work/woocommerce/05.jpg", name: "Gold face wash" },
  { src: "/images/work/woocommerce/06.jpg", name: "Gel range" },
  { src: "/images/work/woocommerce/07.jpg", name: "Saffron honey gel" },
  { src: "/images/work/woocommerce/08.jpg", name: "Honey range" },
];
const slots = [
  { x: "0%", y: "0%", scale: 1, rotate: -3, opacity: 1 },
  { x: "5%", y: "-14%", scale: 0.92, rotate: 1, opacity: 0.8 },
  { x: "10%", y: "-28%", scale: 0.84, rotate: 5, opacity: 0.5 },
];
const DEAL_MS = 2600;
const DEALS_PER_TAB = 3;

export function StoreShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || reduce || paused) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), DEAL_MS);
    return () => window.clearInterval(timer);
  }, [inView, reduce, paused]);

  const site = Math.floor(tick / DEALS_PER_TAB) % sites.length;
  const next = (site + 1) % sites.length;
  const aboutToSwitch = tick % DEALS_PER_TAB === DEALS_PER_TAB - 1;
  const deck = slots.map((_, offset) => (tick + offset) % visuals.length);

  return <div ref={ref} className="ux-woo-visual" aria-hidden="true" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
    <div className="woo-browser">
      <div className="woo-bar">
        <span className="woo-dots"><i /><i /><i /></span>
        <span className="woo-tabs">{sites.map((item, index) => <span key={item.url} className={`woo-tab${index === site ? " is-on" : ""}`}>
          {index === site && <motion.i layoutId="woo-tab" className="woo-tab-bg" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
          <b>{item.url}</b>
        </span>)}</span>
        {/* A cursor drifts to the next tab just before it opens. */}
        <motion.span className="woo-cursor" initial={false} animate={{ left: aboutToSwitch ? (next === 0 ? "26%" : "56%") : "88%", top: aboutToSwitch ? "58%" : "160%", opacity: aboutToSwitch ? 1 : 0 }} transition={{ duration: 0.9, ease }}>
          <svg viewBox="0 0 16 18"><path d="M1.2 1.2 14 7.4 8.4 9.1 6 14.6Z" /></svg>
        </motion.span>
      </div>
      <div className="woo-view">
        <AnimatePresence initial={false}>
          {/* The outgoing page stays fully visible underneath until the new one has faded in on top, so nothing shows through. */}
          <motion.div key={site} className="woo-shot" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 1, zIndex: 0, transition: { duration: 0.85 } }} style={{ zIndex: 1 }} transition={{ duration: 0.8, ease }}>
            <Image src={sites[site].src} alt="" fill sizes="(max-width: 760px) 85vw, 32vw" />
          </motion.div>
        </AnimatePresence>
        <span className="woo-live">{site === 0 ? "Live store" : "Live site"}</span>
      </div>
    </div>
    <div className="woo-deck">
      <AnimatePresence initial={false}>
        {deck.map((index, slot) => <motion.div key={index} className="woo-card" style={{ zIndex: slots.length - slot }}
          initial={{ opacity: 0, x: "14%", y: "-40%", scale: 0.78, rotate: 8 }} animate={slots[slot]}
          exit={{ opacity: 0, x: "-26%", y: "18%", rotate: -12, scale: 0.96, transition: { duration: 0.55, ease } }} transition={{ duration: 0.7, ease }}>
          <span className="woo-card-img"><Image src={visuals[index].src} alt="" fill sizes="(max-width: 760px) 70vw, 26vw" />{slot === 0 && <i className="woo-scan" />}</span>
          <span className="woo-card-meta"><em>✦ Website banner</em>{visuals[index].name}</span>
        </motion.div>)}
      </AnimatePresence>
    </div>
    <p className="woo-stamp"><s>Photoshoots only</s><b>AI-assisted</b></p>
  </div>;
}
