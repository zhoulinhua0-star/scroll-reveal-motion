---
name: hero-text-reveal
description: Implement staggered hero headline entrances on page entry, including Phi Browser-like character fades and optional accent color transitions. Use for opening text reveals or first-screen typography animation; use scroll-reveal-motion for below-the-fold viewport entrances.
---

# Hero Text Reveal

Make a short hero headline appear progressively on page entry while preserving the project's typography, layout, and readable fallback. This skill provides implementation guidance; adapt it to the target frontend rather than introducing a prescribed component library.

## Choose the effect

Inspect the target hero, rendering lifecycle, existing motion dependencies, and requested reference. A screenshot establishes appearance, not timing. Inspect live motion or public CSS when exact reference fidelity matters, and distinguish verified behavior from design choices.

For the Phi Browser reference, read [references/phi-entrance.md](references/phi-entrance.md). Its headline uses staggered character opacity, not a blur or fade-up. Treat its timing as a reference preset, not a requirement for every product.

- Default to opacity-only character fades for short display headlines. Use words or lines when character splitting would damage shaping, wrapping, or reading speed.
- A reference-like starting point is 1,000ms per character, 80ms between characters, and CSS `ease`. Calculate total time as duration + (unit count − 1) × stagger + initial delay.
- For long or translated headlines, shorten stagger or animate larger units. Do not apply the scroll skill's four-item cap to characters, because that collapses the intended wave.
- Keep gradient emphasis optional and separate from the reveal itself. Preserve existing brand colors. Do not introduce the reference site's artwork, fonts, copy, loading overlay, or other page effects solely to reproduce its entrance.

## Implement in the target stack

Reuse the project's animation library if one is already present. Otherwise use CSS keyframes for an initial-render entrance, or the Web Animations API for a client-controlled sequence. Neither requires an additional animation dependency.

Use a dedicated namespace such as `data-hero-reveal`, `data-hero-unit`, `--hero-index`, `--hero-stagger`, and `--hero-duration`. Scope selectors to intentional units; avoid a broad `span` selector that would animate nested formatting twice.

Keep the normal CSS state fully visible. Put any hidden starting state inside a finite animation, using backwards fill during a stagger delay. This makes static HTML readable when animation styles or client code are absent. Do not leave content dependent on a permanent `opacity: 0`, `visibility: hidden`, or an initialization class being removed later.

For React/Next.js, render stable, deterministic text markup on the server and client. Do not rewrite React-owned DOM with a generic splitter. If CSS starts the entrance at first paint, hydration must not restart it. If client initialization happens after text has already been painted, keep that text visible rather than hiding it to play a late entrance. For vanilla markup, use the same visible baseline and avoid destructively flattening nested content.

Trigger once on the intended page entry, without requiring scroll or waiting for `window.load`, background media, or every font to finish loading. Respect the application's route lifecycle; unrelated rerenders, resize, and ordinary scrolling should not replay it. Cancel owned animations and listeners on cleanup while leaving a visible final state.

## Typography and accessibility

- Preserve one semantic heading and an uninterrupted accessible name. If visual character spans fragment assistive reading, use one complete visually hidden text equivalent and mark only the visual duplicate `aria-hidden="true"`; do not duplicate the announcement.
- Split grapheme clusters with `Intl.Segmenter` or an existing equivalent, not `split("")`. When segmentation is unavailable or a script requires contextual shaping, fall back to word/line or whole-heading fades.
- Preserve whitespace and normal word wrapping. Keep Latin words together when needed, but do not make the whole title unbreakable or impose Latin wrapping rules on CJK text. Check ligatures, Arabic joining, combining marks, emoji, and translated text when relevant to the product.
- Do not convert every glyph to an inline block unless its transform requires it. Opacity-only units can preserve more natural inline layout; visually inspect font shaping even then.
- Under `prefers-reduced-motion: reduce`, show all text and final emphasis immediately. A live preference change must finish the sequence, including its accent transition. If JavaScript owns timing, cancel pending callbacks so they cannot restore an intermediate state.
- Keep navigation, essential copy, buttons, focus indicators, and forms usable immediately. Avoid per-character animation on interactive text.

For delayed gradient emphasis, keep a solid readable color as a fallback and scope background clipping to the intended phrase. Apply the final emphasis on actual sequence completion or derived timing; do not copy a fixed timeout that breaks when the text changes. Check the transition for contrast and glyph clipping, including italic overhangs and descenders.

## Combine with scroll reveals

Both skills can be installed independently and applied to one frontend. This skill owns the first-screen headline on page entry; `scroll-reveal-motion` owns meaningful below-the-fold sections when they intersect the viewport.

- Do not put a scroll-reveal wrapper around a hero entrance or apply both controllers to the same element. Nested opacity multiplies, and two transform owners can overwrite each other.
- Keep their attributes and CSS variables separate. Share product-level easing or duration tokens only where the visual language benefits; their triggers and stagger units remain distinct.
- Use the same reduced-motion policy and completed resting composition across both systems. The hero must not depend on Intersection Observer, and scroll sections must not wait for the hero sequence to finish.
- Preserve any established contract of the existing scroll implementation. A request for a hero entrance does not authorize changing unrelated section animations.

## Verify the result

Check page entry and reload, route revisits where applicable, and scrolling into existing reveals. Confirm one intended play, no visible-to-hidden hydration flash, no doubled announcement, and no headline layout shift caused by splitting. Inspect narrow and desktop widths and the longest supported headline.

Check JavaScript disabled, initial and live reduced-motion preference, and interrupted/unmounted animation. All should leave complete readable text, final emphasis, and usable controls. Run the target project's relevant existing checks; report browser verification separately from static validation when a browser is unavailable.
