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
- Footnote markers are raised but not shrunk. Allow them as the one exception only if full-size markers prove visually wrong.
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

## Components and tokens

- Prefer React components for genuine repeated patterns.
- Do not create abstractions before a pattern has appeared more than once.
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
