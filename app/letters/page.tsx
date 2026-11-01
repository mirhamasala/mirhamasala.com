import type { Metadata } from "next";
import { archiveCrumbs } from "@/components/breadcrumbs";
import { Page } from "@/components/page";
import { PageHeader } from "@/components/page-header";
import { YearIndex } from "@/components/year-index";
import { getLetters } from "@/lib/letters";

export const metadata: Metadata = {
  title: "Letters",
  description: "Letters I sent between 2018 and 2023, kept here as they were.",
  alternates: { canonical: "/letters" },
};

export default async function LettersPage() {
  const letters = await getLetters();

  return (
    <Page>
      <PageHeader
        breadcrumbs={archiveCrumbs("letters", { current: true })}
        title="Flying paper planes."
        lede="Letters I sent between 2018 and 2023, kept here as they were."
      />

      <YearIndex items={letters} href={(letter) => `/letters/${letter.slug}`} />
    </Page>
  );
}
