"use client";

import React, { useEffect } from "react";
import styles from "./styles/module/hero.module.scss";

type Props = {
  image?: string;
  letters?: string;
  email?: string;
  logo?: string | null;
};

export default function HeroImageText({
  image = "/images/hero.jpg",
  letters = "BIMBO",
  email = "info@bimbobooks.com",
  logo = null,
}: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
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
            <img src={logo} alt="Site logo" className={styles.logoImg} />
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

      <div className={styles.footerLeft}>{email}</div>

      <div className={styles.footerRight}>© BIMBO BOOKS 2026</div>
    </section>
  );
}
