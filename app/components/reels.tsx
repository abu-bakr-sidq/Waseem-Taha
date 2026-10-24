"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { reels, type Reel } from "../content";
import { ease } from "./ui";

/* Short-form video: each phone loops a 6-second muted preview while it is on screen; tap one to watch it with sound. */

function ReelCard({ reel, index, onOpen }: { reel: Reel; index: number; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = video.current;
    if (!el || reduce) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);
  return <motion.li className="reel" initial={{ opacity: 0, y: 46 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.07, duration: 0.75, ease }}>
    <button type="button" className="reel-phone" onClick={onOpen} aria-label={`Play ${reel.title}, ${reel.client}, ${reel.duration}`}>
      <video ref={video} className="reel-video" src={reel.preview} poster={reel.poster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      <span className="reel-shade" aria-hidden="true" />
      <span className="reel-time" aria-hidden="true">{reel.duration}</span>
      <span className="reel-play" aria-hidden="true"><Play size={17} fill="currentColor" /></span>
    </button>
    <p className="reel-client">{reel.client}<span>{reel.kind}</span></p>
    <h4 className="reel-title">{reel.title}</h4>
  </motion.li>;
}

function ReelViewer({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (dir: number) => void }) {
  const reel = reels[index];
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const { overflow, paddingRight } = root.style;
    root.style.paddingRight = `${window.innerWidth - root.clientWidth}px`;
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = overflow;
      root.style.paddingRight = paddingRight;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onStep(1);
      else if (event.key === "ArrowLeft") onStep(-1);
      else if (event.key === "Tab" && panel.current) {
        const focusable = [...panel.current.querySelectorAll<HTMLElement>("button, video[controls]")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return <motion.div className="reel-viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} transition={{ duration: 0.3 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div ref={panel} className="reel-viewer-panel" role="dialog" aria-modal="true" aria-labelledby="reel-viewer-title" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.5, ease }}>
      <button ref={closeButton} type="button" className="viewer-close reel-viewer-close" onClick={onClose} aria-label="Close video"><X size={18} /></button>
      <div className="reel-viewer-stage">
        <button type="button" className="viewer-arrow is-prev" onClick={() => onStep(-1)} aria-label="Previous reel"><ArrowLeft size={18} /></button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={reel.src} className="reel-viewer-phone" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease }}>
            <video src={reel.src} poster={reel.poster} controls autoPlay playsInline preload="auto" />
          </motion.div>
        </AnimatePresence>
        <button type="button" className="viewer-arrow is-next" onClick={() => onStep(1)} aria-label="Next reel"><ArrowRight size={18} /></button>
      </div>
      <div className="reel-viewer-info" aria-live="polite">
        <p>{reel.client}<span>{reel.kind}</span></p>
        <h3 id="reel-viewer-title">{reel.title}</h3>
        <small>Reel {index + 1} of {reels.length} · {reel.duration}</small>
      </div>
    </motion.div>
  </motion.div>;
}

export function Reels() {
  const [open, setOpen] = useState<number | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const step = useCallback((dir: number) => setOpen((current) => (current === null ? current : (current + dir + reels.length) % reels.length)), []);
  const close = useCallback(() => setOpen(null), []);
  const slide = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (el && card) el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16) * 2, behavior: "smooth" });
  };
  return <div className="reels">
    <div className="reels-head">
      <motion.h3 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease }}>Short-form <em>video.</em></motion.h3>
      <motion.div className="reels-side" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: 0.1, duration: 0.7, ease }}>
        <p>A Dubai website teaser, doctor-led explainers, product reels and patient stories for Dr Talat&apos;s and Sehat, plus a design-tips reel. Tap any reel to watch it with sound.</p>
        <div className="reels-nav"><button type="button" onClick={() => slide(-1)} aria-label="Scroll reels back"><ArrowLeft size={17} /></button><button type="button" onClick={() => slide(1)} aria-label="Scroll reels forward"><ArrowRight size={17} /></button></div>
      </motion.div>
    </div>
    <ul ref={track} className="reels-track">{reels.map((reel, index) => <ReelCard key={reel.src} reel={reel} index={index} onOpen={() => setOpen(index)} />)}</ul>
    <AnimatePresence>{open !== null && <ReelViewer key="reel-viewer" index={open} onClose={close} onStep={step} />}</AnimatePresence>
  </div>;
}
