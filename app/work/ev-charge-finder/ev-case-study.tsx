"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MotionConfig, motion } from "framer-motion";
import { ConceptPhone, EvBackdrop, PhoneTrio, Prototype, ScreenPhone, TodayPhone, Wireframe } from "../../components/ev-app";
import { Reveal, SectionLabel, SiteFooter, SiteNav, ease } from "../../components/ui";
import { ev } from "../../content";
import { CaseCta, IntroRow, NextCase, ResearchBlock, pad } from "../case-parts";

const rise = (delay: number) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease } });

export function EvCaseStudy() {
  return <MotionConfig reducedMotion="user"><main className="cs">
    <SiteNav base="/" />

    <section id="top" className="cs-hero">
      <div className="cs-hero-copy">
        <motion.div {...rise(0)}><Link className="cs-back" href="/#ux"><ArrowLeft size={14} /> All case studies</Link></motion.div>
        <motion.p className="cs-kicker" {...rise(0.06)}><span>Case study 01</span>Major UX case study · Figma</motion.p>
        <motion.h1 {...rise(0.12)}>EV charge <em>finder.</em></motion.h1>
        <motion.p className="cs-lede" {...rise(0.2)}>{ev.intro}</motion.p>
        <motion.dl className="cs-facts" {...rise(0.28)}>{ev.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</motion.dl>
      </div>
      <div className="cs-hero-visual"><EvBackdrop label="Frame · Mobile app concept" /><PhoneTrio /><span className="cs-hero-tag">Mobile app concept · High fidelity</span></div>
    </section>

    <section className="cs-section cs-paper">
      <div className="cs-split">
        <Reveal className="cs-side"><SectionLabel>01 · The problem</SectionLabel><h2 className="cs-label">The problem</h2></Reveal>
        <div>
          <Reveal><p className="cs-statement">Drivers don&apos;t fear the drive. They fear <em>arriving at a charger that doesn&apos;t work.</em></p></Reveal>
          <Reveal delay={0.1}><p className="cs-body">{ev.problem}</p></Reveal>
        </div>
      </div>
    </section>

    <section className="cs-section cs-paper is-flush">
      <ResearchBlock label="02 · Users" title="Who it's for" note="Five groups with different reasons to charge away from home." items={ev.audiences} />
      <ResearchBlock label="03 · Pain points" title="What frustrates drivers" note="Pain points from desk research across transport, policy and industry sources." items={ev.frustrations} />
      <ResearchBlock label="04 · Landscape" title="What already exists" note="Five tools and methods I reviewed before designing anything." items={ev.existing} footer={ev.existingInsight} />
    </section>

    <section className="cs-section cs-dark">
      <div className="cs-split">
        <Reveal className="cs-side"><SectionLabel>05 · Interview guide</SectionLabel><h2 className="cs-label">Interview guide</h2><p className="cs-note">Six themes for talking to EV drivers.</p></Reveal>
        <ol className="cs-themes">{ev.themes.map((theme, index) => <motion.li key={theme} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: index * 0.06, duration: 0.55, ease }}><span>{pad(index + 1)}</span>{theme}</motion.li>)}</ol>
      </div>
    </section>

    <section className="cs-section cs-paper">
      <div className="cs-direction">
        <Reveal className="cs-side"><SectionLabel>06 · Design direction</SectionLabel><h2 className="cs-label">Design direction</h2><p className="cs-note">Seven principles taken from the research, shown as a concept sketch.</p></Reveal>
        <ul className="cs-list">{ev.principles.map((item, index) => <motion.li key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: index * 0.04, duration: 0.5, ease }}><b>{item.title}</b><span>{item.text}</span></motion.li>)}</ul>
        <Reveal className="cs-concept" delay={0.1}><ConceptPhone /><p className="cs-caption">Concept sketch with sample data. Tap the filters.</p></Reveal>
      </div>
    </section>

    <section className="cs-section cs-dark">
      <IntroRow label="07 · From problem to prototype" title={<>From problem to <em>prototype.</em></>} note="The EV charge finder taken from the pain points in my research to wireframes, high-fidelity screens and a clickable prototype you can try below." />
      <Reveal className="cs-subhead"><h3>The problem and the solution</h3><p className="cs-note">Same trip, two experiences. On the left, the moment a driver gets stuck. On the right, the same trip with the charge finder.</p></Reveal>
      <div className="cs-compare">
        <Reveal className="cs-compare-col is-bad"><p className="cs-compare-title">Today: stuck at an offline charger</p><p className="cs-note">Every pin looks the same, nothing says whether a station works, and each network wants its own app or card.</p><TodayPhone /></Reveal>
        <Reveal className="cs-compare-col is-good" delay={0.12}><p className="cs-compare-title">With the charge finder: the stop is planned</p><p className="cs-note">The route includes a charge stop that is available, matches the car and shows the battery level on arrival.</p><ScreenPhone step={1} /></Reveal>
      </div>
      <div className="cs-fixes">{ev.fixes.map((fix, index) => <Reveal key={fix.problem} className="cs-fix" delay={(index % 2) * 0.08}><p><span>Problem</span>{fix.problem}</p><p><span>Solution</span>{fix.solution}</p></Reveal>)}</div>
    </section>

    <section className="cs-section cs-paper">
      <IntroRow label="08 · Wireframes" title="Wireframes" note="Low-fidelity layouts to settle structure and hierarchy before any color or type. Four screens cover the core journey from finding a charger to paying for it." />
      <div className="cs-wires">{ev.wireframes.map((item, index) => <motion.figure key={item.kind} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08, duration: 0.7, ease }}><Wireframe kind={item.kind} /><figcaption><b>{item.title}</b>{item.text}</figcaption></motion.figure>)}</div>
    </section>

    <section className="cs-section cs-dark">
      <IntroRow label="09 · Digital screens" title="Digital screens" note="The wireframes in high fidelity, using black for focus and green for anything that says go: available, matching, confirmed." />
      <div className="cs-screens">{ev.screens.map((item, index) => <motion.figure key={item.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.08, duration: 0.75, ease }}><ScreenPhone step={item.step} /><figcaption><b>{item.title}</b>{item.text}</figcaption></motion.figure>)}</div>
    </section>

    <section className="cs-section cs-paper">
      <IntroRow label="10 · Clickable prototype" title={<>Clickable <em>prototype.</em></>} note="Walk through a full charge from planning to receipt. Tap the buttons inside the phone, or jump to any step." />
      <Prototype />
      <p className="cs-caption">Concept prototype with sample data.</p>
    </section>

    <NextCase href="/work/fitness-app-study" title="Fitness app competitor study" />
    <CaseCta />
    <SiteFooter base="/" />
  </main></MotionConfig>;
}
