import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "Mirha Masala writes about the things she gets unusually interested in: what she learns, what works, what doesn’t, and what’s worth passing on.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <h1>{site.name}</h1>
      <p>[Placeholder: home page not yet designed.]</p>
    </>
  );
}
