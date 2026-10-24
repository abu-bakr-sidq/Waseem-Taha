"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type RefObject } from "react";
import { LocalTime, ease } from "./ui";

/* The watch leaves Waseem's wrist in the hero and lands in About. Scroll scrubs the flight between two anchors,
   the cutout on the hero photo and the slot in the About stage; the fixed flyer only shows in between. */

type Phase = "start" | "flying" | "arriving" | "landed" | "static";
type Point = { x: number; y: number };
type Box = Point & { w: number; h: number };
type Ctx = { hero: RefObject<HTMLDivElement | null>; about: RefObject<HTMLDivElement | null>; phase: Phase };

const WatchContext = createContext<Ctx | null>(null);
function useWatch() {
  const ctx = useContext(WatchContext);
  if (!ctx) throw new Error("Watch components must sit inside <WatchFlight>");
  return ctx;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (from: number, to: number, value: number) => { const t = clamp((value - from) / (to - from)); return t * t * (3 - 2 * t); };
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const inOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const boxOf = (el: HTMLElement): Box => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; };
/* Different easing on each axis bends the route into an arc; the sine term lifts it like a toss. */
const routeAt = (a: Box, b: Box, t: number, vh: number): Point => ({ x: lerp(a.x, b.x, inOutCubic(t)), y: lerp(a.y, b.y, inOutSine(t)) - Math.sin(Math.PI * t) * vh * 0.07 });
const pathOf = (a: Box, b: Box, to: number, vh: number) => Array.from({ length: 33 }, (_, i) => { const q = routeAt(a, b, (to * i) / 32, vh); return `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`; }).join(" ");

export function WatchFlight({ children }: { children: React.ReactNode }) {
  const hero = useRef<HTMLDivElement>(null);
  const about = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const faces = useRef<(HTMLDivElement | null)[]>([]);
  const noodle = useRef<SVGSVGElement>(null);
  const route = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const origin = useRef<SVGCircleElement>(null);
  const tag = useRef<HTMLParagraphElement>(null);
  const tagWidth = useRef(0);
  const lastP = useRef(-1);
  const phaseRef = useRef<Phase>("start");
  const [phase, setPhase] = useState<Phase>("start");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const update = useCallback(() => {
    const h = hero.current, a = about.current, f = flyer.current, c = card.current;
    if (!h || !a || !f || !c) return;
    const vh = window.innerHeight, sy = window.scrollY;
    const A = boxOf(h), B = boxOf(a);
    if (!tagWidth.current && tag.current) tagWidth.current = tag.current.offsetWidth;
    const start = Math.max(0, A.y + sy - vh * 0.72);
    // Land while the slot is still a little below centre, so the callouts are up by the time About fills the screen.
    const end = Math.max(start + 260, B.y + sy - vh * 0.64);
    const p = clamp((sy - start) / (end - start));
    const next: Phase = p <= 0 ? "start" : p >= 1 ? "landed" : p > 0.84 ? "arriving" : "flying";
    if (next !== phaseRef.current) { phaseRef.current = next; setPhase(next); }
    // Parked at either end the flyer is hidden, so only the first frame there needs drawing.
    if ((p <= 0 || p >= 1) && p === lastP.current) return;
    lastP.current = p;

    const e = inOutCubic(p), lift = Math.sin(Math.PI * p);
    const w = lerp(A.w, B.w, e), hh = lerp(A.h, B.h, e);
    const at = routeAt(A, B, p, vh);
    f.style.width = `${w}px`;
    f.style.height = `${hh}px`;
    f.style.transform = `translate3d(${at.x - w / 2}px, ${at.y - hh / 2}px, 0)`;
    f.style.filter = `drop-shadow(0 ${lerp(3, 36, lift).toFixed(1)}px ${lerp(4, 42, lift).toFixed(1)}px rgba(0,0,0,${(0.3 + 0.3 * lift).toFixed(2)}))`;
    const flip = smooth(0.5, 0.82, p) * 180;
    c.style.transform = `rotateZ(${(-12 * lift).toFixed(2)}deg) rotateY(${flip.toFixed(2)}deg)`;
    // One watch the whole way: it leaves the wrist graded like the photo, brightens as it lifts, and only becomes the
    // front view while the card is edge-on, so two watches never show at once.
    const handoff = smooth(0.05, 0.2, p);
    const [faceWrist, faceFront] = faces.current;
    if (faceWrist) { faceWrist.style.opacity = String(smooth(90, 78, flip)); faceWrist.style.filter = `contrast(1.08) saturate(.91) brightness(${lerp(0.9, 1, handoff).toFixed(3)})`; }
    if (faceFront) faceFront.style.opacity = String(smooth(90, 102, flip));

    const fade = smooth(0, 0.06, p) * smooth(1, 0.9, p);
    route.current?.setAttribute("d", pathOf(A, B, 1, vh));
    trail.current?.setAttribute("d", pathOf(A, B, p, vh));
    origin.current?.setAttribute("cx", A.x.toFixed(1));
    origin.current?.setAttribute("cy", A.y.toFixed(1));
    if (noodle.current) noodle.current.style.opacity = fade.toFixed(3);
    if (tag.current) {
      // The label rides beside the watch like a prototype tag, flipping sides to stay on screen.
      const vw = window.innerWidth, tw = tagWidth.current;
      let tx = at.x + w / 2 + 14;
      if (tx + tw > vw - 12) tx = at.x - w / 2 - 14 - tw;
      tx = Math.min(vw - tw - 12, Math.max(12, tx));
      tag.current.style.opacity = fade.toFixed(3);
      tag.current.style.transform = `translate3d(${tx.toFixed(1)}px, ${(at.y - hh / 2 + 6).toFixed(1)}px, 0)`;
    }
  }, []);

  useMotionValueEvent(scrollY, "change", () => { if (!reduce) update(); });
  useEffect(() => {
    if (reduce) return;
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduce, update]);

  const shown = reduce ? "static" : phase;
  const flying = shown === "flying" || shown === "arriving";
  return <WatchContext.Provider value={{ hero, about, phase: shown }}>
    {children}
    <svg ref={noodle} className={`flight-noodle${flying ? " is-on" : ""}`} aria-hidden="true">
      <defs><marker id="flight-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 10 5 0 10z" fill="#ff3444" /></marker></defs>
      <path ref={route} className="flight-route" markerEnd="url(#flight-arrow)" />
      <path ref={trail} className="flight-trail" />
      <circle ref={origin} className="flight-origin" r="5" />
    </svg>
    <p ref={tag} className={`flight-tag${flying ? " is-on" : ""}`} aria-hidden="true"><i />Smart animate<span>Hero → About</span></p>
    <div ref={flyer} className={`watch-flyer${flying ? " is-on" : ""}`} aria-hidden="true">
      <div ref={card} className="watch-card">
        <div className="watch-face is-wrist" ref={(el) => { faces.current[0] = el; }}><Image src="/images/hero/hero-watch.png" alt="" fill sizes="20vw" /></div>
        <div className="watch-face is-front" ref={(el) => { faces.current[1] = el; }}><Image src="/images/about/watch-front.png" alt="" fill sizes="30vw" /></div>
      </div>
    </div>
  </WatchContext.Provider>;
}

