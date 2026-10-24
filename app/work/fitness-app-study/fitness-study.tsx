"use client";

import Link from "next/link";
import { ArrowLeft, Search, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Reveal, SiteFooter, SiteNav, ease } from "../../components/ui";
import { fitness } from "../../content";
import { CaseCta, HowIWork, IntroRow, NextCase, pad } from "../case-parts";

type App = (typeof fitness.apps)[number];

const rise = (delay: number) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.8, ease } });
const leaders = ["Fitbod", "Freeletics", "8fit", "Centr"];
const monogram: Record<string, string> = {
  "Nike Training Club": "NTC", FitOn: "Fo", JEFIT: "JF", "Home Workout - No Equipment": "HW", Centr: "Ce", "8fit": "8f",
  "Couch to 5K": "C5", MyFitnessPal: "MFP", Strava: "St", Peloton: "Pe", Fitbod: "Fb", Sworkit: "Sk",
  Freeletics: "Fl", "Daily Burn": "DB", Aaptiv: "Aa", Sweat: "Sw", MapMyFitness: "MMF", "Workout Trainer by Skimble": "WT",
};

const lenses = [
  { key: "common", label: "Common features", hint: "What nearly every app already offers" },
  { key: "unique", label: "What's unique", hint: "What only this app does" },
  { key: "note", label: "Worth learning", hint: "The lesson I took for the planner" },
] as const;
type LensKey = (typeof lenses)[number]["key"];

// Themes are read from each app's own review notes, so a tag only appears where the review mentions it.
// The four apps the takeaways name as personalisation examples count as personalisation too.
const themes = [
  { label: "Personalisation", test: /personali|adapt|tailored/i, include: leaders },
  { label: "AI coaching", test: /\bAI\b/ },
  { label: "Community", test: /community|social|leaderboard|forum/i },
  { label: "Nutrition", test: /meal|nutrition|calorie|food|chef/i },
  { label: "Live classes", test: /\blive\b/i },
  { label: "Beginner-friendly", test: /beginner|novice|all fitness levels/i },
];
const themesOf = (app: App) => themes.filter((theme) => theme.include?.includes(app.name) || theme.test.test(`${app.common} ${app.unique} ${app.note}`)).map((theme) => theme.label);

function Mark({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query) : -1;
  if (at < 0) return <>{text}</>;
  return <>{text.slice(0, at)}<mark>{text.slice(at, at + query.length)}</mark>{text.slice(at + query.length)}</>;
}

