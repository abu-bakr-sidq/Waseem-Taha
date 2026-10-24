"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, Check, CirclePlay, Clapperboard, Download, GraduationCap, Mail, Palette, Smartphone } from "lucide-react";
import { MotionConfig, animate, motion, motionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AiBoard } from "./components/ai-board";
import { About } from "./components/about";
import { CapJourney, CapPhoto } from "./components/cap-journey";
import { ContactDeck } from "./components/contact-deck";
import { FigmaDock } from "./components/dock";
import { EvShowcase } from "./components/ev-app";
import { Intro, introPlayed } from "./components/intro";
import { StoreShowcase } from "./components/store-showcase";
import { ToolCanvas } from "./components/tool-canvas";
import { CountUp, LocalTime, Reveal, SectionLabel, Signature, SiteFooter, SiteNav, Topline, ease } from "./components/ui";
import { HeroWatch, WatchFlight } from "./components/watch-flight";
import { WorkGallery } from "./components/work-gallery";
import { brands, caseStudies, certifications, contact, education, ev, fitness, howIWork, roles, skillGroups, works } from "./content";

const pad = (value: number) => String(value).padStart(2, "0");
const groupIcons = [Palette, Clapperboard, Smartphone];
/* Masked words are driven by their parent: an element translated out of an overflow mask never registers as in view. */
const wordStagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const wordRise: Variants = { hidden: { y: "110%" }, visible: { y: "0%", transition: { duration: 0.85, ease } } };

/* The name rides a variable-font wave in (thin and wide, settling black and tight), then a line-shaded copy slides
   out behind it like an engraved print shadow, and the letters answer the pointer: the closer it gets, the thinner they go. */
const nameLines = ["WASEEM", "TAHA"];
const nameCount = nameLines.join("").length;

function KineticName() {
  const reduce = useReducedMotion();
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const settled = useRef(false);
  const [weights] = useState(() => Array.from({ length: nameCount }, () => motionValue(160)));
  const [stretches] = useState(() => Array.from({ length: nameCount }, () => motionValue("112%")));
  const offset = useMotionValue(0);
  const echoX = useTransform(offset, (v) => `${(0.08 * v).toFixed(4)}em`);
  const echoY = useTransform(offset, (v) => `${(0.09 * v).toFixed(4)}em`);

  useEffect(() => {
    if (reduce) {
      weights.forEach((w) => w.set(900));
      stretches.forEach((s) => s.set("100%"));
      offset.set(1);
      settled.current = true;
      return;
    }
    const morph = { duration: 1.15, ease: [0.16, 1, 0.3, 1] as const };
    const controls = weights.flatMap((weight, i) => [animate(weight, 900, { ...morph, delay: 0.12 + i * 0.055 }), animate(stretches[i], "100%", { ...morph, delay: 0.12 + i * 0.055 })]);
    const slide = animate(offset, 1, { delay: 0.12 + nameCount * 0.055 + 0.2, duration: 0.8, ease });
    slide.then(() => { settled.current = true; });
    return () => { controls.forEach((c) => c.stop()); slide.stop(); };
  }, [offset, reduce, stretches, weights]);

  const onMove = (event: React.PointerEvent) => {
    if (!settled.current) return;
    spans.current.forEach((el, i) => {
      if (!el) return;
      const box = el.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (box.left + box.width / 2), (event.clientY - (box.top + box.height / 2)) * 1.4);
      const pull = Math.max(0, 1 - distance / 230);
      animate(weights[i], 900 - 640 * pull * pull, { type: "spring", stiffness: 320, damping: 30 });
    });
  };
  const onLeave = () => { if (settled.current) weights.forEach((w) => animate(w, 900, { type: "spring", stiffness: 200, damping: 26 })); };

  // Both layers share the same weight and width values, so the outline copy follows every morph exactly.
  const layer = (echo: boolean) => {
    let index = 0;
    return nameLines.map((line, row) => <span key={line} className={`name-line ${row ? "name-line-accent" : "name-line-main"}`} aria-hidden="true">
      {[...line].map((char) => {
        const i = index++;
        const style = { fontWeight: weights[i], fontStretch: stretches[i] };
        if (echo) return <motion.span key={i} className="name-letter" style={style}>{char}</motion.span>;
        return <motion.span key={i} ref={(el) => { spans.current[i] = el; }} className="name-letter" style={style} initial={reduce ? false : { opacity: 0, y: "42%" }} animate={{ opacity: 1, y: "0%" }} transition={{ delay: 0.12 + i * 0.055, duration: 0.85, ease }}>{char}</motion.span>;
      })}
    </span>);
  };

  return <h1 aria-label="Waseem Taha" onPointerMove={onMove} onPointerLeave={onLeave}>
    <motion.span className="name-echo" aria-hidden="true" style={{ x: echoX, y: echoY, opacity: offset }}>{layer(true)}</motion.span>
    {layer(false)}
  </h1>;
}

