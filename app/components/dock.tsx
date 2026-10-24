"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Component, Frame, MessageCircle, MousePointer2, PenTool, Smartphone, Type } from "lucide-react";
import { useEffect, useState } from "react";

/* A Figma-style toolbar that doubles as section navigation; the ring fills as you move down the page. */

const sections = [
  { id: "top", label: "Home", Icon: MousePointer2 },
  { id: "about", label: "About", Icon: Frame },
  { id: "work", label: "Selected works", Icon: PenTool },
  { id: "ux", label: "UX / UI", Icon: Smartphone },
  { id: "experience", label: "Experience", Icon: Type },
  { id: "skills", label: "Skills & tools", Icon: Component },
  { id: "contact", label: "Contact", Icon: MessageCircle },
];

export function FigmaDock() {
  const [active, setActive] = useState("top");
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const index = Math.max(0, sections.findIndex((section) => section.id === active));
  return <motion.nav className="dock" aria-label="Section navigation" inert={!visible} initial={false} animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 28 }}>
    <div className="dock-tools">{sections.map(({ id, label, Icon }) => <a key={id} href={`#${id}`} className={id === active ? "is-on" : ""} aria-label={label} aria-current={id === active ? "true" : undefined}>
      {id === active && <motion.span layoutId="dock-active" className="dock-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
      <Icon size={17} strokeWidth={1.75} /><span className="dock-tip">{label}</span>
    </a>)}</div>
    <span className="dock-sep" aria-hidden="true" />
    <div className="dock-now" aria-hidden="true">
      <svg className="dock-ring" viewBox="0 0 24 24"><circle className="dock-ring-track" cx="12" cy="12" r="9" /><motion.circle className="dock-ring-fill" cx="12" cy="12" r="9" style={{ pathLength: scrollYProgress }} /></svg>
      <span className="dock-now-text"><AnimatePresence initial={false}><motion.span key={active} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>{sections[index].label}</motion.span></AnimatePresence></span>
      <span className="dock-now-count">{index + 1} / {sections.length}</span>
    </div>
  </motion.nav>;
}
