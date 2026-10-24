"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ease } from "./ui";

/* Code-built screens for the EV charge finder case study, recreated from Waseem's Figma flow. */

type ScreenProps = { live?: boolean; onNext?: () => void; onBack?: () => void };
type WireKind = "home" | "route" | "station" | "charging";

const green = "#3d7a46";
const red = "#b13b35";
const grey = "#5f6461";

const stations = [
  { name: "Riverside Mall", km: "0.8 km", busy: false, free: "3 of 4 free", plugs: "CCS2, Type 2", price: "Rs 18/kWh", fast: true, food: true },
  { name: "Highway Rest Stop", km: "2.4 km", busy: true, free: "All in use, about 12 min wait", plugs: "CCS2", price: "Rs 21/kWh", fast: true, food: true },
  { name: "City Library Parking", km: "1.6 km", busy: false, free: "1 of 2 free", plugs: "Type 2", price: "Rs 12/kWh", fast: false, food: false },
  { name: "Supermarket Lot", km: "3.1 km", busy: false, free: "2 of 2 free", plugs: "Type 2, CCS2", price: "Rs 14/kWh", fast: false, food: true },
];

/* Each step's design note answers a pain point from the research (see ev.fixes in content.ts). */
export const flowSteps = [
  { title: "Find chargers", note: "Search, filter and see live status on the map", why: "Live status on every pin", text: "Pins show availability before you tap, so drivers can rule out busy or broken stations at a glance.", tagLabel: "Solves", tag: "Can't tell if a charger works" },
  { title: "Plan the trip", note: "See charge stops and battery on arrival", why: "Battery on arrival, not just distance", text: "The route plans the charge stop and shows the battery you'll arrive with, so longer trips stop being a guess.", tagLabel: "Solves", tag: "Range anxiety on longer trips" },
  { title: "Check the station", note: "Connector match, price, wait and amenities", why: "Your connector comes first", text: "The plug that fits your car is highlighted, with power, price, wait and amenities on one screen.", tagLabel: "Solves", tag: "Wrong connector on arrival" },
  { title: "Charge and pay", note: "Track progress and pay once", why: "One payment for every network", text: "A saved card works across networks, with live progress and cost while the car charges.", tagLabel: "Solves", tag: "A different app or card for each network" },
  { title: "Get the receipt", note: "Confirmation and what happens next", why: "A clear finish", text: "Energy, rate and total in one receipt, then straight back to the route.", tagLabel: "Outcome", tag: "Back on the road with 41% on arrival" },
];

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 26 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.38, ease } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -26, transition: { duration: 0.2 } }),
};

function Pin({ x, y, tone }: { x: number; y: number; tone: string }) {
  return <g transform={`translate(${x} ${y})`}><circle r="9.5" fill={tone} stroke="#fff" strokeWidth="1.5" /><path d="M1.8-5.6-3.4.9H-.2L-1.6 5.6 3.4-.9H.2Z" fill="#fff" /></g>;
}

function Dot({ x, y, ring = green }: { x: number; y: number; ring?: string }) {
  return <circle cx={x} cy={y} r="5.5" fill="#111" stroke={ring} strokeWidth="3" />;
}

function AppMap({ variant = "home" }: { variant?: "home" | "route" | "today" }) {
  return <svg className="app-map" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="300" height="180" fill="#e4e9e5" />
    <rect x="16" y="14" width="58" height="34" rx="8" fill="#d2dcd4" />
    <rect x="200" y="122" width="70" height="44" rx="8" fill="#d2dcd4" />
    <path d="M62-12 196 192M-12 142C82 108 170 74 312 56M128 92 312 150" stroke="#fff" strokeWidth="13" fill="none" strokeLinecap="round" />
    {variant === "home" && <><Pin x={52} y={64} tone={green} /><Pin x={250} y={46} tone={green} /><Pin x={124} y={142} tone={green} /><Pin x={214} y={94} tone={red} /><Dot x={66} y={122} /></>}
    {variant === "route" && <><path d="M40 150C88 140 118 96 158 74S232 40 262 30" stroke={green} strokeWidth="4" fill="none" strokeLinecap="round" /><Pin x={218} y={114} tone={red} /><Pin x={158} y={74} tone={green} /><Dot x={40} y={150} /><Dot x={262} y={30} ring="#fff" /></>}
    {variant === "today" && <><Pin x={86} y={58} tone={grey} /><Pin x={240} y={40} tone={grey} /><Pin x={190} y={86} tone={grey} /><Pin x={134} y={134} tone={grey} /><Dot x={56} y={112} /></>}
  </svg>;
}