/* Handwriting: each word inks in left to right behind a moving pen nib, then a swoosh underlines the last word. */
function HandNote() {
  const pen = [0.42, 0.05, 0.4, 0.98] as const;
  let clock = 0.95;
  const timeline = ["Design", "Brands", "Ideas", "Experiences"].map((word) => {
    const duration = 0.18 + word.length * 0.06;
    const delay = clock;
    clock += duration + 0.1;
    return { word, delay, duration };
  });
  return <div className="hero-handnote" aria-label="Design. Brands. Ideas. Experiences.">
    {timeline.map(({ word, delay, duration }) => <span className="hn-word" key={word} aria-hidden="true">
      <motion.span className="hn-ink" initial={{ clipPath: "inset(-30% 106% -45% -6%)" }} animate={{ clipPath: "inset(-30% -6% -45% -6%)" }} transition={{ delay, duration, ease: pen }}>{word}</motion.span>
      <motion.i className="hn-nib" initial={{ left: "0%", opacity: 0 }} animate={{ left: "100%", opacity: [0, 1, 1, 0], y: [0, -6, 2, -5, 1, 0] }} transition={{ delay, duration, ease: pen, opacity: { delay, duration, times: [0, 0.1, 0.86, 1] }, y: { delay, duration, ease: "easeInOut" } }} />
    </span>)}
    <svg className="hn-swoosh" viewBox="0 0 120 14" aria-hidden="true"><motion.path d="M2 9C24 3 52 2 80 5S112 10 118 6" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: clock, duration: 0.55, ease: [0.65, 0, 0.35, 1] }} /></svg>
  </div>;
}

function Headline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.h2 className={className} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, ease }}>{children}</motion.h2>;
}

function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  return <div className={`marquee ${className}`} aria-hidden="true"><div className="marquee-track">{[0, 1].map((copy) => <span key={copy}>{items.map((item) => <Fragment key={item}>{item}<i>✦</i></Fragment>)}</span>)}</div></div>;
}

function Ribbons() {
  const words = ["Brand design", "Campaigns", "Social media", "Short-form video", "Packaging", "Web banners", "Exhibition", "Content strategy", "UX / UI"];
  return <div className="ribbons"><Marquee items={words} className="ribbon is-red" /><Marquee items={[...words].reverse()} className="ribbon is-dark" /></div>;
}

