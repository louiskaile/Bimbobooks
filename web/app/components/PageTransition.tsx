"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Fade IN when pathname changes (new page arrived)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fadeIn = () => {
      gsap.killTweensOf(el);
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
    };

    const observer = new MutationObserver(() => {
      observer.disconnect();
      requestAnimationFrame(() => fadeIn());
    });

    observer.observe(el, { childList: true, subtree: true });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (el.style.opacity === "0" || getComputedStyle(el).opacity === "0") {
          observer.disconnect();
          fadeIn();
        }
      });
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Intercept internal link clicks to fade OUT before navigating
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href === pathname ||
        anchor.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return;
      }

      e.preventDefault();

      const el = containerRef.current;
      if (!el) {
        router.push(href);
        return;
      }

      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          window.scrollTo(0, 0);
          router.push(href);
        },
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, router]);

  return (
    <div ref={containerRef} style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