/* Sits inside the hero photo canvas, fitted over the wrist where the watch was photographed. The flyer starts from
   this same box with the same image, so the handoff is seamless. */
export function HeroWatch() {
  const { hero, phase } = useWatch();
  return <div ref={hero} className={`hero-watch${phase === "start" || phase === "static" ? "" : " is-gone"}`} aria-hidden="true">
    <Image src="/images/hero/hero-watch.png" alt="" fill priority sizes="(max-width: 760px) 26vw, 11vw" />
  </div>;
}

const notes = [
  { n: "01", title: "Strategy", text: "Sets the direction", x: 50, y: 21.5, side: "right" },
  { n: "02", title: "Story", text: "Read at a glance", x: 77, y: 47, side: "right" },
  { n: "03", title: "System", text: "Every part in sync", x: 34, y: 47, side: "left" },
  { n: "04", title: "Craft", text: "Finished by hand", x: 29.5, y: 86, side: "left" },
];

/* About's product stage: the slot the watch lands in, then callouts that map Waseem's approach to its parts. */
export function AboutWatchStage() {
  const { about, phase } = useWatch();
  const landed = phase === "landed" || phase === "static";
  return <div className={`aw-stage is-${phase}`}>
    <div className="aw-rings" aria-hidden="true"><i /><i /><i /></div>
    <p className="aw-caption"><span>Timepiece / 02</span>Built like a watch: every part has a job.</p>
    <div ref={about} className="aw-slot">
      <div className="aw-ghost" aria-hidden="true"><b>Watch</b><small>{phase === "arriving" ? "Snapping into place" : "On its way from the hero"}</small></div>
      <div className={`aw-img${landed ? " is-on" : ""}`}><Image src="/images/about/watch-front.png" alt="Black chronograph watch, front view" fill sizes="(max-width: 760px) 46vw, 24vw" /></div>
      <AnimatePresence>{phase === "landed" && <motion.span key="pulse" className="aw-pulse" initial={{ scale: 0.45, opacity: 0.8 }} animate={{ scale: 2.3, opacity: 0 }} transition={{ duration: 1.2, ease }} aria-hidden="true" />}</AnimatePresence>
      <AnimatePresence>{landed && <motion.span key="select" className="aw-select" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ delay: 0.1, duration: 0.4, ease }} aria-hidden="true"><i /><i /><i /><i /><b>Watch</b><em>612 × 1100</em></motion.span>}</AnimatePresence>
      <ul className="aw-notes">{notes.map((note, index) => <li key={note.title} className={`aw-note is-${note.side}${landed ? " is-on" : ""}`} style={{ "--x": `${note.x}%`, "--y": `${note.y}%`, "--d": `${0.3 + index * 0.14}s` } as React.CSSProperties}>
        <i className="aw-dot"><b>{index + 1}</b></i><span className="aw-line" aria-hidden="true" />
        <span className="aw-label"><b>{note.n}</b><strong>{note.title}</strong><small>{note.text}</small></span>
      </li>)}</ul>
    </div>
    <ol className={`aw-legend${landed ? " is-on" : ""}`}>{notes.map((note) => <li key={note.title}><b>{note.n}</b><strong>{note.title}</strong><small>{note.text}</small></li>)}</ol>
    <p className="aw-clock"><span>Chennai · IST</span><b><LocalTime seconds /></b></p>
  </div>;
}