export function Phone({ children, className = "", status = true }: { children: React.ReactNode; className?: string; status?: boolean }) {
  return <div className={`app-phone ${className}`}><div className="app-screen">{status && <div className="app-status"><b>9:41</b><b>5G 86%</b></div>}{children}</div></div>;
}

function Cta({ children, live, onClick }: { children: React.ReactNode; live?: boolean; onClick?: () => void }) {
  return live && onClick ? <button type="button" className="app-cta" onClick={onClick}>{children}</button> : <span className="app-cta">{children}</span>;
}

function Back({ live, onBack }: ScreenProps) {
  return live && onBack ? <button type="button" className="app-back" onClick={onBack}>Back</button> : <span className="app-back">Back</span>;
}

function HomeScreen({ live, onNext }: ScreenProps) {
  return <>
    <span className="app-search">Where to?</span>
    <div className="app-chips"><span className="app-chip is-on">CCS2</span><span className="app-chip">Fast</span><span className="app-chip">Available</span><span className="app-chip">Food nearby</span></div>
    <AppMap />
    <p className="app-h">Near you</p>
    <div className="app-card"><b>Riverside Mall</b><p><span className="app-badge">Available</span>3 of 4 free, 0.8 km</p></div>
    <div className="app-card"><b>Highway Rest Stop</b><p><span className="app-badge is-busy">Busy</span>about 12 min wait</p></div>
    <Cta live={live} onClick={onNext}>Plan a trip</Cta>
  </>;
}

function RouteScreen({ live, onNext, onBack }: ScreenProps) {
  return <>
    <Back live={live} onBack={onBack} />
    <p className="app-title">Mumbai to Pune</p>
    <p className="app-sub">148 km. You arrive with 41% battery.</p>
    <AppMap variant="route" />
    <div className="app-card"><b>Charge stop: Highway Rest Stop</b><p>18 min at 50 kW, 3 of 4 free</p></div>
    <div className="app-stats"><span><b>2 h 41</b><small>Trip time</small></span><span><b>1</b><small>Charge stop</small></span><span><b>41%</b><small>On arrival</small></span></div>
    <Cta live={live} onClick={onNext}>Check charge stop</Cta>
  </>;
}

function StationScreen({ live, onNext, onBack }: ScreenProps) {
  return <>
    <Back live={live} onBack={onBack} />
    <p className="app-title">Highway Rest Stop</p>
    <p className="app-sub"><span className="app-badge">Available</span>3 of 4 free. Updated 2 min ago</p>
    <div className="app-stats"><span><b>50 kW</b><small>Power</small></span><span><b>Rs 18</b><small>Per kWh</small></span><span><b>No wait</b><small>Right now</small></span></div>
    <p className="app-label">Connectors</p>
    <div className="app-chips"><span className="app-chip is-on">CCS2 matches your car</span><span className="app-chip">Type 2</span></div>
    <p className="app-label">While you wait</p>
    <div className="app-chips"><span className="app-chip">Restroom</span><span className="app-chip">Food</span><span className="app-chip">Seating</span><span className="app-chip">Well lit</span></div>
    <Cta live={live} onClick={onNext}>Start charging</Cta>
  </>;
}

