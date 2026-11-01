# Recipe style

How to write a recipe. The file format and frontmatter schema are in `docs/ARCHITECTURE.md`. Typography, contrast, and layout are in `docs/DESIGN.md`. The publication voice is in `docs/PRODUCT.md`.

## Measurements

Recipes are metric. Write the quantity the kitchen will use. Do not add a second system beside it.

| Measurement         | Write     | Example                     |
| ------------------- | --------- | --------------------------- |
| Weight              | `g`, `kg` | 200 g, 1 kg                 |
| Volume              | `ml`, `l` | 175 ml, 1 l                 |
| Length              | `cm`      | 20 cm                       |
| Temperature         | `°C`      | 165 °C                      |
| Teaspoons           | `tsp`     | 1 tsp, ½ tsp                |
| Tablespoons         | `tbsp`    | 1 tbsp, 2 tbsp              |
| Counted ingredients | a numeral | 4 eggs, 1 lemon wheel       |
| A duration in prose | words     | 5 minutes, 45 to 55 minutes |

- Prefer grams for dry ingredients, especially flour and other baking ingredients where precision matters.
- Prefer millilitres for liquids. Keep a volume that is already the recipe's quantity.
- Teaspoons and tablespoons are for small amounts, and for cases where a spoon is the practical measure. When a reliable weight exists for a precision-sensitive ingredient, use grams.
- Counted ingredients are numerals: `4`.
- A partial spoon uses a fraction character: `½ tsp`.
- Put a non-breaking space (U+00A0) between the number and the unit. The examples in this table use that space. Do not write `&nbsp;`. Raw HTML in a recipe is not rendered.
- Do not put a full stop after an abbreviation.
- Use the same abbreviation in the ingredient list and the method.
- Do not use cups, ounces, pounds, or Fahrenheit.
- If a quantity cannot be converted to metric with confidence, leave it and flag it.

A duration in the method stays a phrase: `45 to 55 minutes`, `30 seconds`.
Frontmatter durations are stored in minutes and formatted for readers by the page.

## Ingredients

An ingredient list is a two-column Markdown table. The first cell is the quantity. The second is the ingredient. Keep the header row `Amount` and `Ingredient`.

The quantity is only the amount: `200 g`, `½ tsp`, `4`, `1`.

Preparation that belongs to the ingredient stays in the name: `medium bananas, very ripe, mashed`.

A short qualifier stays in the name, in parentheses:

- `honey (or less)`
- `vanilla powder (or extract)`
- `Greek yogurt (10% fat)`
- `honey (opt for raw, if available)`
- `almond flour, extra fine (plus extra to flour the pan)`

A longer aside is its own sentence, in italics, after the name. Use Markdown emphasis. Reserve it for a preference, a brand, or a practical remark that would clutter the name, as with the kettle note on the hot water and the Zacapa note on the rum in Rum Hot Toddy.

Do not give every ingredient an italic note.

When one row hides a second quantity, split it. The number in the first column is the number the cook uses.

Unclear: `3` medium bananas, very ripe, mashed (plus one extra for garnish, sliced in half).

Clear:

- `3` medium bananas, very ripe, mashed
- `1` banana, halved lengthwise, for garnish

A garnish or a second use that is its own amount gets its own row. A substitution of only a few words stays inline.

## Structure

`docs/ARCHITECTURE.md` defines the fields. Fill them as follows.

- `title` is the name of the dish.
- `description` is a sentence or two in the recipe's own voice. It sits under the title.
- `category` is one of Breakfast, Mains, Soups, Sides, Bakes, Desserts, Drinks, Kitchen Basics, or Home & Body.
- `serves`, when the recipe actually states a count, is a numeral: `1`, `4`.
- `attribution` is an optional string containing the source credit, with inline
  Markdown for a source link. See "Attribution" below.
- Timing fields are optional; see "Timing" below.
- `draft: true` keeps a recipe unpublished. Remove it or set it to `false` to
  publish the recipe. Drafts are absent from the index, recipe pages, and sitemap,
  including on localhost.

Leave `serves` and timing fields out when the recipe does not state them. A
recipe that states neither has no serving or time line. Do not estimate missing
values to fill the header.

## Timing

Use minutes in YAML, without quotes or units. The page turns `90` into
`1 hour 30 minutes`. Do not write hours, duration strings, or ISO durations in
these fields.

