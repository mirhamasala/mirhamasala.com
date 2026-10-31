import { getResume } from "@/lib/pages";
import { renderResumePdf } from "@/lib/resume-pdf";

export const dynamic = "force-static";

export async function GET() {
  const page = await getResume();
  const pdf = await renderResumePdf(page);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="mirha-masala-resume.pdf"',
      "Content-Length": String(pdf.length),
    },
  });
}