function ChargingScreen({ live, onNext, onBack }: ScreenProps) {
  return <>
    <Back live={live} onBack={onBack} />
    <p className="app-title">Charging</p>
    <p className="app-sub">Highway Rest Stop · CCS2</p>
    <div className="app-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" /><motion.circle cx="60" cy="60" r="50" initial={{ pathLength: 0.3 }} animate={{ pathLength: 0.58 }} transition={{ duration: 1.4, ease }} /></svg><span><b>58%</b><small>Battery</small></span></div>
    <p className="app-note">About 6 min left at this stop</p>
    <div className="app-stats"><span><b>48 kW</b><small>Power</small></span><span><b>10.0 kWh</b><small>Added</small></span><span><b>Rs 180</b><small>So far</small></span></div>
    <div className="app-card"><b>One payment</b><p>Charged to your saved card. Works on every network.</p></div>
    <Cta live={live} onClick={onNext}>Stop charging</Cta>
  </>;
}

function ReceiptScreen({ live, onNext }: ScreenProps) {
  return <>
    <div className="app-done"><span><Check size={22} strokeWidth={3} /></span><p className="app-title">Charge complete</p><p className="app-sub">Highway Rest Stop · 18 min</p></div>
    <div className="app-receipt"><p><span>Energy</span><b>15.0 kWh</b></p><p><span>Rate</span><b>Rs 18/kWh</b></p><p><span>Paid once</span><b>Rs 270</b></p></div>
    <div className="app-card"><b>What happens next</b><p>Back on the route to Pune. You arrive with 41% battery.</p></div>
    <Cta live={live} onClick={onNext}>Done</Cta>
  </>;
}

function TodayScreen() {
  return <>
    <p className="app-title">Nearby stations</p>
    <p className="app-battery"><i />Battery 9%</p>
    <AppMap variant="today" />
    <div className="app-alert"><b>Station offline</b><p>You have arrived. The next charger is 41 km away.</p></div>
    <div className="app-card"><b>Riverside Mall</b><p>Availability unknown</p></div>
    <div className="app-card"><b>Highway Rest Stop</b><p>Needs a separate network app</p></div>
    <div className="app-card"><b>City Library Parking</b><p>Card not accepted</p></div>
  </>;
}

const flow = [HomeScreen, RouteScreen, StationScreen, ChargingScreen, ReceiptScreen];
const wireFor: WireKind[] = ["home", "route", "station", "charging", "charging"];

export function FlowScreen({ step, ...props }: { step: number } & ScreenProps) {
  const Screen = flow[step];
  return <Screen {...props} />;
}

export function ScreenPhone({ step, className = "" }: { step: number; className?: string }) {
  return <Phone className={className}><div className="app-flow"><FlowScreen step={step} /></div></Phone>;
}

export function TodayPhone() {
  return <Phone className="is-today"><div className="app-flow"><TodayScreen /></div></Phone>;
}

export function Wireframe({ kind }: { kind: WireKind }) {
  return <div className="wf"><div className="wf-screen">
    {kind === "home" && <><span className="wf-box wf-input">Where to?</span><div className="wf-row"><i className="wf-pill" /><i className="wf-pill" /><i className="wf-pill" /></div><span className="wf-x">Map</span><div className="wf-box wf-item"><i className="wf-bar w45 dark" /><i className="wf-bar w80" /></div><div className="wf-box wf-item"><i className="wf-bar w60 dark" /><i className="wf-bar w45" /></div></>}
    {kind === "route" && <><i className="wf-bar w25" /><i className="wf-bar w60 dark tall" /><i className="wf-bar w45" /><span className="wf-x">Map with route</span><div className="wf-box wf-item"><i className="wf-bar w60 dark" /><i className="wf-bar w45" /></div><div className="wf-row"><i className="wf-tile" /><i className="wf-tile" /><i className="wf-tile" /></div></>}
    {kind === "station" && <><i className="wf-bar w25" /><i className="wf-bar w60 dark tall" /><i className="wf-bar w45" /><div className="wf-row"><i className="wf-tile" /><i className="wf-tile" /><i className="wf-tile" /></div><div className="wf-row"><i className="wf-pill is-wide" /><i className="wf-pill is-wide" /></div><div className="wf-row"><i className="wf-pill" /><i className="wf-pill" /><i className="wf-pill" /></div></>}
    {kind === "charging" && <><i className="wf-bar w45 dark tall" /><span className="wf-ring">Progress</span><i className="wf-bar w60 is-center" /><div className="wf-row"><i className="wf-tile" /><i className="wf-tile" /><i className="wf-tile" /></div><div className="wf-box wf-item"><i className="wf-bar w60" /><i className="wf-bar w80" /></div></>}
    <span className="wf-box wf-btn">{{ home: "Plan a trip", route: "Check charge stop", station: "Start charging", charging: "Stop charging" }[kind]}</span>
  </div></div>;
}

