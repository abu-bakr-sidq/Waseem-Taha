"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { Fragment, useRef } from "react";
import { SectionLabel, ease } from "./ui";
import { AboutWatchStage } from "./watch-flight";

/* About: masked headline with a Figma text selection, a scroll-scrubbed bio and a labelled spec sheet,
   beside the product stage where the hero's watch lands. */

const bio = "Waseem is a multidisciplinary Brand & Creative Designer with 4+ years across branding, social media, print, and content-led creative — now backed by UI/UX training.";
const keyWords = new Set(["Brand", "&", "Creative", "Designer", "4+", "years", "UI/UX"]);
const disciplines = ["Brand design", "Campaign creative", "UI/UX knowledge"];
const steps = [
  { title: "Creative direction", text: "Concepts, copy and shoot scripts" },
  { title: "Content strategy", text: "Campaign plans and content calendars" },
  { title: "Final visual execution", text: "Print, social, packaging and web" },
];
const pad = (value: number) => String(value).padStart(2, "0");

const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const rise: Variants = { hidden: { y: "110%" }, visible: { y: "0%", transition: { duration: 0.85, ease } } };
const pop: Variants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } };
const select: Variants = { hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 1], transition: { delay: 0.8, duration: 2.8, times: [0, 0.18, 0.82, 1], ease: "easeInOut" } } };

function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return <>{words.map((word, index) => <Fragment key={`${word}-${index}`}><span className="about-word"><motion.span variants={rise}>{word}</motion.span></span>{index < words.length - 1 && " "}</Fragment>)}</>;
}

function ScrubWord({ word, progress, range, strong }: { word: string; progress: MotionValue<number>; range: [number, number]; strong: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span className={strong ? "is-key" : undefined} style={{ opacity }}>{word} </motion.span>;
}

/* The bio inks in word by word as it crosses the viewport, whatever order the columns stack in. */
function ScrubBio() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 42%"] });
  const done = useMotionValue(1);
  const progress = reduce ? done : scrollYProgress;
  const words = bio.split(" ");
  return <p ref={ref}>{words.map((word, index) => <ScrubWord key={index} word={word} progress={progress} range={[(index / words.length) * 0.8, (index / words.length) * 0.8 + 0.2]} strong={keyWords.has(word)} />)}</p>;
}

export function About() {
  return <section id="about" className="about about-stage">
    <div className="about-copy">
      <motion.div className="about-topline" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55, ease }}><SectionLabel>About me</SectionLabel><span>02 / 07</span></motion.div>
      <div className="about-core">
        <motion.h2 variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
          <Words text="Ideas with a" /><br />
          <em><Words text="visual point" /><br /><Words text="of view." /><motion.span className="about-select" variants={select} aria-hidden="true"><i /><i /><i /><i /><b>Text · Archivo Black</b></motion.span></em>
        </motion.h2>
        <ScrubBio />
      </div>
      <motion.div className="about-spec" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
        <motion.div className="about-row" variants={pop}>
          <p className="about-row-label">What I do</p>
          <div className="about-disciplines">{disciplines.map((item) => <span key={item}>{item}</span>)}</div>
        </motion.div>
        <motion.div className="about-row" variants={pop}>
          <p className="about-row-label">How I work</p>
          <ol className="about-steps">{steps.map((item, index) => <li key={item.title}><span>{pad(index + 1)}</span><b>{item.title}</b><small>{item.text}</small></li>)}</ol>
        </motion.div>
        <motion.div className="about-row" variants={pop}>
          <p className="about-row-label">Education</p>
          <ul className="about-edu"><li><b>BBA</b><span>Vels University</span></li><li><b>UI/UX Design</b><span>Aspira UI UX Design Institute · 6-month programme</span></li></ul>
        </motion.div>
        <motion.div className="about-actions" variants={pop}>
          <a className="button" href="#experience">View experience <ArrowUpRight size={16} /></a>
        </motion.div>
      </motion.div>
    </div>
    <div className="about-visual">
      <div className="about-visual-meta"><span>PROFILE / 02</span><span>DESIGN IN PRACTICE</span></div>
      <AboutWatchStage />
      <div className="about-index" aria-hidden="true"><span>SCROLL</span><i /><b>02</b></div>
      <div className="about-frame" aria-hidden="true" /><div className="about-guides" aria-hidden="true"><i /><i /><span>W.T / 2026</span></div>
    </div>
  </section>;
}
