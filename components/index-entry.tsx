import Link from "next/link";
import { formatLongDate } from "@/lib/format-date";

type IndexEntryProps = {
  href: string;
  title: string;
  description: string;
  date?: string;
  level?: "h2" | "h3";
};

export function IndexEntry({
  href,
  title,
  description,
  date,
  level = "h3",
}: IndexEntryProps) {
  const Title = level;

  return (
    <li>
      <Link href={href} className="group block w-fit max-w-176 no-underline">
        <Title className="font-display text-[2rem] leading-none tracking-[-0.02em] underline decoration-slate-300 decoration-2 underline-offset-8 group-hover:decoration-slate-950 group-focus-visible:decoration-slate-950 md:text-[2.65rem]">
          {title}
        </Title>
        {date ? (
          <time
            dateTime={date}
            className="mt-3 block text-base/snug text-slate-600"
          >
            {formatLongDate(date)}
          </time>
        ) : null}
        <p className="mt-3 font-serif text-[1.05rem] leading-[1.45] text-slate-600 md:mt-4 md:text-[1.15rem]">
          {description}
        </p>
      </Link>
    </li>
  );
}