/* Backdrop: a night map on a Figma canvas. The grid drifts, energy flows along the roads, charger pins pulse
   (red = busy) and charging waves ripple out from behind the hi-fi phone. Pins sit on the roads' segment joins
   and midpoints, so they stay on the roads at any crop. */
const roads = [
  "M-40 260C180 230 300 120 520 140S860 260 1040 200",
  "M-40 640C160 600 320 700 520 660S860 520 1040 560",
  "M180 -40C210 200 160 420 240 620S300 900 260 1040",
  "M780 -40C740 180 820 380 760 560S700 860 780 1040",
  "M-40 900C240 860 520 960 1040 860",
];
const chargers = [
  { x: 109, y: 226 }, { x: 520, y: 140 }, { x: 795, y: 200, busy: true }, { x: 240, y: 620 },
  { x: 760, y: 560 }, { x: 520, y: 660, busy: true }, { x: 718, y: 800 }, { x: 410, y: 902 },
];

export function EvBackdrop({ label = "Prototype · EV charge finder" }: { label?: string }) {
  return <div className="evb" aria-hidden="true">
    <div className="evb-grid" />
    <svg className="evb-map" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      {roads.map((d) => <path key={`r${d}`} className="evb-road" d={d} />)}
      {roads.map((d) => <path key={`l${d}`} className="evb-lane" d={d} />)}
      {roads.map((d, index) => <path key={`f${d}`} className="evb-flow" d={d} pathLength={1000} style={{ animationDuration: `${6 + index * 1.3}s`, animationDelay: `${index * -2.1}s` }} />)}
      {chargers.map((pin, index) => <g key={`${pin.x}-${pin.y}`} className={`evb-pin${pin.busy ? " is-busy" : ""}`} transform={`translate(${pin.x} ${pin.y})`}>
        <circle className="evb-pulse" r="11" style={{ animationDelay: `${index * -0.7}s` }} />
        <circle className="evb-dot" r="11" />
        <path className="evb-bolt" d="M1.8-5.6-3.4.9H-.2L-1.6 5.6 3.4-.9H.2Z" />
      </g>)}
      <g className="evb-me" transform="translate(104 632)"><circle className="evb-pulse" r="9" /><circle className="evb-dot" r="7" /></g>
    </svg>
    <div className="evb-waves"><i /><i /><i /></div>
    <span className="evb-ruler is-x" /><span className="evb-ruler is-y" />
    <p className="evb-frame"><i />{label}</p>
  </div>;
}

/* Home-page card: the low-fi frame and the hi-fi phone step through the flow together. */
export function EvShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % flow.length), 2800);
    return () => window.clearInterval(timer);
  }, [inView, reduce]);
  return <div ref={ref} className="ev-showcase" aria-hidden="true">
    <EvBackdrop />
    <motion.div className="ev-wire" initial={{ opacity: 0, x: -50, rotate: -15 }} whileInView={{ opacity: 1, x: 0, rotate: -9 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease }}>
      <span className="ev-tag">Low-fi · {flowSteps[step].title}</span>
      <AnimatePresence mode="wait"><motion.div key={wireFor[step]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}><Wireframe kind={wireFor[step]} /></motion.div></AnimatePresence>
    </motion.div>
    <motion.div className="ev-hifi" initial={{ opacity: 0, y: 70, rotate: 10 }} whileInView={{ opacity: 1, y: 0, rotate: 4 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.12, duration: 1, ease }}>
      <span className="ev-tag is-hot">Hi-fi</span>
      <Phone><AnimatePresence mode="wait" custom={1}><motion.div key={step} className="app-flow" custom={1} variants={slide} initial="enter" animate="center" exit="exit"><FlowScreen step={step} /></motion.div></AnimatePresence></Phone>
    </motion.div>
    <motion.p className="ev-note ev-note-a" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.5, ease }}><i>W</i>Live status on every pin</motion.p>
    <motion.p className="ev-note ev-note-b" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.5, ease }}><i>W</i>Pay once, any network</motion.p>
    <ol className="ev-steps">{flowSteps.map((item, index) => <motion.li layout key={item.title} className={index === step ? "is-on" : ""} transition={{ type: "spring", stiffness: 420, damping: 36 }}><span>{index + 1}</span>{index === step && <motion.b initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12, duration: 0.25 }}>{item.title}</motion.b>}</motion.li>)}</ol>
  </div>;
}

