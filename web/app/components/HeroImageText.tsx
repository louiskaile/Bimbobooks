"use client";

import React, { useEffect, useState, useRef } from "react";
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

  // For crossfade: track which DOM layer is visible and the background images for both
  const [showA, setShowA] = useState(true);
  const [layerA, setLayerA] = useState<string>(slides[0]?.desktop || "/images/hero.jpg");
  const [layerB, setLayerB] = useState<string>("");

  useEffect(() => {
    mounted.current = true;
    if (slides.length <= 1) {
      // ensure initial layer set
      setLayerA(slides[0]?.desktop || "/images/hero.jpg");
      return;
    }

    const id = setInterval(() => {
      if (!mounted.current) return;
      const next = (currentIndex + 1) % slides.length;

      // choose image URL for next slide considering mobile
      const nextSlide = slides[next] || { desktop: "/images/hero.jpg" };
      const nextUrl = isMobile && nextSlide.mobile ? nextSlide.mobile : nextSlide.desktop || "/images/hero.jpg";

      // preload next image then swap layers to avoid white flash
      const img = new Image();
      img.src = nextUrl;
      img.onload = () => {
        if (!mounted.current) return;
        if (showA) {
          setLayerB(nextUrl);
        } else {
          setLayerA(nextUrl);
        }
        // toggle visible layer to crossfade
        setShowA((s) => !s);
        setCurrentIndex(next);
      };
      img.onerror = () => {
        // still advance index even if preload fails
        setCurrentIndex(next);
      };
    }, 2000);

    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [slides.length, currentIndex, isMobile, showA]);

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

  return (
    <section className={styles.root}>
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
    </section>
  );
}
