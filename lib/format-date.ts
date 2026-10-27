const longDateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

/** Long date in UTC, so a `YYYY-MM-DD` value stays on that calendar day. */
export function formatLongDate(date: string): string {
  return longDateFormat.format(new Date(`${date}T00:00:00Z`));
}
