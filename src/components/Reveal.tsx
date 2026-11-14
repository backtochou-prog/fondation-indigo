"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Apparition douce au défilement. Sans JavaScript ou avec « réduire les animations », tout est visible. */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" | "article" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Any = Tag as React.ElementType;
  return <Any ref={ref} className={`rise ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>{children}</Any>;
}
