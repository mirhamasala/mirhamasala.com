import type { Metadata } from "next";
import { DisplayTitle } from "@/components/display-title";
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
    <article className="mx-auto max-w-384 overflow-x-clip px-4 pt-7 pb-8 md:px-8 md:pt-10">
      <header>
        <DisplayTitle title={page.title} />

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-8">
          <div className="max-w-176 md:col-span-7 md:col-start-3">
            <time
              dateTime={page.date}
              className="text-base/snug text-slate-950"
            >
              {formatMonthYear(page.date)}
            </time>
            <a
              href="/resume/mirha-masala.pdf"
              download="mirha-masala-resume.pdf"
              className={`${proseLinkClassName} mt-3 block w-fit text-base/snug`}
            >
              Download résumé (PDF)
            </a>
          </div>
        </div>
      </header>

      <div className="mt-10 md:mt-12 md:grid md:grid-cols-12 md:gap-8">
        <div className="max-w-176 md:col-span-7 md:col-start-3 [&_h3+p]:mt-1.5 [&_h3+p]:font-sans [&_h3+p]:text-base/snug [&_h3+p]:text-slate-600 [&_h3+p+p]:mt-1 [&_h3+p+p]:font-sans [&_h3+p+p]:text-base/snug [&_h3+p+p]:text-slate-600 [&_h4]:ml-6 [&_h4+p]:mt-1.5 [&_h4+p]:ml-6 [&_h4+p]:font-sans [&_h4+p]:text-base/snug [&_h4+p]:text-slate-600 [&_h4+p+ul]:ml-6">
          <LetterMarkdownContent source={page.body} />
        </div>
      </div>
    </article>
  );
}
