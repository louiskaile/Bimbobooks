"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import styles from "./styles/module/hero.module.scss";

type Slide = { desktop: string; mobile?: string };

type Props = {
  // image can be a single string (desktop-only) or an array of strings or slide objects
  image?: string | string[] | Array<string | Slide>;
  letters?: string;
  email?: string;
  logo?: string | null;
  mobileLogo?: string | null;
};

export default function HeroImageText({
  image = "/images/hero.jpg",
  letters = "BIMBO",
  email = "info@bimbobooks.com",
  logo = null,
  mobileLogo = null,
}: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  // Fallback: choose mobileLogo on small viewports if available
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Background slideshow support when `image` is an array. Normalize to array of slides.
  const slides: Slide[] = Array.isArray(image)
    ? (image as Array<string | Slide>).map((it) => {
        if (!it) return { desktop: "/images/hero.jpg" };
        if (typeof it === "string") return { desktop: it };
        return { desktop: (it as Slide).desktop || (it as any).image || "/images/hero.jpg", mobile: (it as Slide).mobile };
      })
    : [{ desktop: String(image) }];

  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useRef(true);
  const sectionRef = useRef<HTMLElement>(null);
  const mobileCursorRef = useRef<HTMLDivElement | null>(null);

  // For crossfade: track which DOM layer is visible and the background images for both
  const [showA, setShowA] = useState(true);
  const [layerA, setLayerA] = useState<string>(slides[0]?.desktop || "/images/hero.jpg");
  const [layerB, setLayerB] = useState<string>("");

  // Refs for mouse-driven cycling (avoid stale closures in event handlers)
  const showARef = useRef(showA);
  const currentIndexRef = useRef(currentIndex);
  const isMobileRef = useRef(isMobile);
  const accDistRef = useRef(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const isTransitioningRef = useRef(false);
  const lastAdvanceRef = useRef<number>(0);

  useEffect(() => { showARef.current = showA; }, [showA]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  // Advance to the next slide with a crossfade
  const advanceSlide = useCallback(() => {
    if (!mounted.current || slides.length <= 1) return;
    if (isTransitioningRef.current) return;

    const next = (currentIndexRef.current + 1) % slides.length;
    const nextSlide = slides[next] || { desktop: "/images/hero.jpg" };
    const nextUrl = isMobileRef.current && nextSlide.mobile
      ? nextSlide.mobile
      : nextSlide.desktop || "/images/hero.jpg";

    const doSwap = () => {
      if (!mounted.current) return;
      isTransitioningRef.current = true;
      if (showARef.current) {
        setLayerB(nextUrl);
      } else {
        setLayerA(nextUrl);
      }
      setShowA((s) => !s);
      setCurrentIndex(next);
      isTransitioningRef.current = false;
    };

    const img = new Image();
    img.src = nextUrl;
    img.onload = doSwap;
    img.onerror = () => { setCurrentIndex(next); };
  }, [slides]);

  // Desktop: mouse-movement-driven cycling
  // Every 200px of accumulated cursor movement → advance one slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const section = sectionRef.current;
    if (!section) return;

    const THRESHOLD = 120; // px of movement before advancing (reduced for easier triggers)
    const MIN_INTERVAL = 400; // ms cooldown between advances

    const onMouseMove = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      const last = lastPosRef.current;
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        accDistRef.current += Math.sqrt(dx * dx + dy * dy);
        if (accDistRef.current >= THRESHOLD) {
          const now = Date.now();
          // only advance if enough time has passed since last advance
          if (now - lastAdvanceRef.current >= MIN_INTERVAL) {
            lastAdvanceRef.current = now;
            accDistRef.current = 0;
            advanceSlide();
          } else {
            // reset accumulator but don't advance yet
            accDistRef.current = 0;
          }
        }
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    section.addEventListener('mousemove', onMouseMove);
    return () => section.removeEventListener('mousemove', onMouseMove);
  }, [slides.length, advanceSlide]);

  // Mobile fallback: slow auto-timer (5s)
  useEffect(() => {
    mounted.current = true;
    if (slides.length <= 1 || !isMobile) return;

    const id = setInterval(() => {
      if (!mounted.current) return;
      advanceSlide();
    }, 2000);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [slides.length, isMobile, advanceSlide]);

  // currentImage for single-image fallback
  const currentSlide = slides[currentIndex] || { desktop: "/images/hero.jpg" };
  const currentImage = isMobile && currentSlide.mobile ? currentSlide.mobile : currentSlide.desktop || "/images/hero.jpg";

  // ensure initial layers reflect mobile/desktop choice when breakpoint or slides change
  useEffect(() => {
    const first = slides[0] || { desktop: "/images/hero.jpg" };
    const firstUrl = isMobile && first.mobile ? first.mobile : first.desktop || "/images/hero.jpg";
    setLayerA(firstUrl);
    setLayerB("");
    setShowA(true);
    setCurrentIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, slides.length]);

  // touch-active class for smaller cursor on press
  useEffect(() => {
    const footer = document.getElementsByClassName(styles.footerLeft)[0] as HTMLElement | undefined;
    const anchor = footer?.querySelector('a') as HTMLElement | null | undefined;
    if (!anchor) return;

    const onDown = () => anchor.classList.add('touch-active');
    const onUp = () => anchor.classList.remove('touch-active');

    anchor.addEventListener('touchstart', onDown, { passive: true } as AddEventListenerOptions);
    anchor.addEventListener('touchend', onUp);
    anchor.addEventListener('mousedown', onDown);
    anchor.addEventListener('mouseup', onUp);

    return () => {
      anchor.removeEventListener('touchstart', onDown as any);
      anchor.removeEventListener('touchend', onUp as any);
      anchor.removeEventListener('mousedown', onDown as any);
      anchor.removeEventListener('mouseup', onUp as any);
      anchor.classList.remove('touch-active');
    };
  }, []);

  // Mobile: show a visible custom cursor that follows touch and shrinks on press
  useEffect(() => {
    if (!sectionRef.current) return;
    const cursorEl = mobileCursorRef.current;
    if (!cursorEl) return;

    const showAt = (x: number, y: number) => {
      cursorEl.style.left = `${x}px`;
      cursorEl.style.top = `${y}px`;
      cursorEl.style.display = 'block';
    };

    const hide = () => {
      cursorEl.style.display = 'none';
    };

    const onTouchMove = (ev: TouchEvent) => {
      const t = ev.touches[0];
      if (!t) return;
      showAt(t.clientX, t.clientY);
    };

    const onTouchStart = (ev: TouchEvent) => {
      const t = ev.touches[0];
      if (!t) return;
      showAt(t.clientX, t.clientY);
      cursorEl.classList.add(styles.mobileCursorActive);
    };

    const onTouchEnd = () => {
      cursorEl.classList.remove(styles.mobileCursorActive);
      // hide shortly after release
      setTimeout(hide, 120);
    };

    sectionRef.current.addEventListener('touchmove', onTouchMove, { passive: true });
    sectionRef.current.addEventListener('touchstart', onTouchStart, { passive: true } as AddEventListenerOptions);
    sectionRef.current.addEventListener('touchend', onTouchEnd);

    return () => {
      sectionRef.current?.removeEventListener('touchmove', onTouchMove as any);
      sectionRef.current?.removeEventListener('touchstart', onTouchStart as any);
      sectionRef.current?.removeEventListener('touchend', onTouchEnd as any);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.root}>
      <div className={styles.bg}>
        <div
          className={`${styles.layer} ${showA ? styles.show : ""}`}
          style={{ backgroundImage: `url(${layerA || currentImage})` }}
        />
        <div
          className={`${styles.layer} ${!showA ? styles.show : ""}`}
          style={{ backgroundImage: `url(${layerB || currentImage})` }}
        />
      </div>

      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.inner}>
          {logo ? (
            <img
              src={isMobile && mobileLogo ? mobileLogo : logo}
              alt="Site logo"
              className={styles.logoImg}
            />
          ) : (
            <div className={styles.letters}>
              {letters.split("").map((char, i) => (
                <span key={i} className={styles.letter} aria-hidden={true}>
                  {char}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footerLeft}>
        <a href={`mailto:${email}`}>{email}</a>
      </div>

      <div className={styles.footerRight}>© BIMBO BOOKS 2026</div>
      <div ref={mobileCursorRef} className={styles.mobileCursor} />
    </section>
  );
}
