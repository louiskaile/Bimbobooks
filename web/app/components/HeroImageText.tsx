"use client";

import React, { useEffect, useState } from "react";
import styles from "./styles/module/hero.module.scss";

type Props = {
  image?: string;
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

  return (
    <section className={styles.root}>
      <div
        className={styles.bg}
        style={{ backgroundImage: `url(${image})` }}
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
