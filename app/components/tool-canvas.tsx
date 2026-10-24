"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Frame, Hand, MessageCircle, MousePointer2, PenTool, Type } from "lucide-react";
import { useRef, useState } from "react";
import { tools, type Tool } from "../content";

/* Skills as a Figma canvas: scroll assembles the tool cubes, then walks a selection through them. */

const ASSEMBLE = 0.3;
const SELECT_FROM = 0.34;
const SELECT_TO = 0.97;
const pad = (value: number) => String(value).padStart(2, "0");

const scatter = [
  { x: -36, y: -38, z: -320, r: -30, rx: 40, ry: -55, s: 0.45 },
  { x: 2, y: -52, z: -480, r: 16, rx: -35, ry: 40, s: 0.38 },
  { x: 38, y: -30, z: -360, r: 34, rx: 30, ry: 60, s: 0.42 },
  { x: -42, y: 34, z: -420, r: 22, rx: -45, ry: -35, s: 0.4 },
  { x: 4, y: 50, z: -300, r: -18, rx: 50, ry: 30, s: 0.46 },
  { x: 40, y: 36, z: -380, r: -34, rx: -30, ry: -60, s: 0.42 },
];

function CodeCube({ tool }: { tool: Tool }) {
  return <span className="tc-code-cube"><span className="tc-code-top" /><span className="tc-code-front"><span className="tc-code-face">{tool.abbr}</span></span></span>;
}

