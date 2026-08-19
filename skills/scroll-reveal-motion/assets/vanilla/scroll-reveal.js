const REVEAL_SELECTOR = '[data-scroll-reveal="single"], [data-scroll-reveal="stagger"]';
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Initialize one-time viewport reveals inside a document or element.
 * Call this from a deferred/module script and keep the returned cleanup function.
 */
export function initScrollReveal({
  scope = document,
  view = window,
  rootMargin = "0px 0px -8% 0px",
  threshold = 0.16,
} = {}) {
  const elements = Array.from(scope.querySelectorAll(REVEAL_SELECTOR)).filter(
    (element) => element.dataset.revealReady !== "true",
  );

  if (elements.length === 0) return () => {};

  const motionPreference = view.matchMedia(REDUCED_MOTION_QUERY);
  const reveal = (element) => {
    element.dataset.revealVisible = "true";
  };

  for (const element of elements) {
    element.dataset.revealReady = "true";
  }

  if (motionPreference.matches || !("IntersectionObserver" in view)) {
    elements.forEach(reveal);
    return () => {};
  }

  const pending = new Set(elements);
  const observer = new view.IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !pending.has(entry.target)) continue;
        reveal(entry.target);
        pending.delete(entry.target);
        observer.unobserve(entry.target);
      }

      if (pending.size === 0) observer.disconnect();
    },
    { rootMargin, threshold },
  );

  const handleMotionPreference = (event) => {
    if (!event.matches) return;
    pending.forEach(reveal);
    pending.clear();
    observer.disconnect();
  };

  motionPreference.addEventListener("change", handleMotionPreference);
  elements.forEach((element) => observer.observe(element));

  return () => {
    motionPreference.removeEventListener("change", handleMotionPreference);
    pending.forEach(reveal);
    pending.clear();
    observer.disconnect();
  };
}
