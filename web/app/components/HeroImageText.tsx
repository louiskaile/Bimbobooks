"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./styles/module/hero.module.scss";

type Props = {
  image?: string | string[];
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

  // Background slideshow support when `image` is an array
  const images = Array.isArray(image) ? image : [String(image)];
  const [currentIndex, setCurrentIndex] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (images.length <= 1) return;
    const id = setInterval(() => {
      if (!mounted.current) return;
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 2000);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [images.length]);

  const currentImage = images[currentIndex] || "/images/hero.jpg";

  return (
    <section className={styles.root}>
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${currentImage})` }}
      />

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