/* Hero: the 18 apps land like a home screen, then a scan sweeps across and lights up the personalisation leaders. */
function AppWall() {
  const columns = 6;
  const sweep = { delay: 1.5, duration: 1.5 };
  return <div className="cs-hero-visual is-fitness" aria-hidden="true">
    <div className="fs-wall">
      {fitness.apps.map((app, index) => {
        const hot = leaders.includes(app.name);
        const lightUp = sweep.delay + (((index % columns) + 0.5) / columns) * sweep.duration;
        return <motion.span key={app.name} className="fs-tile" initial={{ opacity: 0, y: 26, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.25 + index * 0.04, duration: 0.6, ease }}>
          <motion.span className="fs-icon" animate={hot ? { borderColor: "#ff7c85", boxShadow: "0 0 36px rgba(255,52,68,0.55)" } : undefined} transition={{ delay: lightUp, duration: 0.45 }}>
            {hot && <motion.i className="fs-hot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: lightUp, duration: 0.45 }} />}
            <b>{monogram[app.name]}</b>
          </motion.span>
          <small>{app.name}</small>
        </motion.span>;
      })}
      <motion.i className="fs-sweep" initial={{ left: "-14%", opacity: 0 }} animate={{ left: "108%", opacity: [0, 1, 1, 0] }} transition={{ ...sweep, ease: "easeInOut" }} />
    </div>
    <div className="fs-hero-foot">
      <p className="fs-count-big"><b>18</b><span>apps reviewed<br />through three lenses</span></p>
      <motion.p className="fs-leaders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sweep.delay + sweep.duration + 0.1, duration: 0.5, ease }}>Personalisation leaders<span>Fitbod · Freeletics · 8fit · Centr</span></motion.p>
    </div>
  </div>;
}

/* The review as an explorer: switch lens and the notes change across every card in a wave; filter by theme or search. */
function Explorer() {
  const [lens, setLens] = useState<LensKey>("common");
  const [theme, setTheme] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const tagged = useMemo(() => fitness.apps.map((app, index) => ({ app, index, tags: themesOf(app) })), []);
  const counts = useMemo(() => Object.fromEntries(themes.map((item) => [item.label, tagged.filter((row) => row.tags.includes(item.label)).length])), [tagged]);
  const shown = tagged.filter(({ app, tags }) => (!theme || tags.includes(theme)) && (!query || [app.name, app.common, app.unique, app.note].some((value) => value.toLowerCase().includes(query))));
  const current = lenses.find((item) => item.key === lens) ?? lenses[0];

  return <div className="fx">
    <div className="fx-bar">
      <label className="fs-search"><Search size={17} aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search apps or features, e.g. meal plans" aria-label="Search apps or features" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}</label>
      <div className="fx-lenses" role="radiogroup" aria-label="Choose a lens">
        {lenses.map((item) => <button key={item.key} type="button" role="radio" aria-checked={lens === item.key} className={lens === item.key ? "is-on" : ""} onClick={() => setLens(item.key)}>
          {lens === item.key && <motion.span layoutId="fx-lens" className="fx-lens-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
          <span>{item.label}</span>
        </button>)}
      </div>
    </div>
    <div className="fx-themes" role="group" aria-label="Filter by theme">
      <button type="button" className={!theme ? "is-on" : ""} aria-pressed={!theme} onClick={() => setTheme(null)}>All apps<em>{fitness.apps.length}</em></button>
      {themes.map((item) => <button key={item.label} type="button" className={theme === item.label ? "is-on" : ""} aria-pressed={theme === item.label} onClick={() => setTheme(theme === item.label ? null : item.label)}>{item.label}<em>{counts[item.label]}</em></button>)}
    </div>
    <div className="fx-status">
      <AnimatePresence mode="wait" initial={false}><motion.p key={lens} className="fx-hint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>{current.label}: {current.hint.toLowerCase()}</motion.p></AnimatePresence>
      <p className="fx-count" aria-live="polite">{shown.length} of {fitness.apps.length} apps</p>
    </div>
    <motion.ul layout className="fx-grid">
      <AnimatePresence mode="popLayout">
        {shown.map(({ app, index, tags }, order) => {
          const hot = leaders.includes(app.name);
          return <motion.li key={app.name} layout className={`fx-card${hot ? " is-hot" : ""}`} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }} transition={{ duration: 0.45, ease }}>
            <div className="fx-card-top"><span className="fx-num">{pad(index + 1)}</span>{hot && <span className="fx-flag">Personalisation leader</span>}</div>
            <h3><Mark text={app.name} query={query} /></h3>
            <div className="fx-lens-text">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={lens} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: order * 0.03, duration: 0.35, ease } }} exit={{ opacity: 0, y: -10, transition: { delay: order * 0.02, duration: 0.18 } }}>
                  <span>{current.label}</span><Mark text={app[lens]} query={query} />
                </motion.p>
              </AnimatePresence>
            </div>
            {tags.length > 0 && <ul className="fx-tags">{tags.map((tag) => <li key={tag} className={theme === tag ? "is-on" : ""}>{tag}</li>)}</ul>}
          </motion.li>;
        })}
      </AnimatePresence>
    </motion.ul>
    {shown.length === 0 && <p className="fs-empty">No apps match. Try “meal”, “AI” or “community”, or pick All apps.</p>}
  </div>;
}

export function FitnessStudy() {
  return <MotionConfig reducedMotion="user"><main className="cs">
    <SiteNav base="/" />

    <section id="top" className="cs-hero is-fitness">
      <div className="cs-hero-copy">
        <motion.div {...rise(0)}><Link className="cs-back" href="/#ux"><ArrowLeft size={15} /> All case studies</Link></motion.div>
        <motion.p className="cs-kicker" {...rise(0.06)}><span>Case study 02</span>Competitor research · Figma · FigJam</motion.p>
        <motion.h1 {...rise(0.12)}>Fitness app <em>competitor study.</em></motion.h1>
        <motion.p className="cs-lede" {...rise(0.2)}>{fitness.lede}</motion.p>
        <motion.div className="cs-context" {...rise(0.28)}><p>Part of the personalised workout planner project</p><span>{fitness.context}</span></motion.div>
      </div>
      <AppWall />
    </section>

    <section className="cs-section cs-paper">
      <IntroRow label="01 · The review" title={<>18 apps, <em>three lenses.</em></>} note="Switch the lens to compare every app the same way: what they all offer, what only one does, and what was worth learning from it." />
      <Explorer />
    </section>

    <section className="cs-section cs-dark">
      <IntroRow label="02 · Takeaways" title={<>What the study <em>showed.</em></>} />
      <div className="fs-insights">{fitness.insights.map((item, index) => <Reveal key={item.title} className="fs-insight" delay={index * 0.1}><span>{pad(index + 1)}</span><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}</div>
    </section>

    <HowIWork />
    <NextCase href="/work/ev-charge-finder" title="EV charge finder" />
    <CaseCta />
    <SiteFooter base="/" />
  </main></MotionConfig>;
}
