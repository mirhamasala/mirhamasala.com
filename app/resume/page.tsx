import type { Metadata } from "next";
import { ReadingLayout } from "@/components/reading-layout";
import { formatMonthYear } from "@/lib/format-date";
import { LetterMarkdownContent, proseLinkClassName } from "@/lib/markdown";
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
      <div className="[&_h3+p]:mt-1.5 [&_h3+p]:font-sans [&_h3+p]:text-base/snug [&_h3+p]:text-slate-600 [&_h3+p+p]:mt-1 [&_h3+p+p]:font-sans [&_h3+p+p]:text-base/snug [&_h3+p+p]:text-slate-600 [&_h4]:ml-6 [&_h4+p]:mt-1.5 [&_h4+p]:ml-6 [&_h4+p]:font-sans [&_h4+p]:text-base/snug [&_h4+p]:text-slate-600 [&_h4+p+ul]:ml-6">
        <LetterMarkdownContent source={page.body} />
      </div>
    </ReadingLayout>
  );
}
