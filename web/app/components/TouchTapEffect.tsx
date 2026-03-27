"use client";

import { useEffect } from "react";

export default function TouchTapEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    const cursorUrl = '/cursors/custom-cursor.svg';

    function handleTouchStart(e: TouchEvent) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        showTapAt(t.clientX, t.clientY);
      }
    }

    function showTapAt(x: number, y: number) {
      const el = document.createElement('div');
      el.className = 'tap-cursor';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.backgroundImage = `url(${cursorUrl})`;
      document.body.appendChild(el);
      // Force reflow then add visible class to trigger CSS animation
      requestAnimationFrame(() => el.classList.add('tap-cursor--visible'));
      setTimeout(() => {
        el.classList.remove('tap-cursor--visible');
        // remove after animation
        setTimeout(() => el.remove(), 300);
      }, 300);
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return null;
}
