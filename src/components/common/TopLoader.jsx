import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global API to control the top loader programmatically
 * e.g., topLoader.start(), topLoader.done()
 */
export const topLoader = {
  start: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:toploader:start"));
    }
  },
  done: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:toploader:done"));
    }
  },
};

export default function TopLoader() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleTimerRef = useRef(null);
  const finishTimerRef = useRef(null);
  const isFirstRender = useRef(true);

  const startProgress = () => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);

    setVisible(true);
    setProgress((prev) => (prev > 0 && prev < 80 ? prev : 25));

    // Trickle forward smoothly
    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(trickleTimerRef.current);
          return prev;
        }
        // As it gets higher, slow down the increment
        const increment = Math.max(1, (85 - prev) * 0.15);
        return Math.min(85, prev + increment);
      });
    }, 120);
  };

  const completeProgress = () => {
    if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
    setProgress(100);

    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      finishTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 150);
  };

  // Route change listener
  useEffect(() => {
    // Avoid triggering on cold mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    startProgress();
    // Complete after route transition finishes
    const timer = setTimeout(() => {
      completeProgress();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, location.search]);

  // Global event listeners for async actions
  useEffect(() => {
    const handleStart = () => startProgress();
    const handleDone = () => completeProgress();

    window.addEventListener("app:toploader:start", handleStart);
    window.addEventListener("app:toploader:done", handleDone);

    return () => {
      window.removeEventListener("app:toploader:start", handleStart);
      window.removeEventListener("app:toploader:done", handleDone);
      if (trickleTimerRef.current) clearInterval(trickleTimerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[99999] h-[2.5px] w-full overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease-out",
      }}
    >
      <div
        className="h-full relative"
        style={{
          width: `${progress}%`,
          backgroundColor: "var(--primary, #2563eb)",
          transition: progress === 100
            ? "width 120ms ease-out"
            : "width 220ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 10px var(--primary-glow, rgba(37, 99, 235, 0.6))",
        }}
      >
        {/* Glow head on the leading edge */}
        <div
          className="absolute top-0 right-0 h-full w-24 -translate-y-1/2 translate-x-1"
          style={{
            height: "100%",
            boxShadow:
              "0 0 12px var(--primary, #2563eb), 0 0 6px var(--primary, #2563eb)",
            opacity: 0.85,
          }}
        />
      </div>
    </div>
  );
}