export function PhoneTrio() {
  return <div className="ev-trio" aria-hidden="true">{[1, 0, 2].map((step, index) => <motion.div key={step} className={`ev-trio-item ev-trio-${index}`} initial={{ opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.12, duration: 1, ease }}><ScreenPhone step={step} /></motion.div>)}</div>;
}

const filters = ["All", "Fast", "Available", "Food nearby"] as const;

export function ConceptPhone() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const list = stations.filter((station) => filter === "All" || (filter === "Fast" ? station.fast : filter === "Available" ? !station.busy : station.food));
  return <Phone className="is-concept" status={false}>
    <div className="app-flow">
      <i className="app-grabber" />
      <p className="app-title">Chargers near you</p>
      <div className="app-chips" role="group" aria-label="Filter chargers">{filters.map((item) => <button type="button" key={item} className={`app-chip ${item === filter ? "is-solid" : ""}`} aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="app-list"><AnimatePresence initial={false} mode="popLayout">{list.map((station) => <motion.div layout key={station.name} className="app-card" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.3, ease }}><div className="app-row"><b>{station.name}</b><small>{station.km}</small></div><p><span className={`app-badge ${station.busy ? "is-busy" : ""}`}>{station.busy ? "Busy" : "Available"}</span>{station.free}</p><small>{station.plugs} · {station.price}</small></motion.div>)}</AnimatePresence></div>
      <span className="app-cta">Start route</span>
    </div>
  </Phone>;
}

/* Steps on the left, the live phone in the middle, and the design note for the current step on the right. */
export function Prototype() {
  const [{ step, dir }, setState] = useState({ step: 0, dir: 1 });
  const go = (next: number) => setState({ step: (next + flow.length) % flow.length, dir: next >= step ? 1 : -1 });
  const current = flowSteps[step];
  return <div className="proto">
    <ol className="proto-steps">{flowSteps.map((item, index) => <li key={item.title}><button type="button" className={index === step ? "is-on" : ""} aria-current={index === step ? "step" : undefined} onClick={() => go(index)}><i aria-hidden="true" /><b>{item.title}</b><span>{item.note}</span></button></li>)}</ol>
    <div className="proto-device">
      <span className="proto-glow" aria-hidden="true" />
      <Phone className="proto-phone"><AnimatePresence mode="wait" custom={dir}><motion.div key={step} className="app-flow" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"><FlowScreen step={step} live onNext={() => go(step + 1)} onBack={() => go(step - 1)} /></motion.div></AnimatePresence></Phone>
      <p className="proto-hint">Tap the green button inside the phone</p>
    </div>
    <div className="proto-side">
      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} className="proto-note" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.32, ease }}>
            <p className="proto-note-step">Step {step + 1} of {flowSteps.length} · {current.title}</p>
            <h4>{current.why}</h4>
            <p className="proto-note-text">{current.text}</p>
            <p className="proto-note-tag"><span>{current.tagLabel}</span>{current.tag}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="proto-nav">
        <button type="button" onClick={() => go(step - 1)} aria-label="Previous step"><ArrowLeft size={16} /></button>
        <span className="proto-bar" aria-hidden="true"><i style={{ width: `${((step + 1) / flowSteps.length) * 100}%` }} /></span>
        <button type="button" onClick={() => go(step + 1)} aria-label="Next step"><ArrowRight size={16} /></button>
      </div>
    </div>
  </div>;
}