| Field       | Meaning                                                |
| ----------- | ------------------------------------------------------ |
| `prepTime`  | Preparation before cooking                             |
| `cookTime`  | Cooking or baking                                      |
| `restTime`  | Resting, rising, cooling, or standing                  |
| `chillTime` | Chilling in the fridge                                 |
| `soakTime`  | Soaking                                                |
| `totalTime` | The recipe's stated overall time                       |
| `timeNote`  | A short qualification, such as "Chilling is optional." |

Only add fields that help with this recipe. Numbers are non-negative whole
minutes; omit an unknown duration rather than using `0` as a placeholder.
Use `0` only when the recipe explicitly needs to say a stage takes no time.

For a range, use `min` and `max`, both in minutes. For overnight waiting,
`restTime`, `chillTime`, and `soakTime` also accept the literal `overnight`.
Do not turn overnight into a guessed number of hours.

```yaml
prepTime: 20
cookTime:
  min: 240
  max: 300
chillTime: overnight
timeNote: Ideally salt the pork the night before cooking.
```

`totalTime` is optional and explicitly authored. Do not add up stages to create
a total: resting, cooking, and preparation can overlap. When the stated total
excludes an overnight wait, record that wait separately and explain it in
`timeNote`. A cooking-time range does not require a total. Banana Bread has
`cookTime: { min: 45, max: 55 }` and `restTime: 30`, with no invented total.

Move standalone summaries such as "Prep: 15 minutes. Cook: 30 minutes." out of
the body and into these fields. Keep step-specific instructions such as "Bake
for 45 to 55 minutes" in the method: cooks need those times beside the action.
Timing for an alternative method stays with that method, such as the chicken
stew's stovetop, oven, and slow-cooker options.

The cooking details sit after the preface's rule, immediately before Ingredients.
They list servings, then prep, cook, rest, chill, soak, and total time, showing
only the values present. Each is a separate label–value pair: a row that can
wrap on desktop, and aligned rows on mobile. `timeNote` follows directly below.

## Attribution

Store the credit as one optional YAML string. It supports self-contained inline
Markdown links. Do not wrap the whole string in emphasis or repeat it in the body.
The renderer controls its presentation and placement; the wording can vary.

```yaml
attribution: >-
  Adapted from [Recipe name](https://example.com/recipe) by Author.
```

Keep the source name and link when known, and preserve distinctions such as
"Adapted from", "From", or "Recipe attributed to". Omit the field when no source
is recorded. A dedication stays in the introduction. An explanation of an
earlier version belongs in the notes; its source credit belongs in `attribution`.

The credit renders as quiet, regular sans-serif text at 1rem, with an underlined
source link, after the introduction and before the divider. Without an
introduction, the credit is the first paragraph beneath the description.

## Body order

The body runs in this order:

1. An optional introduction: why this recipe is here, in the author's voice.
2. One horizontal rule, if the recipe has an introduction or an `attribution`.
   The YAML credit is inserted immediately before this rule by the renderer.
   Without an introduction, the body starts with the rule.
3. Exactly one `## Ingredients` section.
4. `Method`. Number the steps when the method is a sequence. A single action can stay one paragraph, as in Honey Butter Milk.
5. Optional notes, variations, or substitutions.

Example:

```markdown
An optional personal introduction.

---

## Ingredients

The ingredient table.
```

An introduction or attribution is followed by one horizontal rule, then the
cooking details and ingredients. When both exist, the attribution follows
the introduction and precedes that rule. The rule marks the shift from the
preface to the cooking.
A recipe with neither an introduction nor an attribution has no rule. Do not
add rules anywhere else.

The reading order on the page is the title, description, introduction when
present, attribution when present, rule when a preface exists, serving and
timing details when present, ingredients, method, and any notes or variations.
Keep the description and introduction together with about 1.25rem between
them, the credit about 1rem after the introduction, and about 2rem around the
transition to cooking. A recipe without a preface uses whitespace before its
cooking details rather than an empty preface or extra rule.

## Voice

Keep the writing personal and specific. The details worth keeping are the ones this kitchen actually cares about: raw honey, grass-fed butter, a named rum, a fat percentage, a kettle set to a particular temperature.

Leave humour, anecdotes, and preferences in place. Change a sentence for clarity, consistency, grammar, or readability. Do not sand the recipes into one neutral food-blog voice.

Good:

- `raw honey`
- `I like Zacapa No. 23. The better the quality of the rum, the better the drink.`
- `Pretty much the only cake we make once in a while.`

Bad:

- `honey, to taste (optional)` where the recipe means `raw honey` or `honey (or less)`
- one row that hides a second banana inside the first
- `200 grams`, `1 teaspoon`, `1 cup`, or `350°F`
- `8 servings · 1 hour` on Banana Bread, which states neither a yield nor a total time
