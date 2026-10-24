"use client";

import Image from "next/image";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type RefObject } from "react";

/* The cap leaves the logo as you start scrolling, rides the page edge while you read, and lands on Waseem's head in Contact.
   Every position is a pure function of scroll and three anchors (logo, rail, head), so scrolling back plays it in reverse. */

const ASPECT = 1.9084; // cap-fly.png
const LOGO = { x: 0.89457, y: 0.2924, w: 0.18165, r: 31.5 }; // fitted onto the logo's cap, in signature-box units
const HEAD_R = 5; // fitted onto the worn cap; position comes from the .cap-anchor box
const RAIL_R = -8;

type Phase = "logo" | "lift" | "ride" | "land" | "landed" | "static";
type Ctx = { anchor: RefObject<HTMLDivElement | null>; withCap: RefObject<HTMLDivElement | null>; withoutCap: RefObject<HTMLDivElement | null>; phase: Phase };

const CapContext = createContext<Ctx | null>(null);
function useCap() {
  const ctx = useContext(CapContext);
  if (!ctx) throw new Error("Cap components must sit inside <CapJourney>");
  return ctx;
}

const clamp = (value: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (from: number, to: number, value: number) => { const t = clamp((value - from) / (to - from)); return t * t * (3 - 2 * t); };
const outQuad = (t: number) => 1 - (1 - t) ** 2;
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const inOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const outBack = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

export function CapJourney({ children }: { children: React.ReactNode }) {
  const anchor = useRef<HTMLDivElement>(null);
  const withCap = useRef<HTMLDivElement>(null);
  const withoutCap = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const select = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("logo");
  const [phase, setPhase] = useState<Phase>("logo");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Scroll speed tips the cap like a breeze; the gain mutes it whenever the cap must line up with a target.
  const tiltGain = useMotionValue(0);
  const speed = useSpring(useVelocity(scrollY), { stiffness: 140, damping: 24 });
  const tilt = useTransform([speed, tiltGain], ([v, g]: number[]) => clamp(v / 90, -16, 16) * g);

  const update = useCallback(() => {
    const f = flyer.current, a = anchor.current, sig = document.querySelector<HTMLElement>(".nav .signature");
    if (!f || !a || !sig) return;
    const vw = window.innerWidth, vh = window.innerHeight, sy = window.scrollY, mobile = vw <= 760;
    const s = sig.getBoundingClientRect(), hb = a.getBoundingClientRect();
    const L = { x: s.left + LOGO.x * s.width, y: s.top + LOGO.y * s.height, w: LOGO.w * s.width };
    const P = { x: hb.left + hb.width / 2, y: hb.top + hb.height / 2, w: hb.width };
    const edge = Math.min(112, Math.max(24, vw * 0.0525));
    const railX = mobile ? vw - 34 : vw - edge / 2;
    const railW = mobile ? 46 : Math.max(34, Math.min(64, edge - 10));
    const railTop = mobile ? vh - 118 : vh * 0.26;
    const railBottom = mobile ? vh - 118 : vh * 0.72;
    const s1 = vh * 0.32;
    const headDoc = P.y + sy;
    const s3 = Math.max(s1 + 420, headDoc - vh * 0.42);
    const s2 = Math.max(s1 + 180, Math.min(s3 - 240, headDoc - vh * 1.15));

    let next: Phase, x = L.x, y = L.y, w = L.w, r = LOGO.r, show = 1, sel = 0, gain = 0, capOn = 0;
    if (sy <= 0) next = "logo";
    else if (sy < s1) {
      // Lift-off: the cap drops off the T (sinking fast enough to outrun the logo scrolling away), then glides to the rail.
      next = "lift";
      const p = sy / s1, glide = inOutSine(p);
      x = lerp(L.x, railX, glide);
      y = lerp(L.y, railTop, outQuad(p)) - Math.sin(Math.PI * p) * vh * 0.05;
      w = lerp(L.w, railW, glide);
      r = lerp(LOGO.r, RAIL_R, outBack(p));
      sel = smooth(0, 0.12, p) * (1 - smooth(0.72, 1, p));
      gain = 0.5;
    } else if (sy < s2) {
      // Ride: the cap slides down the rail as the page goes by, like a slider thumb.
      next = "ride";
      const q = (sy - s1) / (s2 - s1);
      x = railX; y = lerp(railTop, railBottom, q); w = railW; r = RAIL_R; gain = 1;
    } else if (sy < s3) {
      // Landing: a hop from the rail onto the head as the portrait rises, then the real cap takes over.
      next = "land";
      const p = (sy - s2) / (s3 - s2);
      x = lerp(railX, P.x, inOutCubic(p));
      y = lerp(railBottom, P.y, inOutSine(p)) - Math.sin(Math.PI * p) * vh * 0.09;
      w = lerp(railW, P.w, inOutCubic(p));
      r = lerp(RAIL_R, HEAD_R, smooth(0, 0.92, p)) - Math.sin(Math.PI * p) * 16;
      show = 1 - smooth(0.86, 0.97, p);
      sel = smooth(0, 0.1, p) * (1 - smooth(0.68, 0.84, p));
      gain = 1 - smooth(0.35, 0.7, p);
      capOn = smooth(0.84, 0.95, p);
      if (withoutCap.current) withoutCap.current.style.opacity = String(1 - smooth(0.93, 1, p));
    } else { next = "landed"; capOn = 1; }
    if (next !== "land" && withoutCap.current) withoutCap.current.style.opacity = next === "landed" ? "0" : "1";
    if (withCap.current) withCap.current.style.opacity = String(capOn);
    if (next !== phaseRef.current) { phaseRef.current = next; setPhase(next); }

    const h = w / ASPECT, flying = next === "lift" || next === "ride" || next === "land";
    f.style.visibility = flying ? "visible" : "hidden";
    f.style.opacity = String(show);
    f.style.width = `${w}px`;
    f.style.height = `${h}px`;
    f.style.transform = `translate3d(${(x - w / 2).toFixed(1)}px, ${(y - h / 2).toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg)`;
    f.classList.toggle("is-riding", next === "ride");
    tiltGain.set(gain);
    if (select.current) select.current.style.opacity = sel.toFixed(3);
    if (cursor.current) {
      cursor.current.style.opacity = sel.toFixed(3);
      cursor.current.style.transform = `translate3d(${Math.min(x + w / 2 - 4, vw - 84).toFixed(1)}px, ${(y + h / 2 - 2).toFixed(1)}px, 0)`;
    }
    if (rail.current) {
      rail.current.style.opacity = (smooth(s1, s1 + vh * 0.25, sy) * (1 - smooth(s2 - vh * 0.3, s2, sy))).toFixed(3);
      rail.current.style.transform = `translate3d(${railX.toFixed(1)}px, ${railTop.toFixed(1)}px, 0)`;
      rail.current.style.height = `${railBottom - railTop}px`;
    }
    document.documentElement.toggleAttribute("data-cap-away", next !== "logo");
  }, [tiltGain]);

  useMotionValueEvent(scrollY, "change", () => { if (!reduce) update(); });
  useEffect(() => {
    if (reduce) {
      if (withCap.current) withCap.current.style.opacity = "1";
      if (withoutCap.current) withoutCap.current.style.opacity = "0";
      return;
    }
    update();
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("resize", update); document.documentElement.removeAttribute("data-cap-away"); };
  }, [reduce, update]);

  return <CapContext.Provider value={{ anchor, withCap, withoutCap, phase: reduce ? "static" : phase }}>
    {children}
    <div ref={rail} className="cap-rail" aria-hidden="true"><span>Logo</span><i /><span>Head</span></div>
    <div ref={flyer} className="cap-flyer" aria-hidden="true">
      <motion.div className="cap-tilt" style={{ rotate: tilt }}>
        <div className="cap-bob"><Image src="/images/contact/cap-fly.png" alt="" fill sizes="20vw" /></div>
      </motion.div>
      <span ref={select} className="cap-select"><i /><i /><i /><i /><b>Cap</b></span>
    </div>
    <div ref={cursor} className="cap-cursor" aria-hidden="true"><svg viewBox="0 0 16 18"><path d="M1.2 1.2 14 7.4 8.4 9.1 6 14.6Z" /></svg><span>Waseem</span></div>
  </CapContext.Provider>;
}

/* The Contact portrait: the no-cap photo, the original photo that fades in as the cap lands, and the landing anchor. */
export function CapPhoto({ sizes }: { sizes: string }) {
  const { anchor, withCap, withoutCap } = useCap();
  return <div className="cta-photo">
    <div ref={withoutCap} className="cta-photo-layer"><Image src="/images/contact/contact-no-cap.png" alt="" fill sizes={sizes} /></div>
    <div ref={withCap} className="cta-photo-layer is-cap"><Image src="/images/contact/contact-cap.png" alt="Waseem Taha in a black hoodie and beige cap, side profile" fill sizes={sizes} /></div>
    <div ref={anchor} className="cap-anchor" aria-hidden="true" />
  </div>;
}