function UxSection() {
  return <section id="ux" className="ux">
    <Topline label="UX / UI case studies" index="04 / 07" className="is-paper" />
    <div className="ux-head">
      <Headline>I design for the moment someone gets <em>stuck.</em></Headline>
      <Reveal delay={0.12} className="ux-head-side">
        <p>I start with research, find where people lose confidence, and shape mobile products around that moment.</p>
        <ul className="ux-stats">
          <li><CountUp to={2} /><span>UX case studies</span></li>
          <li><CountUp to={fitness.apps.length} /><span>Apps reviewed</span></li>
          <li><CountUp to={5} /><span>Prototype screens</span></li>
        </ul>
      </Reveal>
    </div>

    <Reveal className="ux-feature">
      <div className="ux-feature-visual"><EvShowcase /></div>
      <div className="ux-feature-copy">
        <p className="ux-kicker"><span>Case study 01</span>UX research · Mobile app concept</p>
        <h3>EV charge finder</h3>
        <p className="ux-sub">A mobile app that helps EV drivers find a charger that is free, compatible and working before they get there.</p>
        <blockquote>Drivers don&apos;t fear the drive. They fear <em>arriving at a charger that doesn&apos;t work.</em></blockquote>
        <dl className="ux-facts">{ev.facts.filter((fact) => fact.label !== "Platform").map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        <p className="ux-steps-label">Process</p>
        <ol className="ux-steps">{ev.process.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
        <Link className="button" href="/work/ev-charge-finder">Read the case study <ArrowUpRight size={16} /></Link>
      </div>
    </Reveal>

    <div className="ux-cards">
      <Reveal className="ux-card">
        <Link href="/work/fitness-app-study" className="ux-card-link">
          <div className="ux-fit-visual" aria-hidden="true">
            <div className="ux-fit-count"><b>18</b><small>fitness apps<br />reviewed</small></div>
            <div className="ux-fit-list"><div>{[...fitness.apps, ...fitness.apps].map((app, index) => <span key={`${app.name}-${index}`}>{app.name}</span>)}</div></div>
            <p className="ux-fit-lenses"><span>Common features</span><span>What&apos;s unique</span><span>Worth learning</span></p>
          </div>
          <div className="ux-card-copy">
            <p className="ux-kicker"><span>Case study 02</span>Competitor research · Fitness</p>
            <h3>Personalised workout planner</h3>
            <p>Why do new gym-goers struggle to build a plan that fits their goals, experience and time? I defined the problem and the user, reviewed 18 fitness apps, then moved into user flows, wireframes and interface design.</p>
            <span className="text-arrow">See the 18-app study <ArrowUpRight size={15} /></span>
          </div>
        </Link>
      </Reveal>
      <Reveal className="ux-card" delay={0.1}>
        <StoreShowcase />
        <div className="ux-card-copy">
          <p className="ux-kicker"><span>Web</span>E-commerce · AI visuals</p>
          <h3>WooCommerce store visuals</h3>
          <p>Product banners and store visuals for the Dr Talat&apos;s WooCommerce store, generated with AI and finished by hand, so the whole range went live without a product photoshoot.</p>
          <button type="button" className="button ux-woo-open" onClick={() => window.dispatchEvent(new CustomEvent("open-work", { detail: "woocommerce" }))}>See the AI visuals <ArrowUpRight size={16} /></button>
          <p className="ux-woo-label">Live sites</p>
          <div className="ux-woo-links"><a href="https://www.drtalats.com" target="_blank" rel="noopener noreferrer">drtalats.com <ArrowUpRight size={14} /></a><a href="https://www.sehatclinic.com" target="_blank" rel="noopener noreferrer">sehatclinic.com <ArrowUpRight size={14} /></a></div>
        </div>
      </Reveal>
    </div>

    <div className="ux-how">
      <Reveal className="ux-how-head"><h3>How I work</h3><p>Every project starts by understanding the people and the market before opening a design tool.</p></Reveal>
      <ol className="ux-how-list">{howIWork.map((step, index) => <motion.li key={step} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: (index % 4) * 0.07, duration: 0.5, ease }}><span>{pad(index + 1)}</span>{step}</motion.li>)}</ol>
    </div>
  </section>;
}

