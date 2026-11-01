import type { Metadata } from "next";
import { ReadingLayout } from "@/components/reading-layout";
import { formatMonthYear } from "@/lib/format-date";
import { ResumeMarkdownContent, proseLinkClassName } from "@/lib/markdown";
import { getResume } from "@/lib/pages";
import { assertResumeMarkdown } from "@/lib/resume-pdf";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getResume();

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/resume" },
  };
}

export default async function ResumePage() {
  const page = await getResume();
  assertResumeMarkdown(page.body);

  return (
    <ReadingLayout
      title={page.title}
      metadata={
        <>
          <time dateTime={page.date} className="text-base/snug text-slate-950">
            {formatMonthYear(page.date)}
          </time>
          <a
            href="/resume/mirha-masala.pdf"
            download="mirha-masala-resume.pdf"
            className={`${proseLinkClassName} mt-3 block w-fit text-base/snug`}
          >
            Download résumé (PDF)
          </a>
        </>
      }
    >
      <ResumeMarkdownContent source={page.body} />
    </ReadingLayout>
  );
}
