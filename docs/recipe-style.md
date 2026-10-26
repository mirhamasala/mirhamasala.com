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

`time` in the frontmatter is a short phrase, such as `5 minutes`. A duration in the method stays a phrase too: `45 to 55 minutes`, `30 seconds`.

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
- `serves`, when the recipe actually states a count, is a numeral: `1`, `4`.
- `time`, when the recipe actually states one, is a short phrase: `5 minutes`.

Leave `serves` and `time` out when the recipe does not state them. A recipe that states neither has no serving or time line. Rum Hot Toddy states both. Banana Bread's bake stays in the method as `45 to 55 minutes`, because the recipe never gives a single total for the metadata line.

The body runs in this order:

1. An optional introduction: why this recipe is here, in the author's voice. An adaptation credit can sit with the introduction or after the method.
2. `Ingredients`.
3. `Method`. Number the steps when the method is a sequence. A single action can stay one paragraph, as in Honey Butter Milk.

An introduction is followed by one horizontal rule, then the ingredients. The rule marks the shift from the story to the cooking. A recipe with no introduction has no rule. Do not add rules anywhere else.

The reading order on the page is the title, the description, the serving and time line when those exist, the introduction, the rule, the ingredients, and the method.

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