function Career() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return <section id="experience" className="career">
    <Topline label="Experience" index="05 / 07" className="is-red" />
    <div className="career-grid">
      <div className="career-side">
        <Headline>From agency desk to <em>creative lead.</em></Headline>
        <Reveal delay={0.1}><p className="career-intro">Four years across <b>branding</b>, <b>social media</b>, <b>print</b> and <b>content-led creative</b>, owning projects from creative direction and content strategy through to final visual execution.</p></Reveal>
        <Reveal delay={0.16} className="career-edu">
          <div className="career-block-head"><span className="career-block-icon" aria-hidden="true"><GraduationCap size={19} strokeWidth={1.8} /></span><h3>Education</h3><small>{education.length}</small></div>
          <ol className="career-edu-list">{education.map((item, index) => <motion.li key={item.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: index * 0.07, duration: 0.5, ease }}>
            <span className="career-edu-dot" aria-hidden="true" />
            <div><b>{item.title}</b><span>{item.school}</span></div>
            <em>{item.kind}</em>
          </motion.li>)}</ol>
          <div className="career-block-head"><span className="career-block-icon" aria-hidden="true"><Award size={19} strokeWidth={1.8} /></span><h3>Certifications</h3><small>{certifications.length}</small></div>
          <ul className="career-certs">{certifications.map((item) => <li key={item}><Check size={15} strokeWidth={2.6} aria-hidden="true" />{item}</li>)}</ul>
        </Reveal>
      </div>
      <ol ref={list} className="career-list">
        <motion.i className="career-progress" style={{ scaleY: progress }} aria-hidden="true" />
        {roles.map((role) => <motion.li key={role.company} className="career-item" initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.75, ease }}>
          <p className="career-period">{role.period}</p>
          <h3>{role.title}</h3>
          <p className="career-company">{role.company}{role.place && <span> · {role.place}</span>}</p>
          <p className="career-summary">{role.summary}</p>
          {role.points.length > 0 && <ul className="career-points">{role.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          <div className="career-tags">{role.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </motion.li>)}
      </ol>
    </div>
    <div className="career-brands"><p className="career-label">Brands I&apos;ve designed for</p><Marquee items={brands} /></div>
  </section>;
}

function Toolkit() {
  return <section id="skills" className="toolkit">
    <div className="toolkit-intro">
      <Topline label="Skills & tools" index="06 / 07" />
      <div className="toolkit-head">
        <Headline>A practical creative <em>toolkit.</em></Headline>
        <Reveal delay={0.1}><p>Visual craft and UI/UX thinking in one practice: brand and campaign work on one side, research-led product design on the other.</p></Reveal>
      </div>
    </div>
    <ToolCanvas />
    <div className="toolkit-more">
      <div className="toolkit-groups">{skillGroups.map((group, groupIndex) => {
        const Icon = groupIcons[groupIndex % groupIcons.length];
        return <Reveal key={group.title} className="toolkit-group" delay={groupIndex * 0.08}>
          <div className="toolkit-group-head">
            <span className="toolkit-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
            <div><h3>{group.title}</h3><p>{group.text}</p></div>
          </div>
          <div className="toolkit-chips">{group.items.map((item, index) => <motion.span key={item} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + index * 0.04, duration: 0.4, ease }}>{item}</motion.span>)}</div>
          <p className="toolkit-count">{group.items.length} skills</p>
        </Reveal>;
      })}</div>
    </div>
    <AiBoard />
  </section>;
}

function Contact() {
  const words = ["Let's", "design", "something", "people"];
  const portrait = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portrait, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const signX = useTransform(scrollYProgress, [0, 1], [24, -24]);
  return <section id="contact" className="cta">
    <Topline label="Let's talk" index="07 / 07" />
    <div className="cta-main">
      <div className="cta-text">
        <motion.p className="cta-status" initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.6, ease }}>Open to new roles<span>Chennai, India</span></motion.p>
        <motion.h2 variants={wordStagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>{words.map((word) => <Fragment key={word}><span className="cta-word"><motion.span variants={wordRise}>{word}</motion.span></span>{" "}</Fragment>)}<span className="cta-word"><motion.em variants={wordRise}>trust.</motion.em></span></motion.h2>
        <Reveal className="cta-lede" delay={0.2}>
          <p>I&apos;m looking for my next role as a <b>Brand</b>, <b>Creative</b> or <b>Multidisciplinary Designer</b>, somewhere visual craft and UI/UX thinking work together.</p>
          <div className="actions"><a className="button" href={`mailto:${contact.email}`}><Mail size={16} /> Email Waseem <ArrowUpRight size={16} /></a><a className="button-ghost" href={contact.resume} download>Download résumé <Download size={15} /></a></div>
        </Reveal>
      </div>
      <motion.div ref={portrait} className="cta-portrait" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
        <motion.div className="cta-portrait-reveal" variants={{ hidden: { opacity: 0, y: -48, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease }, transitionEnd: { filter: "none" } } }}>
          <div className="cta-portrait-glow" aria-hidden="true" />
          <motion.div className="cta-portrait-img" style={{ y: portraitY }}>
            {/* The signature weaves around him: "Waseem" passes behind, "Taha" comes back out in front. Both copies
                share the photo's box and parallax, so the weave stays locked to his body at every size. */}
            <div className="cta-sign-frame" aria-hidden="true"><motion.div className="cta-sign" style={{ x: signX, rotate: -9 }}><Signature draw="view" delay={0.45} cap={false} /></motion.div></div>
            <CapPhoto sizes="(max-width: 900px) 80vw, 32vw" />
            <div className="cta-sign-frame is-front" aria-hidden="true"><motion.div className="cta-sign" style={{ x: signX, rotate: -9 }}><Signature draw="view" delay={0.45} cap={false} /></motion.div></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
    <ContactDeck />
  </section>;
}

