"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { reels, workCategories, works, type Work, type WorkCategory } from "../content";
import { Reels } from "./reels";
import { CountUp, Topline, ease } from "./ui";

type Filter = "All" | WorkCategory;

const pieceCount = works.reduce((sum, work) => sum + work.images.length, 0);
const filters: Filter[] = ["All", ...workCategories];

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 70 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -70, transition: { duration: 0.3, ease } }),
};

function Cover({ work }: { work: Work }) {
  const { layout, pick, fit } = work.cover;
  const items = pick.map((index) => work.images[index]);
  if (layout === "fill") return <Image className={`work-fill${fit === "contain" ? " is-contain" : ""}`} src={items[0].src} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />;
  const mid = (items.length - 1) / 2;
  return <span className={`work-${layout}`}>{items.map((item, index) => <span key={item.src} className="work-piece" style={{ "--o": index - mid, "--a": Math.abs(index - mid), aspectRatio: `${item.w} / ${item.h}`, zIndex: Math.round(10 - Math.abs(index - mid) * 2) } as React.CSSProperties}><Image src={item.src} alt="" fill sizes="(max-width: 760px) 45vw, 22vw" /></span>)}</span>;
}

export function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const hoverRef = useRef(false);
  const pointerX = useMotionValue(-300);
  const pointerY = useMotionValue(-300);
  const cursorX = useSpring(pointerX, { stiffness: 420, damping: 36, mass: 0.5 });
  const cursorY = useSpring(pointerY, { stiffness: 420, damping: 36, mass: 0.5 });
  const shown = filter === "All" ? works : works.filter((work) => work.category === filter);
  const open = works.find((work) => work.slug === openSlug);
  const count = (item: Filter) => (item === "All" ? works.length : works.filter((work) => work.category === item).length);
  // Other sections can open a project here, e.g. the WooCommerce card: window.dispatchEvent(new CustomEvent("open-work", { detail: slug })).
  useEffect(() => {
    const onOpen = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      if (works.some((work) => work.slug === slug)) setOpenSlug(slug);
    };
    window.addEventListener("open-work", onOpen);
    return () => window.removeEventListener("open-work", onOpen);
  }, []);
  // Scrolling moves cards out from under a still pointer without a pointerleave, so the tag hides until the pointer moves again.
  useEffect(() => {
    const hide = () => { hoverRef.current = false; setHovering(false); };
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);

  return <section id="work" className="works">
    <div className="shell">
      <Topline label="Selected works" index="03 / 07" />
      <div className="works-head">
        <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease }}>Selected<br /><em>works.</em></motion.h2>
        <motion.div className="works-intro" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: 0.12, duration: 0.7, ease }}>
          <p>Real briefs for real brands: in-store campaigns for <b>Flipkart Minutes</b>, social, video and web for <b>Dr Talat&apos;s</b> and <b>Sehat</b>, packaging for food, skincare, drinks and automotive brands, and stall graphics for <b>Ayush 2026</b>.</p>
          <ul className="works-stats">
            <li><CountUp to={works.length} /><span>Projects</span></li>
            <li><CountUp to={pieceCount} /><span>Designs</span></li>
            <li><CountUp to={reels.length} /><span>Reels</span></li>
          </ul>
        </motion.div>
      </div>
      <div className="works-bar">
        <div className="works-filters" role="group" aria-label="Filter projects by discipline">
          {filters.map((item) => <button key={item} type="button" aria-pressed={filter === item} className={filter === item ? "is-on" : ""} onClick={() => setFilter(item)}>
            {filter === item && <motion.span layoutId="works-filter" className="works-filter-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span>{item === "All" ? "All work" : item}</span><em>{count(item)}</em>
          </button>)}
        </div>
        <p className="works-hint" aria-live="polite">{shown.length} {shown.length === 1 ? "project" : "projects"} · tap a card to open it</p>
      </div>
    </div>

    <motion.div layout className={`works-grid shell ${filter === "All" ? "is-bento" : `is-filtered count-${Math.min(shown.length, 3)}`}`} onPointerMove={(event) => {
      const over = Boolean((event.target as Element).closest(".work-card"));
      if (over && !hoverRef.current) { cursorX.jump(event.clientX); cursorY.jump(event.clientY); }
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      hoverRef.current = over;
      setHovering(over);
    }} onPointerLeave={() => { hoverRef.current = false; setHovering(false); }}>
      <AnimatePresence mode="popLayout">
        {shown.map((work) => <motion.article key={work.slug} layout className={`work-card size-${work.size}`} initial={{ opacity: 0, y: 46 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }} transition={{ duration: 0.75, ease }}>
          <div className="work-visual" style={{ background: work.cover.tone }}>
            <Cover work={work} />
            <span className="work-frame" aria-hidden="true"><i />{work.client}</span>
            <span className="work-select" aria-hidden="true"><i /><i /><i /><i /><b>{work.format}</b></span>
          </div>
          <div className="work-meta">
            <div className="work-name"><h3>{work.client}</h3><p>{work.title}</p></div>
            <div className="work-info"><span className="work-tag">{work.category}</span><span className="work-count">{work.images.length} {work.images.length === 1 ? "design" : "designs"}</span></div>
            <ArrowUpRight className="work-arrow" size={18} aria-hidden="true" />
          </div>
          <button type="button" className="work-hit" onClick={() => setOpenSlug(work.slug)} aria-label={`Open project: ${work.client}, ${work.title}`} />
        </motion.article>)}
      </AnimatePresence>
    </motion.div>

    <div className="shell"><Reels /></div>

    <motion.div className="works-cursor" style={{ x: cursorX, y: cursorY }} animate={{ opacity: hovering && !open ? 1 : 0, scale: hovering && !open ? 1 : 0.6 }} transition={{ duration: 0.2 }} aria-hidden="true">
      <svg viewBox="0 0 16 18"><path d="M1.2 1.2 14 7.4 8.4 9.1 6 14.6Z" /></svg><span>View project</span>
    </motion.div>

    <AnimatePresence>{open && <WorkViewer key="viewer" work={open} onClose={() => setOpenSlug(null)} onNavigate={setOpenSlug} />}</AnimatePresence>
  </section>;
}

