"use client";

import { useEffect } from "react";

export default function TouchTapEffect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    const cursorUrl = '/cursors/custom-cursor.svg';

    let persistentEl: HTMLDivElement | null = null;

    function handleTouchStart(e: TouchEvent) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        showTapAt(t.clientX, t.clientY);
      }
    }

    function showTapAt(x: number, y: number) {
      if (!persistentEl) {
        persistentEl = document.createElement('div');
        persistentEl.className = 'tap-cursor';
        persistentEl.style.backgroundImage = `url(${cursorUrl})`;
        document.body.appendChild(persistentEl);
        // Force reflow then show
        requestAnimationFrame(() => persistentEl && persistentEl.classList.add('tap-cursor--visible'));
      }
      if (persistentEl) {
        persistentEl.style.left = x + 'px';
        persistentEl.style.top = y + 'px';
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      if (persistentEl && persistentEl.parentNode) {
        persistentEl.parentNode.removeChild(persistentEl);
        persistentEl = null;
      }
    };
  }, []);

  return null;
}
