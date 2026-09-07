---
name: scroll-reveal-motion
description: Implement and tune polished, accessible reveal-on-scroll animations for web frontends. Use when a user asks for scroll reveal, reveal on scroll, fade-up motion, staggered viewport entrances, an AutoManus-like scrolling effect, or below-the-fold sections and cards that appear on entry in React, Next.js, or vanilla HTML/CSS/JavaScript.
---

# Scroll Reveal Motion

Add restrained viewport-entry motion that improves hierarchy without hiding content, hijacking scroll, or harming motion-sensitive users.

## Workflow

1. Inspect the frontend stack, rendering model, existing animation dependencies, and current motion language.
2. Reuse Motion, Framer Motion, GSAP, or another established project dependency when already present.
3. Otherwise select the bundled React or Vanilla implementation below; do not add a large dependency solely for this effect.
4. Apply reveals only to meaningful below-the-fold groups such as section introductions, feature cards, process steps, and final calls to action.
5. Match the project structure and styling conventions while preserving the stable motion contract.
6. Run lint, typecheck, tests, and the production build, then verify scrolling and reduced-motion behavior in a browser when available.

## Implementation Selection

- For React or Next.js, read and adapt `assets/react/scroll-reveal.tsx` with `assets/scroll-reveal.css`.
- For vanilla HTML/CSS/JavaScript, read and adapt `assets/vanilla/scroll-reveal.js` with `assets/scroll-reveal.css`.
- For another framework without an animation dependency, adapt the Vanilla controller to that framework's mount and cleanup lifecycle instead of inventing a new motion model.
- When the project already has an animation library, reproduce the Motion Specification and Accessibility requirements with its native primitives rather than copying the bundled controller.

Copy only the relevant controller into the target project and merge the shared CSS with its global styles. Match aliases, formatting, naming, and component conventions rather than forcing the template's structure.

## Stable Motion Contract

Preserve these attributes across implementations unless the target project already has an equivalent convention:

- Use `data-scroll-reveal="single"` for one container and `data-scroll-reveal="stagger"` for a direct-child group.
- Add `data-reveal-ready="true"` only after client code initializes; content must remain visible without it.
- Add `data-reveal-visible="true"` once the element intersects and keep it visible.
- Use `--reveal-delay` for an intentional per-group delay.
- Allow product-level tuning through `--reveal-distance`, `--reveal-duration`, `--reveal-fade-duration`, `--reveal-stagger`, and `--reveal-ease`.

Do not rename this contract casually. Update both implementations, the shared CSS, and validation together when a target project genuinely requires a change.

## Motion Specification

Use these defaults and adjust them to the product's existing visual language:

- Animate `opacity: 0 → 1` and `translateY(20–24px) → 0`.
- Use 520–560ms for the transform and a shorter 440–480ms for the opacity, so copy is readable before the element finishes settling.
- Use `cubic-bezier(0.22, 1, 0.36, 1)` or the framework's equivalent decelerating ease.
- Trigger once at roughly 15–20% intersection with a small negative bottom root margin.
- Stagger groups by 70–100ms per item and cap the obvious sequence at four items.
- Animate only `opacity` and `transform`; avoid layout properties, scroll-jacking, and large parallax distances.

Keep hero copy immediately readable unless the user explicitly requests an entrance animation. Avoid animating every paragraph or interactive control.

## Accessibility and Resilience

- Honor `prefers-reduced-motion: reduce` and render the final state immediately, including when the preference changes while content is waiting to reveal.
- Keep server-rendered and no-JavaScript content visible. Enable the hidden initial state only after client code initializes.
- Preserve DOM order, focus order, semantics, native layout behavior, and pointer behavior.
- Never delay access to essential instructions, form errors, consent controls, or safety information.
- Reveal immediately when Intersection Observer is unavailable.
- Disconnect observers after one-time reveals and during component or page cleanup.

## Reduced-Motion Rest State

A reveal usually sits inside a composition that also moves: looping ambient effects, mock interfaces that play through a sequence, progress bars, carets, and pulses. Stopping those animations is not enough, because most of them are authored from an empty first frame and freeze into a half-drawn scene.

Under `prefers-reduced-motion: reduce`, compose a deliberate resting frame for the whole group:

- Inventory every animated element inside and around the revealed section, not only the reveal itself.
- Set each one to its completed frame: bars filled to their target width, checkboxes checked, badges and toasts present, indicators lit, transformed elements at their final scale or position.
- Silence decorative loops with `animation: none`, and leave elements that only signal activity, such as carets and pulses, visible and still.
- Express the resting frame in CSS beside the reveal styles rather than in JavaScript, so a preference change applies without re-running client code.

Read the result as a static screenshot and confirm it looks finished rather than mid-sequence.

## Validation

- Confirm content is visible in server-rendered HTML before reveal initialization.
- Confirm each element reveals only once and does not flash from visible to hidden on hydration.
- Confirm initial and live changes to reduced-motion preference show the final state without transition.
- Confirm the reduced-motion view rests in a finished scene, with no empty progress bars, unchecked states, missing badges, or elements stalled mid-sequence.
- Check 375px and desktop widths for overflow, clipping, and unintended wrapper layout.
- Check that staggered children remain semantic, focusable, and clickable.
- Confirm unmounting or cleanup disconnects the observer.
- Run the target project's lint, typecheck, tests, and production build.

Describe the result as a common scroll-reveal, reveal-on-scroll, or fade-up pattern. Do not claim affiliation with, endorsement by, or ownership of any reference website's implementation.
