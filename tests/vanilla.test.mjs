import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../skills/scroll-reveal-motion/assets/vanilla/scroll-reveal.js", import.meta.url),
  "utf8",
);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const { initScrollReveal } = await import(moduleUrl);

function createElement(initial = {}) {
  return { dataset: { ...initial } };
}

function createScope(elements) {
  return {
    querySelectorAll(selector) {
      assert.equal(selector, '[data-scroll-reveal="single"], [data-scroll-reveal="stagger"]');
      return elements;
    },
  };
}

function createView({ reducedMotion = false, intersectionObserver = true } = {}) {
  const mediaListeners = new Set();
  const mediaQuery = {
    matches: reducedMotion,
    addEventListener(type, listener) {
      if (type === "change") mediaListeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === "change") mediaListeners.delete(listener);
    },
    enableReducedMotion() {
      this.matches = true;
      for (const listener of mediaListeners) listener({ matches: true });
    },
  };

  const view = {
    matchMedia(query) {
      assert.equal(query, "(prefers-reduced-motion: reduce)");
      return mediaQuery;
    },
  };

  if (intersectionObserver) {
    view.IntersectionObserver = class {
      static instances = [];

      constructor(callback, options) {
        this.callback = callback;
        this.options = options;
        this.observed = new Set();
        this.disconnected = false;
        view.IntersectionObserver.instances.push(this);
      }

      observe(element) {
        this.observed.add(element);
      }

      unobserve(element) {
        this.observed.delete(element);
      }

      disconnect() {
        this.disconnected = true;
        this.observed.clear();
      }

      enter(element) {
        this.callback([{ target: element, isIntersecting: true }]);
      }
    };
  }

  return { mediaQuery, view };
}

test("reveals immediately when reduced motion is enabled", () => {
  const elements = [createElement(), createElement()];
  const { view } = createView({ reducedMotion: true });

  initScrollReveal({ scope: createScope(elements), view });

  for (const element of elements) {
    assert.equal(element.dataset.revealReady, "true");
    assert.equal(element.dataset.revealVisible, "true");
  }
  assert.equal(view.IntersectionObserver.instances.length, 0);
});

test("reveals observed elements once and disconnects after the group settles", () => {
  const first = createElement();
  const second = createElement();
  const { view } = createView();

  const cleanup = initScrollReveal({ scope: createScope([first, second]), view });
  const observer = view.IntersectionObserver.instances[0];

  assert.deepEqual(observer.options, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.16,
  });
  assert.equal(first.dataset.revealReady, "true");
  assert.equal(first.dataset.revealVisible, undefined);

  observer.enter(first);
  assert.equal(first.dataset.revealVisible, "true");
  assert.equal(observer.disconnected, false);

  observer.enter(second);
  assert.equal(second.dataset.revealVisible, "true");
  assert.equal(observer.disconnected, true);

  cleanup();
});

test("reveals pending content if reduced motion changes while observing", () => {
  const element = createElement();
  const { mediaQuery, view } = createView();

  initScrollReveal({ scope: createScope([element]), view });
  const observer = view.IntersectionObserver.instances[0];
  mediaQuery.enableReducedMotion();

  assert.equal(element.dataset.revealVisible, "true");
  assert.equal(observer.disconnected, true);
});

test("cleanup leaves pending content visible for page restoration", () => {
  const element = createElement();
  const { view } = createView();

  const cleanup = initScrollReveal({ scope: createScope([element]), view });
  const observer = view.IntersectionObserver.instances[0];
  cleanup();

  assert.equal(element.dataset.revealVisible, "true");
  assert.equal(observer.disconnected, true);
});

test("reveals immediately when Intersection Observer is unavailable", () => {
  const element = createElement();
  const { view } = createView({ intersectionObserver: false });

  initScrollReveal({ scope: createScope([element]), view });

  assert.equal(element.dataset.revealReady, "true");
  assert.equal(element.dataset.revealVisible, "true");
});
