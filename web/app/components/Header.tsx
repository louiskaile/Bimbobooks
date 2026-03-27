"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./styles/module/header.module.scss";
import { Logo } from "./Icons";
import ResolvedLink from "./ResolvedLink";

interface NavLink {
  _type: string;
  linkType: string;
  href?: string;
  openInNewTab?: boolean;
  page?: string;
  post?: string;
}

interface SubmenuItem {
  _key: string;
  label: string;
  visible: boolean;
  link?: NavLink;
}

interface NavItem {
  _key: string;
  label: string;
  visible: boolean;
  link?: NavLink;
  submenu?: SubmenuItem[];
}

interface NavigationData {
  items?: NavItem[];
}

interface HeaderProps {
  navigation?: NavigationData | null;
}

export default function Header({ navigation }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const visibleItems = navigation?.items?.filter((item) => item.visible !== false) ?? [];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      {/* <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.logo}>
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
            >
              {visibleItems.map((item) => (
                <li key={item._key}>
                  {item.link ? (
                    <ResolvedLink link={item.link} className="hover:underline">
                      {item.label}
                    </ResolvedLink>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div> */}
    </header>
  );
}
