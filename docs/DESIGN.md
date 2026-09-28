# Design

## Direction

mirhamasala.com should feel like a contemporary independent publication:
editorial, restrained, typographic, warm, and design-forward.

It should not feel like:

- a generic blog template
- a SaaS product
- a component-library demo
- a lifestyle-influencer site

Typography, proportion, whitespace, rhythm, and composition should do most of the visual work.

### Visual character

The visual language takes cues from contemporary editorial and independent
magazine design rather than conventional web-product design.

Favor:

- strong contrast in typographic scale
- oversized serif display type used as composition
- restrained italic serif for expressive emphasis
- fine rules where structural separation is useful
- asymmetric editorial layouts where appropriate
- generous negative space
- small amounts of deliberately placed photography
- quiet sans-serif metadata and navigation
- predominantly flat surfaces without artificial depth

The site should feel art-directed and typeset rather than assembled from UI
components.

These are directional qualities, not requirements that every page reproduce
the same composition.

## Typography

- Instrument Serif is the display / expressive serif.
- Newsreader is the editorial / body serif.
- Instrument Sans is used for navigation, metadata, labels, and interface text.
- Avoid using Instrument Serif at sizes where it becomes cramped or loses legibility.
- Serif is for expression and editorial voice; sans serif is for information and interface.

Exact type sizes, line heights, and responsive scales live in the implementation, not in this document.

### Minimum text size

- No rendered text may be smaller than **1rem (16px at the browser default) on any viewport**, including mobile.
- Set font sizes in `rem`, never `px`, so text scales with the reader's browser font-size setting.
- Tailwind's `text-xs` and `text-sm` are below 1rem and are not used for text.
- Override any default styles that set text below 1rem, including those from the typography plugin (code, captions, tables, footnotes).
- Do not create hierarchy by shrinking metadata or labels below 1rem. Body text sits well above 1rem, so 1rem is already a clear step down.
- Show that text matters less through typeface (sans serif next to serif), a lighter Slate shade that stays comfortably readable, letter-spacing or uppercase for labels, and spacing and position.
- Superscript characters may use normal typographic superscript positioning provided they remain legible.
- Code blocks and tables that overflow on small screens scroll horizontally rather than shrinking.

## Color

- The site is light-only for now. There is no dark mode.
- Use Tailwind's Slate family as the neutral foundation.
- Prefer existing Tailwind values over inventing custom neutral colors.
- The overall atmosphere should feel subdued and slightly coastal rather than stark black-and-white.
- Use at most one restrained accent unless the design later proves a second one is necessary.
- Avoid bright teal and overly saturated color.
- Do not create custom color tokens merely to rename Tailwind values.

Exact shades live in the implementation.

## Layout

- Favor generous whitespace and clear editorial rhythm.
- Use a small number of consistent layout widths rather than page-specific arbitrary widths.
- Reading width should remain comfortable for long-form text.
- Wider layouts may be used deliberately for imagery or editorial composition.
- Mobile is a first-class layout, not a compressed desktop version.

Exact widths and spacing values live in the implementation.

## Spacing

- Use Tailwind's spacing scale directly where practical.
- Do not create semantic spacing tokens just to alias Tailwind values.
- Establish hierarchy through spacing and composition rather than excessive borders, cards, or separators.
- Prefer fewer, stronger spacing relationships over many small arbitrary adjustments.

## Navigation and UI

- Navigation should remain visually quiet and subordinate to the editorial content.
- Normal navigation links should look like links, not pill buttons.
- Buttons should be used for real actions, not as decoration.
- Avoid excessive UI chrome: pills, badges, shadows, bordered cards, and decorative controls.
- Interactive states should be clear but restrained.

## Styling

- Tailwind CSS is the primary styling system.
- Prefer Tailwind utilities in JSX over page-specific CSS.
- Prefer Tailwind's built-in values before using arbitrary values such as
  `mt-[37px]` or `text-[22px]`.
- Arbitrary values are acceptable when deliberate visual refinement requires
  them, but should not become the default way of styling the site.
- Do not introduce CSS abstractions merely to replace groups of Tailwind
  utilities.

## Components and tokens

- Prefer React components for genuine UI concepts and repeated patterns.
- Extract components when they have a clear responsibility or when repetition
  demonstrates that an abstraction is useful.
- Do not extract components solely to reduce the number of lines in a page.
- Use Tailwind values directly wherever practical.
- Create a custom design token only when it represents a meaningful site-wide design decision that Tailwind does not already express well.
- Do not build a generic design system or component library for its own sake.

## Imagery

- Images should be used deliberately, not as mandatory decoration for every article or list item.
- Do not force every post into a thumbnail/card system.
- Article imagery should support the reading experience rather than dominate it.
- Exact image treatment remains a design decision to be established against real content.

## Responsive design

- Maintain strong hierarchy and whitespace on small screens.
- Do not solve mobile by shrinking everything.
- The 1rem minimum text-size rule applies at every breakpoint.
- Responsive changes should preserve the editorial character of the page.

## Accessibility

- Use semantic HTML before adding ARIA.
- All interactive elements must be keyboard accessible.
- Focus states must remain clearly visible.
- Maintain WCAG AA contrast for text and interactive elements.
- Do not rely on color alone to communicate meaning or interaction.
- Respect `prefers-reduced-motion`.
- Decorative motion must never be required to understand or navigate content.

## About page

The About page is the first page used to establish the site's visual language.

It should set the direction for:

- typography
- navigation
- layout rhythm
- spacing
- imagery
- responsive behavior
- links and interaction states
- overall visual tone

Once patterns are proven on the About page, reuse only the ones that genuinely belong to the wider site.
