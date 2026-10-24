"use client";

import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Signature, ease } from "./ui";

/* Opening sequence: a Figma frame draws while the disciplines ride a variable-font wave through it and an
   odometer counts to 100, then the frame signs Waseem's name. */

let played = false;
export const introPlayed = () => played;

const words = ["Brand", "Campaigns", "Social", "Packaging", "UX / UI"];
const BEAT = 0.62;

// Letters arrive thin and wide, settle bold and tight, and leave thin again: one wave per word.
// The outgoing word fades first and clears before the incoming letters rise, so two words never overlap.
const wordWave: Variants = { in: { transition: { staggerChildren: 0.026, delayChildren: 0.13 } }, out: { transition: { staggerChildren: 0.01 } } };
const letterWave: Variants = {
  hidden: { y: "72%", opacity: 0, fontWeight: 100, fontStretch: "125%" },
  in: { y: "0%", opacity: 1, fontWeight: 800, fontStretch: "100%", transition: { duration: 0.42, ease } },
  out: { y: "-60%", opacity: 0, fontWeight: 100, fontStretch: "125%", transition: { duration: 0.2, ease: [0.4, 0, 0.6, 1], opacity: { duration: 0.12, ease: "linear" } } },
};

function Word({ text }: { text: string }) {
  return <motion.span className="intro-letters" variants={wordWave} initial="hidden" animate="in" exit="out">
    {[...text].map((char, index) => <motion.span key={index} variants={letterWave}>{char === " " ? " " : char}</motion.span>)}
  </motion.span>;
}

// One odometer wheel: the ones place rolls continuously; higher places roll only while carrying.
function Wheel({ count, place }: { count: MotionValue<number>; place: 1 | 10 | 100 }) {
  const y = useTransform(count, (value) => {
    const v = Math.min(100, Math.max(0, value));
    const position = place === 1 ? v % 10 : (Math.floor(v / place) % 10) + Math.max(0, (v % place) - (place - 1));
    return `${-position}em`;
  });
  const faces = place === 100 ? [" ", "1"] : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  return <span className="odo-wheel"><motion.span className="odo-faces" style={{ y }}>{faces.map((face, i) => <span key={i}>{face}</span>)}</motion.span></span>;
}

export function Intro({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(() => !played);
  const [word, setWord] = useState(0);
  const [complete, setComplete] = useState(false);
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const beat = useMotionValue(0);
  const weight = useTransform(count, [0, 100], [200, 800]);
  const size = useTransform(count, (value) => `${Math.round(value * 14.4)} × ${Math.round(value * 9)}`);
  const bar = useTransform(count, [0, 100], [0, 1]);

  useMotionValueEvent(beat, "change", (value) => setWord(Math.min(words.length - 1, Math.floor(value))));

  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    let timer = 0;
    const total = reduce ? 0.3 : BEAT * words.length;
    // The counter eases, but the words keep an even beat so every discipline gets the same screen time.
    const cycle = animate(beat, words.length, { duration: total, ease: "linear" });
    const controls = animate(count, 100, { duration: total, ease: [0.4, 0, 0.2, 1] });
    controls.then(() => {
      setComplete(true);
      // Hold until the signature is signed and the cap has dropped onto the T.
      timer = window.setTimeout(() => { played = true; setVisible(false); onDone(); }, reduce ? 80 : 1900);
    });
    return () => { controls.stop(); cycle.stop(); window.clearTimeout(timer); root.style.overflow = ""; };
  }, [beat, count, onDone, reduce, visible]);

  return <AnimatePresence>
    {visible && <motion.div key="wipe" className="intro-wipe" exit={{ clipPath: "inset(0% 0% 100% 0%)" }} transition={{ delay: 0.14, duration: 0.85, ease: [0.77, 0, 0.18, 1] }} aria-hidden="true" />}
    {visible && <motion.div key="intro" className="intro" role="status" aria-label="Loading portfolio" exit={{ clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.85, ease: [0.77, 0, 0.18, 1] }}>
      <div className="intro-top"><span>WT / Portfolio 2026</span><span>Brand · Creative · UX / UI</span></div>
      <div className="intro-stage">
        <motion.div className="intro-frame" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <motion.i className="intro-edge is-x" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.1, duration: 0.7, ease }} />
          <motion.i className="intro-edge is-y" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.35, duration: 0.7, ease }} />
          <span className="intro-handle" /><span className="intro-handle" /><span className="intro-handle" /><span className="intro-handle" />
          <span className="intro-label">Frame · Waseem Taha</span>
          <div className="intro-word"><AnimatePresence>{complete
            ? <motion.span key="name" className="is-name" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}><Signature draw="mount" delay={0.1} label="Waseem Taha" /></motion.span>
            : <Word key={word} text={words[word]} />}</AnimatePresence></div>
          <motion.span className="intro-size">{size}</motion.span>
        </motion.div>
      </div>
      <div className="intro-bottom">
        <span>Brand &amp; Creative Designer<br />Chennai, India</span>
        <p className="intro-count" aria-hidden="true"><motion.span className="odo" style={{ fontWeight: weight }}><Wheel count={count} place={100} /><Wheel count={count} place={10} /><Wheel count={count} place={1} /></motion.span><small>%</small></p>
      </div>
      <motion.i className="intro-bar" style={{ scaleX: bar }} />
    </motion.div>}
  </AnimatePresence>;
}