function Cube({ tool, index, progress, active, ready, onSelect }: { tool: Tool; index: number; progress: MotionValue<number>; active: boolean; ready: boolean; onSelect: () => void }) {
  const from = scatter[index % scatter.length];
  const range = [0.02 + index * 0.025, ASSEMBLE];
  const x = useTransform(progress, range, [`${from.x}vw`, "0vw"]);
  const y = useTransform(progress, range, [`${from.y}vh`, "0vh"]);
  const z = useTransform(progress, range, [from.z, 0]);
  const rotate = useTransform(progress, range, [from.r, 0]);
  const rotateX = useTransform(progress, range, [from.rx, 0]);
  const rotateY = useTransform(progress, range, [from.ry, 0]);
  const scale = useTransform(progress, range, [from.s, 1]);
  const opacity = useTransform(progress, [range[0], range[0] + 0.1], [0, 1]);
  return <motion.button type="button" className={`tc-cube${active ? " is-active" : ""}`} style={{ x, y, z, rotate, rotateX, rotateY, scale, opacity }} onClick={onSelect} aria-pressed={active} aria-label={`${tool.name}: ${tool.use}`}>
    <span className="tc-cube-inner" style={{ "--tool": tool.color } as React.CSSProperties}>
      <motion.span className="tc-cube-body" animate={{ scale: active && ready ? 1.08 : 1, y: active && ready ? -8 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
        <span className="tc-cube-float" style={{ animationDelay: `${index * -0.8}s` }}>{tool.cube ? <Image src={tool.cube} alt="" fill sizes="(max-width: 760px) 30vw, 14vw" /> : <CodeCube tool={tool} />}</span>
      </motion.span>
      <span className="tc-cube-name">{tool.name}</span>
      {ready && active && <motion.span layoutId="tc-selection" className="tc-selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 320, damping: 32 }} aria-hidden="true"><i /><i /><i /><i /><b>{tool.name}</b><em>720 × 720</em></motion.span>}
      {ready && active && <motion.span layoutId="tc-cursor" className="tc-cursor" transition={{ type: "spring", stiffness: 190, damping: 24 }} aria-hidden="true"><svg viewBox="0 0 16 18"><path d="M1.2 1.2 14 7.4 8.4 9.1 6 14.6Z" /></svg><span>Waseem</span></motion.span>}
    </span>
  </motion.button>;
}

export function ToolCanvas() {
  const scene = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start 70%", "end end"] });
  const still = useMotionValue(1);
  const progress = reduce ? still : scrollYProgress;
  const [scrollIndex, setScrollIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const canvasScale = useTransform(progress, [0, ASSEMBLE], [0.84, 1]);
  const gridShift = useTransform(progress, [0, 1], ["0px", "-260px"]);
  const zoom = useTransform(progress, [0, ASSEMBLE], [25, 100], { clamp: true });
  const zoomText = useTransform(zoom, (value) => `${Math.round(value)}%`);
  const hintOpacity = useTransform(progress, [0.9, 0.99], [1, 0]);

  useMotionValueEvent(progress, "change", (value) => {
    setReady(value >= ASSEMBLE);
    const next = Math.min(tools.length - 1, Math.max(0, Math.floor(((value - SELECT_FROM) / (SELECT_TO - SELECT_FROM)) * tools.length)));
    if (next !== lastIndex.current) {
      lastIndex.current = next;
      setScrollIndex(next);
      setPicked(null);
    }
  });

  const showReady = ready || Boolean(reduce);
  const active = picked ?? scrollIndex;
  const tool = tools[active];

  return <div ref={scene} className={`tc${reduce ? " is-static" : ""}`}>
    <div className="tc-sticky">
      <div className="tc-window">
        <div className="tc-toolbar">
          <div className="tc-icons" aria-hidden="true"><span className="is-on"><MousePointer2 size={15} /></span><span><Frame size={15} /></span><span><PenTool size={15} /></span><span><Type size={15} /></span><span><Hand size={15} /></span><span><MessageCircle size={15} /></span></div>
          <p className="tc-file"><span>Waseem Taha /</span> Toolkit</p>
          <div className="tc-share"><span className="tc-avatar" aria-hidden="true">W</span><motion.span className="tc-zoom" aria-hidden="true">{zoomText}</motion.span><span className="tc-share-btn">Share</span></div>
        </div>
        <div className="tc-body">
          <aside className="tc-layers">
            <p className="tc-panel-title">Layers</p>
            <ul>{tools.map((item, index) => <li key={item.name}><button type="button" className={index === active ? "is-on" : ""} onClick={() => setPicked(index)}>{index === active && <motion.span layoutId="tc-layer" className="tc-layer-hl" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}<i style={{ background: item.color }} />{item.name}<small>{item.abbr}</small></button></li>)}</ul>
            <p className="tc-panel-title">Pages</p>
            <ul className="tc-pages"><li className="is-on">Toolkit</li><li>Brand work</li><li>UX case studies</li></ul>
          </aside>
          <motion.div className="tc-canvas" style={{ backgroundPositionY: gridShift }}>
            <div className="tc-ruler is-top" aria-hidden="true">{Array.from({ length: 13 }, (_, index) => <span key={index}>{index * 200}</span>)}</div>
            <div className="tc-ruler is-left" aria-hidden="true" />
            <motion.div className="tc-board" style={{ scale: canvasScale }}>
              <p className="tc-frame-label"><i />Frame · Tools I design with</p>
              <div className="tc-stage">{tools.map((item, index) => <Cube key={item.name} tool={item} index={index} progress={progress} active={index === active} ready={showReady} onSelect={() => setPicked(index)} />)}</div>
            </motion.div>
            <motion.p className="tc-hint" style={{ opacity: reduce ? 0 : hintOpacity }} aria-hidden="true">{showReady ? "Keep scrolling to inspect each tool" : "Scroll to assemble the toolkit"}</motion.p>
          </motion.div>
          <aside className="tc-props" aria-live="polite">
            <div className="tc-tabs" aria-hidden="true"><span className="is-on">Design</span><span>Prototype</span></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={tool.name} className="tc-props-body" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
                <p className="tc-prop-title"><i style={{ background: tool.color }} />{tool.name}<small>{tool.maker}</small></p>
                <dl className="tc-xywh" aria-hidden="true"><div><dt>X</dt><dd>{120 + (active % 3) * 840}</dd></div><div><dt>Y</dt><dd>{96 + Math.floor(active / 3) * 840}</dd></div><div><dt>W</dt><dd>720</dd></div><div><dt>H</dt><dd>720</dd></div></dl>
                <p className="tc-prop-label">Used for</p>
                <p className="tc-prop-text">{tool.use}</p>
                <p className="tc-prop-label">Fill</p>
                <p className="tc-fill"><i style={{ background: tool.color }} />{tool.color.toUpperCase()}<span>100%</span></p>
                <p className="tc-prop-label">Effects</p>
                <p className="tc-prop-text">Neon glow · Glass bevel</p>
              </motion.div>
            </AnimatePresence>
            <p className="tc-count"><b>{pad(active + 1)}</b> / {pad(tools.length)}</p>
          </aside>
        </div>
      </div>
    </div>
  </div>;
}
