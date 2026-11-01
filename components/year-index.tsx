import { IndexEntry } from "@/components/index-entry";
import { IndexSection } from "@/components/index-section";

type DatedEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

type YearIndexProps<T extends DatedEntry> = {
  items: T[];
  href: (item: T) => string;
};

export function YearIndex<T extends DatedEntry>({
  items,
  href,
}: YearIndexProps<T>) {
  const years = groupByYear(items);

  return (
    <div className="mt-16 md:mt-24">
      {years.map(({ year, items: inYear }) => (
        <IndexSection key={year}>
          <h2 className="font-sans text-[1rem] font-medium tracking-[0.14em] text-slate-600 uppercase">
            {year}
          </h2>
          <ul className="mt-7 space-y-10 md:space-y-12">
            {inYear.map((item) => (
              <IndexEntry
                key={item.slug}
                href={href(item)}
                title={item.title}
                description={item.description}
                date={item.date}
              />
            ))}
          </ul>
        </IndexSection>
      ))}
    </div>
  );
}

function groupByYear<T extends DatedEntry>(items: T[]) {
  const years: { year: string; items: T[] }[] = [];

  for (const item of items) {
    const year = item.date.slice(0, 4);
    const group = years.find((entry) => entry.year === year);
    if (group) {
      group.items.push(item);
      continue;
    }
    years.push({ year, items: [item] });
  }

  return years;
}
