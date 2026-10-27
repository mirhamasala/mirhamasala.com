# Product

## What mirhamasala.com is

mirhamasala.com is a **one-person publication built around curiosity**.

It is personal, but it is not intended to function primarily as a diary, portfolio, or conventional personal blog. The aim is to make something worth reading in its own right: a place for following ideas, subjects, places, objects, questions, and experiences simply because they are interesting.

The subject matter can move between technology, design, food, travel, family life, books, places, observations, and other interests. That range is intentional.

The coherence comes from the author rather than from a narrow topic. Over time, the reader should come to recognize and trust Mirha's taste, curiosity, and way of looking at things.

The reading experience comes first.

## Editorial principles

- Curiosity is the organizing principle.
- Mixed subject matter is a feature, not a problem to solve with excessive categorization.
- The site should feel authored, selective, and considered rather than optimized for publishing volume.
- Writing should be specific and concrete rather than vague or personal-brand-like.
- The site should make room for following an idea simply because it is interesting.
- Not every piece needs to fit an established theme or content category.

A central idea behind the rebuild is:

> I miss following an idea simply because I'm curious about it.

## Writing

- Writing is the site's main editorial area.
- It is called **Writing** in navigation, headings, and reader-facing copy.
- Its URLs remain `/posts` and `/posts/<slug>`.
- A migrated article keeps its original slug so existing links to `/posts/<slug>` continue to work.
- The Writing index should be primarily typography-led rather than a grid of image cards.
- Articles should prioritize excellent reading typography and minimal surrounding interface.
- Images should be used deliberately; an article does not need an image merely to fit a template.
- Related writing may appear at the end of an article.
- Previous/next navigation should not be added merely because it is conventional on blogs.

## Information architecture

The primary areas currently envisioned are:

- Home
- About
- Writing
- Collections
  - Books
  - Recipes
  - Places
- Archive
  - Letters
  - TSOP
  - Travel Archives

### Home

The home page should introduce the publication's point of view rather than simply act as a reverse-chronological blog index.

The exact composition is still to be designed.

When writing is selected for prominence, use **Featured writing** rather than assuming the newest posts are necessarily the most important.

### About

The About page is a central editorial page, not boilerplate biography.

Its current direction is about rediscovering what to make next, following curiosity again, and creating work that belongs to the author.

It should feel specific and human rather than like a résumé, creator bio, or personal-brand statement.

### Collections

Collections are curated groupings of work rather than necessarily formal categories.

They should feel editorial and intentional.

Books, Recipes, and Places are listed in the footer. Collections is a label for that group, not a page, and these links stay out of the primary navigation.

### Recipes

Recipes is a small, permanent collection at `/recipes`. It contains recipes
the author makes often enough to want to keep and share. The index and
individual recipe pages are typography-led, practical, and free of card-grid
or food-blog chrome. Conventions for writing one are in `docs/recipe-style.md`.

### Books

Books is a collection at `/books`. It keeps quotes, notes, and ideas from
books the author has read, and it is not a complete reading list. The index
groups every book by topic, most recent first, and opens with a short list of
books to start with. Each book is one Markdown file. A recommended book
includes one line on why it stuck, shown under the title on the index.

### Archive

The Archive page at `/archive` lists sections that have returned outside Writing. It starts with Letters. Moving an individual article out of Writing is still a manual editorial decision, never an automatic rule based on age, and that mechanism is not built yet.

Writing shows whatever is currently in Writing.

The Archive should be useful and typography-led rather than presented as a large grid of interchangeable cards.

### Letters

Letters is the archive of letters sent from 2018 to 2023. The URLs are `/letters` and `/letters/<slug>`. The index is a reading list grouped by year, with a title, date, and short description. There is no signup.

## Experience and visual direction

The site should feel like a distinctive publication rather than a blog template or an app: minimalist but not generic, design-forward without being decorative, and warm and human but restrained.

Avoid decorative systems that create ongoing asset requirements for every new article, and visual effects that compete with the writing.

There is a subtle coastal/ocean influence in the current direction, but it should not become literal seaside branding.

Visual principles (typography, color, layout, spacing, UI, and imagery) live in `docs/DESIGN.md`.

## Copy

The voice should be:

- intelligent
- curious
- concrete
- personal without becoming diary-like
- confident without sounding promotional
- specific rather than abstract

Avoid generic creator-site language such as:

- "thoughts on life, design, and everything in between"
- "exploring ideas at the intersection of..."
- inflated mission statements without concrete meaning

## Discoverability

Search visibility should help people discover writing worth reading without shaping the publication around search-engine algorithms. It is a benefit of publishing worthwhile, accessible work, not a separate editorial objective.

- Every public, indexable page has a specific, truthful title and description that accurately represent its content.
- Titles, descriptions, and headings are written for readers, not keyword targets.
- No generic SEO copy, keyword-driven categories, or artificial content sections.
- Article URLs are descriptive and stable.
- Pages and articles link to each other where the connection is natural.
- Existing URLs are preserved wherever possible. When a URL must change, it permanently redirects to its equivalent content.
- Drafts, private previews, and intentionally unpublished content are never publicly discoverable.
- Technical SEO never compromises editorial design, typography, or content structure.

## Authoring

- Articles are plain text files in the repository, written and edited by the author.
- Recipes are also plain text files in the repository.
- Books are also plain text files in the repository.
- Letters are also plain text files in the repository.
- There is no CMS, admin interface, or database.
- An article can be kept as a draft. Drafts are never published.

## The 2026 rebuild

- The site is being rebuilt from scratch.
- The previous implementation is archived in Git and is not the basis for the new product or design.
- Existing material returns selectively, one piece at a time. Not everything needs to return.
- Migrated articles may be adapted to the new content format without preserving their old implementation.
- Recipes returns as a deliberately small collection. Books returns as the notes kept from the reading list. Letters returns as the letters sent from 2018 to 2023, at `/letters`. Other old sections such as Moments, TSOP, Map, travel archives, and résumé have no automatic commitment to return.
- Books, Recipes, Places, or similar collection areas should not automatically become primary navigation items.
- Until content is migrated, some old URLs may return 404. This is accepted.

## Product test

When evaluating a page, component, or feature, ask:

**Does this make mirhamasala.com feel more like a distinctive publication someone would choose to return to, or more like a generic blog or application?**

Prefer the former.

## Not yet decided

- The exact composition of the home page
- Final type scale
- Exact color shades and the accent color
- Whether there is a feed
- Social preview image strategy
- Analytics
- Tags, categories, or other additional ways to browse Writing
- Which remaining legacy sections outside Writing, Recipes, Books, and Letters return, and therefore which of their URLs get redirects (see "URL migration" in `docs/ARCHITECTURE.md`)
