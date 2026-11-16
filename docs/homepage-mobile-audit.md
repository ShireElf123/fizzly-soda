# Homepage responsive audit

Date: 2026-11-16. Scope: homepage and its navigation, intro, hero, flavour explorer, pack builder and demo cart. The visual design and existing hero animation were retained.

## Findings and targeted fixes

1. **Page wider than phone viewport.** In Chromium at 320px the document was 700px wide. The explorer's decorative fruit image rendered at its intrinsic width outside its mobile container; the rotated ticker also bled past the document edge. The fruit is now contained within its existing background element, the explorer clips only decorative overflow while still growing with its content, and the main region contains the ticker bleed. The same viewport now reports 320px. The opening screen was checked in both animation phases and stays within the screen; it was not redesigned.
2. **Contrast and cart name.** Automated checks found three low-contrast secondary text treatments and the cart's visual count missing from its accessible name. Secondary opacity was slightly increased and the cart label now includes its current count.
3. **Background work.** Hero visuals remain animated by default. When the hero leaves the screen or the tab is hidden, its ambient fruit/bubble animations pause and resume when visible; the existing Pause motion control and reduced-motion support remain available.

## Checks performed

- Real headless Chromium 153 with the site's GSAP 3.12.5, Nunito and Titan One fonts, and locally served production files. Device sizes in CSS pixels: 320×568, 360×800, 390×844, 430×932, 667×375, 768×1024, 820×800, 821×800, 900×800, 1024×768 and 1440×900. Checked intro bounds, page width, navigation fit and uncropped hero can after the entrance animation.
- On mobile, selected all six explorer flavours and verified their loaded cans fit within the explorer; exercised menu, six-pack builder, cart, focus restoration, checkout validation and reload persistence. On desktop verified the pinned explorer still switches flavour while scrolling.
- Confirmed hero motion pause/resume and automatic offscreen suspension, reduced-motion mode, responsive splash selection at 2× device scale, and usable cart with GSAP CDN blocked. With JavaScript disabled the notice appears and the intro does not obscure the page.
- axe-core automated checks with WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags: no reported violations on the tested mobile homepage, filled cart, or demo checkout after fixes. Automated checks do not establish WCAG conformance.
- `node tests/homepage.cjs` checks the interaction logic in jsdom. `tests/browser-audit.cjs` is a repeatable Chromium layout and interaction regression suite.

## Remaining checks before launch

Real Android Chrome and iOS Safari, desktop browser diversity, actual 200% text scaling and 400% browser zoom, keyboard-only and TalkBack/VoiceOver journeys, plus measured slow-network/Lighthouse performance still need testing. No production payment, inventory or signup backend exists. Lighthouse/Core Web Vitals scores and complete accessibility conformance have not been measured or claimed.

## References

- W3C, [Understanding Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html): vertical content should reflow at a width equivalent to 320 CSS pixels without requiring horizontal scrolling, subject to the standard's exceptions.
- W3C, [WCAG 2.2](https://www.w3.org/TR/WCAG22/): relevant guidance includes contrast, focus, target size and controls for qualifying moving content.
