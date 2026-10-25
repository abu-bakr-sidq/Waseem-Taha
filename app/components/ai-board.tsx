"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { aiCraft, aiFlow, aiTools, tools, type AiStep } from "../content";
import { ease } from "./ui";

/* "AI drafts. I direct." A FigJam-style board pinned for a long, slow scroll. Scroll is the playhead: in each step
   the collaborator cursor arrives, the prompt types letter by letter as you scroll, the output appears, Waseem
   stamps it and the connector draws to the next note. A spring smooths quick flicks; scrolling back rewinds. */

type Box = { x: number; y: number; w: number; h: number };
type Phase = "arrive" | "typing" | "output" | "approved";
type NoteState = "idle" | "active" | "done";

const layouts = {
  wide: {
    view: "0 0 1600 900",
    boxes: [{ x: 2, y: 6, w: 17, h: 40 }, { x: 21, y: 52, w: 17, h: 40 }, { x: 40, y: 6, w: 17, h: 40 }, { x: 59, y: 52, w: 17, h: 40 }, { x: 79, y: 16, w: 19, h: 68 }],
    wires: ["M304 234C400 234 472 330 472 468", "M608 648C720 648 776 540 776 414", "M912 234C1010 234 1080 330 1080 468", "M1216 648C1250 648 1232 450 1264 450"],
    sticker: { x: 3, y: 60 },
  },
  tall: {
    view: "0 0 900 1600",
    boxes: [{ x: 4, y: 2, w: 54, h: 17 }, { x: 42, y: 21, w: 54, h: 17 }, { x: 4, y: 40, w: 54, h: 17 }, { x: 42, y: 59, w: 54, h: 17 }, { x: 6, y: 79, w: 88, h: 19 }],
    wires: ["M279 304C279 324 621 316 621 336", "M621 608C621 628 279 620 279 640", "M279 912C279 932 621 924 621 944", "M621 1216C621 1240 450 1240 450 1264"],
    sticker: { x: 63, y: 3 },
  },
};

const steps: AiStep[] = [...aiFlow, aiCraft];
const DONE = steps.length;
const START = 0.04; // scroll progress where step 1 begins
const END = 0.94; // scroll progress where every step is approved
// Beats inside one step, as a fraction of that step's scroll distance.
const TYPE_FROM = 0.14;
const TYPE_TO = 0.62;
const OUTPUT_AT = 0.66;
const APPROVE_AT = 0.78;
const WIRE_FROM = 0.84;

const pad = (value: number) => String(value).padStart(2, "0");
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const iconFor = (name: string) => aiTools.find((tool) => tool.name === name) ?? tools.find((tool) => tool.name === name);
const phaseOf = (local: number): Phase => (local < TYPE_FROM ? "arrive" : local < OUTPUT_AT ? "typing" : local < APPROVE_AT ? "output" : "approved");

function ToolBadge({ name }: { name: string }) {
  const tool = iconFor(name);
  const src = tool && ("icon" in tool ? tool.icon : "cube" in tool ? tool.cube : undefined);
  return <span className="ab-badge" style={{ borderColor: tool?.color }}>{src ? <Image src={src} alt="" width={28} height={28} /> : <b style={{ color: tool?.color }}>{name.slice(0, 2)}</b>}</span>;
}

// The connector after note `index` draws through the last part of that step, scrubbed by scroll.
function Wire({ d, index, t }: { d: string; index: number; t: MotionValue<number> }) {
  const pathLength = useTransform(t, (v) => clamp01((v - index - WIRE_FROM) / (1 - WIRE_FROM)));
  const opacity = useTransform(pathLength, (v) => (v > 0.002 ? 1 : 0));
  const [flowing, setFlowing] = useState(false);
  useMotionValueEvent(t, "change", (v) => setFlowing(v >= index + 1));
  return <g>
    <path className="ab-wire-base" d={d} />
    <motion.path className="ab-wire" d={d} style={{ pathLength, opacity }} />
    <path className={`ab-wire-flow${flowing ? " is-on" : ""}`} d={d} />
  </g>;
}

// Toolbar progress: one segment per step, filling continuously with scroll.
function Segment({ index, t }: { index: number; t: MotionValue<number> }) {
  const scaleX = useTransform(t, (v) => clamp01(v - index));
  return <i className="ab-seg"><motion.b style={{ scaleX }} /></i>;
}