function WorkViewer({ work, onClose, onNavigate }: { work: Work; onClose: () => void; onNavigate: (slug: string) => void }) {
  const [{ index, dir }, setView] = useState({ index: 0, dir: 1 });
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const position = works.indexOf(work);
  const image = work.images[index];
  const many = work.images.length > 1;

  const show = useCallback((next: number) => setView((view) => ({ index: (next + work.images.length) % work.images.length, dir: next > view.index ? 1 : -1 })), [work.images.length]);
  const jump = (step: number) => {
    onNavigate(works[(position + step + works.length) % works.length].slug);
    setView({ index: 0, dir: step });
  };

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
      else if (event.key === "ArrowRight" && many) show(index + 1);
      else if (event.key === "ArrowLeft" && many) show(index - 1);
      else if (event.key === "Tab" && panel.current) {
        const focusable = [...panel.current.querySelectorAll<HTMLElement>("button, a[href]")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, many, onClose, show]);

  return <motion.div className="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }} transition={{ duration: 0.3 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div ref={panel} className="viewer-panel" role="dialog" aria-modal="true" aria-labelledby="viewer-title" initial={{ clipPath: "inset(100% 0% 0% 0%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(0% 0% 100% 0%)" }} transition={{ duration: 0.75, ease: [0.77, 0, 0.18, 1] }}>
      <div className="viewer-bar">
        <span className="viewer-bar-count">Project <b>{position + 1}</b> of {works.length}</span>
        <span className="viewer-bar-cat">{work.category}</span>
        <span className="viewer-bar-format">{work.format}</span>
        <button ref={closeButton} type="button" className="viewer-close" onClick={onClose} aria-label="Close project"><X size={18} /></button>
      </div>
      <div className="viewer-body">
        <AnimatePresence mode="wait" initial={false}>
          <motion.aside key={work.slug} className="viewer-info" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
            <p className="viewer-cat">{work.category}<span>{work.images.length} {work.images.length === 1 ? "design" : "designs"}</span></p>
            <h2 id="viewer-title">{work.client}<em>{work.title}</em></h2>
            <p className="viewer-desc">{work.description}</p>
            <dl>
              <div><dt>Format</dt><dd>{work.format}</dd></div>
              <div><dt>Deliverables</dt><dd className="viewer-chips">{work.deliverables.map((item) => <span key={item}>{item}</span>)}</dd></div>
              {work.credit && <div><dt>Credit</dt><dd>{work.credit}</dd></div>}
            </dl>
            <div className="viewer-jump"><button type="button" onClick={() => jump(-1)}><ArrowLeft size={14} /> Previous</button><button type="button" onClick={() => jump(1)}>Next project <ArrowRight size={14} /></button></div>
          </motion.aside>
        </AnimatePresence>
        <div className="viewer-stage">
          <div className="viewer-image">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div key={image.src} className="viewer-slide" custom={dir} variants={slide} initial="enter" animate="center" exit="exit" drag={many ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(_, info) => { if (info.offset.x < -70) show(index + 1); else if (info.offset.x > 70) show(index - 1); }}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 66vw" quality={90} loading="eager" draggable={false} />
              </motion.div>
            </AnimatePresence>
            {many && <>
              <button type="button" className="viewer-arrow is-prev" onClick={() => show(index - 1)} aria-label="Previous image"><ArrowLeft size={18} /></button>
              <button type="button" className="viewer-arrow is-next" onClick={() => show(index + 1)} aria-label="Next image"><ArrowRight size={18} /></button>
            </>}
          </div>
          <p className="viewer-caption" aria-live="polite"><span>{index + 1} of {work.images.length}</span>{image.caption}</p>
          {many && <div className="viewer-thumbs">{work.images.map((item, itemIndex) => <button key={item.src} type="button" className={itemIndex === index ? "is-on" : ""} aria-label={`Show ${item.caption}`} aria-current={itemIndex === index ? "true" : undefined} onClick={() => show(itemIndex)}><Image src={item.src} alt="" fill sizes="64px" /></button>)}</div>}
        </div>
      </div>
    </motion.div>
  </motion.div>;
}
