# Phi Browser headline reference

Inspected public homepage markup, JavaScript, and CSS on 2026-09-11. The browser automation tool was unavailable, so these are source observations, not a frame-by-frame visual verification. The site may change.

Sources:

- [Homepage](https://phibrowser.com/)
- [Headline CSS](https://phibrowser.com/_next/static/css/3f7c87ea5242d17a.css)
- [Homepage JavaScript](https://phibrowser.com/_next/static/chunks/app/(localized)/%5Blocale%5D/(main)/page-108d43149399b3cd.js)

## Observed behavior

The heading contains character spans. A stagger class sets each span's initial opacity to zero and assigns a one-second `ease` animation ending at opacity one, with forwards fill. Its delay is the character index multiplied by 80ms. The headline keyframes do not animate translation, scale, or blur.

The title's before/accent/after segments use index offsets based on earlier segment lengths. Client readiness switches the text from an invisible class to its animation class. About 1,600ms after readiness, the accent segment removes the stagger class and receives horizontal gradient background clipping and transparent text. Its class list specifies a 1,800ms color transition. The fixed timeout can interrupt that segment's character fades; do not describe this as a purely uninterrupted character wave or assume the gradient itself interpolates smoothly without visual verification.

The background is a separate layer. These observations concern the headline only.

## Portable adaptation

Preserve the recognizable character fade and optional later emphasis, but use visible fallback text, reduced-motion completion, robust text segmentation, and timing derived from the actual text. Avoid copying the reference's initial invisibility or loading gate.

Keep the gradient on the whole accent phrase so it spans the word continuously. Avoid resetting the entire gradient separately on each character. If clipping and nested character opacity render poorly in the target browser, use a word-level accent fade and verify it visually.

For close reference matching, start with the observed one-second/80ms timing and review it with the actual headline. For a shorter product entrance, reduce stagger or increase unit size explicitly as a design adaptation. Do not add upward motion or blur while claiming exact fidelity to the inspected headline animation.
