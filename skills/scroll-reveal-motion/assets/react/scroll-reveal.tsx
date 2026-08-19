"use client";

import {
  createElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

type RevealElement = "div" | "section" | "article" | "aside" | "header" | "footer" | "ul" | "ol";

type ScrollRevealProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: RevealElement;
  children: ReactNode;
  delay?: number;
  stagger?: boolean;
};

type RevealStyle = CSSProperties & {
  "--reveal-delay": string;
};

const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function ScrollReveal({
  as = "div",
  children,
  delay = 0,
  stagger = false,
  style,
  ...props
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement>(null);

  useClientLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    element.dataset.revealReady = "true";

    const revealImmediately = () => {
      element.dataset.revealVisible = "true";
    };

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      revealImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        revealImmediately();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.16 },
    );

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      revealImmediately();
      observer.disconnect();
    };

    motionPreference.addEventListener("change", handleMotionPreference);
    observer.observe(element);

    return () => {
      motionPreference.removeEventListener("change", handleMotionPreference);
      observer.disconnect();
    };
  }, []);

  const revealStyle: RevealStyle = {
    ...style,
    "--reveal-delay": `${Math.max(0, delay)}ms`,
  };

  return createElement(
    as,
    {
      ...props,
      "data-scroll-reveal": stagger ? "stagger" : "single",
      ref: elementRef,
      style: revealStyle,
    },
    children,
  );
}
