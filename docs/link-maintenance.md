# Link maintenance

Leave the words, drop the link, and only rewrite when the sentence needed the
click. Keep maintenance out of the reading: no strikethrough and no “used to be
a link” notes. A publication date gives historical context; it does not turn
every old recommendation into current advice.

## Editorial decisions

Treat each link by the job it does in the passage, even when the surrounding
piece belongs to the archive.

- **The same material moved:** replace the URL and leave the sentence. Confirm
  that the replacement contains the intended material, rather than a generic
  homepage or an unrelated business now using the domain.
- **The sentence names the thing:** unlink it and retain the words. This is the
  usual repair in Writing, Letters, Travel Stories, and The Spin-Off Project.
- **The words depend on the click:** change “here,” “this article,” or a similar
  pointer to name its subject, or cut that clause. Keep the edit local; preserve
  the piece's historical perspective.
- **The link provides attribution or evidence:** seek a replacement or useful
  archived copy first. Keep the author, title, and source credit even if the
  link must go. Preserve recipe distinctions such as “Adapted from.”
- **A reader might act on the recommendation:** update practical notes when a
  place has closed or an offering has disappeared. A brief “Closed.” can help;
  a note about a broken URL cannot. Verify the closure independently of the
  website's availability.
- **The specific page matters:** link a checked Internet Archive copy when it
  still serves the reader, especially for an article or tutorial. Usually skip
  archived shops, product pages, and social posts unless the snapshot itself
  has a concrete editorial purpose.

For internal links, use the current destination in the content. Preserve an old
public URL with a permanent redirect when equivalent content exists. If there
is no equivalent, unlink or rewrite the pointer; do not redirect indiscriminately
to home or leave a published link to a 404. Some unlinked historical URLs may
intentionally remain 404s under the migration policy.

## Automated checks

Internal links and anchors are checked against the built site by
`pnpm test:seo` and `pnpm test:e2e`. The Verify workflow runs the latter on pull
requests. The **Site verification** check must also be required in GitHub's
`main` branch protection to prevent a failing merge. The settings inspected on
2026-11-01 had no required status checks; the workflow alone is not enforcement.

External links are checked separately by `.github/workflows/external-links.yml`
on Mondays at 08:23 UTC, with a manual Actions run available on the default
branch. The workflow becomes active after it is merged into that branch. It logs
individual results as they arrive and allows 45 minutes for the complete scan;
the initial scan took about 22 minutes with retries and host backoff.
External availability is never part of a build or pull-request gate.

The audit covers published Markdown links and images, including reference
links, plus recipe `attribution`, book/place `url`, place `map`, and Travel Story
`instagram` frontmatter. Draft files are excluded. It does not crawl linked
websites, scan links hard-coded in application components, or validate external
fragments. Both production hostnames are left to the internal checks.

Lychee checks each unique resource with limited concurrency and retries. There
is no persistent response cache: every weekly report uses a fresh scan. It does
not treat 403 or 429 responses as success or silently exclude difficult services.
Lychee's built-in exclusions (including Twitter), and reserved/private destinations
excluded by the checker, remain visible as “Not checked.” The report separates:

- Likely missing pages: 404 and 410 responses.
- Blocked or rate-limited requests: 401, 403, 429, and 999 responses.
- Other failures: timeouts, connection/TLS errors, server errors, and other
  responses that need another attempt or inspection.
- Not checked: destinations excluded by Lychee.

The GitHub issue is a current queue, not a historical log. Each complete scan
replaces the generated section, so recovered links disappear. Review notes
outside that section survive; do not write notes inside it. There are no weekly
comments or duplicate issues. A clear queue closes the issue; later findings
reopen the same one. Incomplete scans fail the audit job and leave the previous
issue untouched. The full Markdown report, JSON findings, inventory, and raw
results are retained in the `external-link-report` artifact for 30 days. Large
issues contain an excerpt linking to that artifact.

To run locally, install [Lychee 0.24.2](https://github.com/lycheeverse/lychee/releases/tag/lychee-v0.24.2)
and run:

```sh
pnpm audit:links
```

Set `LYCHEE_BIN` to use a binary outside `PATH`. Reports go to the ignored
`test-results/external-links/` folder. A local run does not write to GitHub or
modify content. URL findings leave the command successful; checker/configuration
failures return an error. `node scripts/external-links.mjs prepare` collects
the inventory without network requests; `node scripts/external-links.mjs report`
regenerates the report from an existing scan.

## Human review

The report is a queue, not a verdict. Open a flagged destination in a browser,
confirm its meaning and availability, and apply the editorial decisions above.
An HTTP 200 does not establish that the original material remains there, and an
access block does not establish that it is gone. Retry temporary failures before
changing copy. Never automate content changes from a response code.

Start with Places, recipes, books, resources, and current Writing. Archive
cleanup can wait. The report groups source locations by area and includes
publication dates where available. Body links have file/line locations;
frontmatter links name the field. The same URL can appear in several areas, but
is requested only once per scan apart from redirects and retries.

## Initial review, 2026-11-01

The first scan collected 1,423 unique URLs: 1,031 passed, 69 returned 404/410,
229 were blocked or rate-limited, 52 had other failures, and 42 were excluded
by Lychee's built-in Twitter rules. These are observations from one run, not
392 confirmed broken links. The saved local report is
`test-results/external-links/report.md`.

A spot-check confirmed the old Anki manual URL in the resources page returns
404; the [current Anki documentation](https://docs.ankiweb.net/) provides a
candidate replacement. The [Cookie and Kate recipe source](https://cookieandkate.com/gluten-free-banana-bread-recipe/)
was accessible with the expected recipe. Google Maps links with 403 responses
remain in the access-block group for browser review. No content was changed
from these findings.