function Note({ index, step, box, state, phase, typed, final }: { index: number; step: AiStep; box: Box; state: NoteState; phase: Phase; typed: MotionValue<string>; final: boolean }) {
  const craft = index === aiFlow.length;
  const tilt = craft ? 0 : index % 2 ? 1.4 : -1.4;
  const active = state === "active";
  const typing = active && phase === "typing";
  const showText = state === "done" || (active && phase !== "arrive");
  const showOutput = state === "done" || (active && (phase === "output" || phase === "approved"));
  const stamped = state === "done" || (active && phase === "approved");
  return <motion.div className={`ab-note${craft ? " is-craft" : ""} is-${state}`} style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%`, background: step.tone }}
    variants={{ hidden: { opacity: 0, scale: 0.8, y: 24, rotate: index % 2 ? 9 : -9 }, shown: { opacity: 1, scale: 1, y: 0, rotate: tilt, transition: { delay: index * 0.09, duration: 0.65, ease } } }}>
    <p className="ab-note-head"><span>{pad(index + 1)}</span>{step.title}</p>
    <div className="ab-note-tools">{step.tools.map((name) => <ToolBadge key={name} name={name} />)}<small>{step.tools.join(" + ")}</small></div>
    <div className="ab-prompt">
      {!craft && <em>Prompt</em>}
      {!showText && <span className="ab-skeleton" aria-hidden="true"><i /><i /><i /></span>}
      {typing && <p><motion.span>{typed}</motion.span><i className="ab-caret" /></p>}
      {showText && !typing && <p>{step.prompt}</p>}
    </div>
    <AnimatePresence>{showOutput && <motion.span className="ab-output" initial={{ opacity: 0, y: 10, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.45, ease }}>→ {step.output}</motion.span>}</AnimatePresence>
    <AnimatePresence>{stamped && !craft && <motion.span className="ab-stamp" initial={{ scale: 0, rotate: -50 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 420, damping: 16 }}><Check size={15} strokeWidth={3.2} /></motion.span>}</AnimatePresence>
    <AnimatePresence>{craft && (stamped || final) && <motion.span className="ab-approved" initial={{ scale: 2.2, opacity: 0, rotate: -24 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>Approved · W.T</motion.span>}</AnimatePresence>
  </motion.div>;
}

function Cursor({ name, color, icon, at, visible, me = false }: { name: string; color: string; icon?: string; at: { x: number; y: number }; visible: boolean; me?: boolean }) {
  return <motion.div className={`ab-cursor${me ? " is-me" : ""}`} style={{ "--c": color } as React.CSSProperties} initial={false} animate={{ left: `${at.x}%`, top: `${at.y}%`, opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }} transition={{ type: "spring", stiffness: 90, damping: 18, opacity: { duration: 0.3 } }}>
    <svg viewBox="0 0 16 18"><path d="M1.2 1.2 14 7.4 8.4 9.1 6 14.6Z" /></svg>
    <span>{icon ? <Image src={icon} alt="" width={18} height={18} /> : <b>{name.slice(0, 1)}</b>}{name}</span>
  </motion.div>;
}

export function AiBoard() {
  const board = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(board, { amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: board, offset: ["start start", "end end"] });
  const eased = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6, restDelta: 0.0002 });
  const finished = useMotionValue(1);
  // The playhead: 0 before step 1, each whole number one finished step, DONE when the board is approved.
  const t = useTransform(reduce ? finished : eased, (p) => clamp01((p - START) / (END - START)) * DONE);
  const typed = useTransform(t, (v) => {
    const s = Math.floor(v);
    if (s < 0 || s >= DONE) return "";
    const full = steps[s].prompt;
    return full.slice(0, Math.round(full.length * clamp01((v - s - TYPE_FROM) / (TYPE_TO - TYPE_FROM))));
  });
  const [started, setStarted] = useState(false);
  const [pos, setPos] = useState<{ step: number; phase: Phase }>({ step: -1, phase: "arrive" });
  const [tall, setTall] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setTall(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => { if (inView || reduce) setStarted(true); }, [inView, reduce]);

  const sync = useCallback((v: number) => {
    const step = v <= 0 ? -1 : v >= DONE ? DONE : Math.floor(v);
    const phase = step >= 0 && step < DONE ? phaseOf(v - step) : "approved";
    setPos((prev) => (prev.step === step && prev.phase === phase ? prev : { step, phase }));
  }, []);
  useMotionValueEvent(t, "change", sync);
  useEffect(() => { sync(t.get()); }, [sync, t]);

  const { step, phase } = pos;
  const final = step >= DONE;
  const layout = tall ? layouts.tall : layouts.wide;
  const boxAt = (index: number) => layout.boxes[index];
  const stateOf = (index: number): NoteState => (final || index < step ? "done" : index === step ? "active" : "idle");
  const current = step >= 0 && !final ? steps[step] : null;
  const craftStep = step === aiFlow.length;
  const who = current ? current.tools.join(" & ") : "";
  const plural = (current?.tools.length ?? 1) > 1;
  const label = step < 0 ? "Scroll to run the workflow"
    : final || !current ? "All five steps approved"
    : phase === "arrive" ? (craftStep ? "Waseem takes over" : `${who} ${plural ? "join" : "joins"} the board`)
    : phase === "typing" ? (craftStep ? "Waseem is finishing it by hand…" : `${who} ${plural ? "are" : "is"} typing…`)
    : phase === "output" ? `Output: ${current.output}`
    : craftStep ? "Signed off" : `${current.title} approved`;
  const stepLabel = final ? "Done" : step < 0 ? "Ready" : `Step ${step + 1} of ${DONE}`;
  const watching = phase === "arrive" || phase === "typing";
  const waseemAt = step < 0 ? { x: 50, y: 108 }
    : final ? { x: boxAt(4).x + boxAt(4).w * 0.62, y: boxAt(4).y + boxAt(4).h * 0.7 }
    : watching ? { x: boxAt(step).x + boxAt(step).w * 0.12, y: boxAt(step).y + boxAt(step).h * 0.82 }
    : { x: boxAt(step).x + boxAt(step).w - 3, y: boxAt(step).y + 1 };

  return <>
    <div className="ab-intro">
      <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease }}>
        <p className="ab-kicker">AI in my workflow</p>
        <h3>AI drafts.<br /><em>I direct.</em></h3>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.1, duration: 0.7, ease }}>
        <p>I use AI to move faster on research, ideas, scripts and visuals. For one WooCommerce store, AI-assisted workflows created the product and model imagery without relying entirely on photoshoots. The judgement, art direction and final polish stay mine.</p>
        <ul className="ab-chips">{aiTools.map((tool) => <li key={tool.name} style={{ "--c": tool.color } as React.CSSProperties}>{tool.icon ? <Image src={tool.icon} alt="" width={20} height={20} /> : <b>{tool.name.slice(0, 2)}</b>}{tool.name}</li>)}</ul>
      </motion.div>
    </div>

    <div ref={board} className={`ab${tall ? " is-tall" : ""}${reduce ? " is-static" : ""}`}>
      <div className="ab-frame">
        <div className="ab-window">
          <div className="ab-toolbar">
            <p className="ab-file"><i>AI</i><span>Waseem Taha /</span> AI workflow<small>Example prompts</small></p>
            <p className="ab-status" aria-live="polite">
              <span className="ab-segs" aria-hidden="true">{steps.map((item, index) => <Segment key={item.title} index={index} t={t} />)}</span>
              <b className="ab-step">{stepLabel}</b><span className="ab-label">{label}</span>
              {!final && step >= 0 && <span className="ab-hint">· keep scrolling</span>}
            </p>
            <div className="ab-people" aria-hidden="true">{aiTools.map((tool) => <span key={tool.name} style={{ borderColor: tool.color }}>{tool.icon ? <Image src={tool.icon} alt="" width={22} height={22} /> : <b style={{ color: tool.color }}>{tool.name.slice(0, 1)}</b>}</span>)}<span className="is-me">W</span></div>
          </div>
          <div className="ab-board">
            <motion.div className="ab-stage" initial="hidden" animate={started ? "shown" : "hidden"}>
              <p className="ab-section-tab">Prompt → production</p>
              <svg className="ab-wires" viewBox={layout.view} aria-hidden="true">{layout.wires.map((d, index) => <Wire key={`${tall}-${index}`} d={d} index={index} t={t} />)}</svg>
              {steps.map((item, index) => <Note key={item.title} index={index} step={item} box={boxAt(index)} state={stateOf(index)} phase={phase} typed={typed} final={final} />)}
              {aiFlow.flatMap((item, index) => item.tools.map((name, k) => {
                const tool = iconFor(name);
                const box = boxAt(index);
                const here = step === index && watching;
                const spread = tall ? 0.3 + k * 0.24 : 0.42 + k * 0.3;
                return <Cursor key={name} name={name} color={tool?.color ?? "#111"} icon={tool && "icon" in tool ? tool.icon : undefined} visible={here} at={here ? { x: box.x + box.w * spread, y: box.y + box.h * (0.5 + k * 0.16) } : { x: 104, y: 40 + index * 10 + k * 6 }} />;
              }))}
              <Cursor name="Waseem" color="#ffd23f" visible={started && step >= 0} at={waseemAt} me />
              <AnimatePresence>{final && <motion.div className="ab-sticker" style={{ left: `${layout.sticker.x}%`, top: `${layout.sticker.y}%` }} initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}><s>Photoshoots only</s><b>AI-assisted.</b><span>Website banners for a WooCommerce store</span></motion.div>}</AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </>;
}