export default function Home() {
  const projectCount = pad(works.length + caseStudies.length);
  const [live, setLive] = useState(introPlayed);
  const onIntroDone = useCallback(() => setLive(true), []);
  return <main><WatchFlight><CapJourney>
    <Intro onDone={onIntroDone} />

    <Fragment key={live ? "live" : "intro"}><SiteNav /><section id="top" className="hero shell">
      <aside className="hero-rail" aria-hidden="true"><span>WT / PORTFOLIO</span><i /><span>SCROLL TO DISCOVER</span></aside>
      <Reveal className="hero-copy">
        <div className="hero-topline"><SectionLabel>Brand · Creative · UX / UI</SectionLabel><span>01 / 07</span></div>
        <KineticName />
        <div className="hero-role"><strong>Brand &amp; Creative Designer</strong><span className="hero-role-tags"><span>Multidisciplinary</span><span>UI/UX knowledge</span></span></div>
        <p className="lede">Building <b>brands</b>, <b>campaign creative</b>, and <b>digital experiences</b>&nbsp;— from a sharp initial idea through to a considered final execution.</p>
        <div className="actions"><a className="button" href="#work">View selected work <ArrowUpRight size={16} /></a><a className="play" href="#about"><CirclePlay size={34} /> See my approach</a></div>
        <div className="stats" aria-label="Experience highlights"><div><b>4+</b><span>Years<br />experience</span></div><div><b>{projectCount}</b><span>Selected<br />projects</span></div><div><b>BRAND<br />+ UX</b><span>Creative<br />practice</span></div></div>
        <p className="hero-location">Based in Perambur, Chennai, India<span aria-hidden="true">·</span><LocalTime /> IST</p>
      </Reveal>
      <Reveal className="hero-art">
        <div className="hero-art-meta"><span>IDEA → EXECUTION</span><span>CREATIVE SYSTEMS</span></div>
        <div className="hero-red-halo" />
        <motion.div className="portrait-media" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.18, duration: 1.05, ease: [0.77, 0, 0.18, 1] }}><motion.div className="portrait-image" initial={{ scale: 1.13, x: 34 }} animate={{ scale: 1, x: 0 }} transition={{ delay: 0.18, duration: 1.35, ease: [0.16, 1, 0.3, 1] }}><div className="portrait-canvas"><Image src="/images/hero/hero-no-watch.png" alt="Waseem Taha" fill priority sizes="(max-width: 760px) 120vw, (max-width: 1020px) 70vw, 52vw" /><HeroWatch /></div></motion.div></motion.div>
        <motion.div className="portrait-wipe" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ delay: 0.28, duration: 0.78, ease: [0.77, 0, 0.18, 1] }} aria-hidden="true" />
        <motion.div className="portrait-guides" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }} aria-hidden="true"><i /><i /><span>01 / FRAME</span></motion.div>
        <div className="hero-frame" aria-hidden="true" />
        <HandNote />
      </Reveal>
    </section></Fragment>

    <About />

    <MotionConfig reducedMotion="user">
      <WorkGallery />
      <Ribbons />
      <UxSection />
      <Career />
      <Toolkit />
      <Contact />
    </MotionConfig>
    <SiteFooter />
    <FigmaDock />
  </CapJourney></WatchFlight></main>;
}
