const postSlugs = [
  "30-days-photography",
  "photographer-month",
  "30-days-traveling",
  "surfer-month",
  "30-days-surfing",
  "meditator-month",
  "snowboarder-month",
  "reading-habits",
  "reading-time",
  "read-business-books",
  "reading-tips",
  "reader-month",
  "bucket-list",
  "surviving-web-designers-developers",
  "finding-web-design-development-company",
  "customized-website",
  "start-blogging",
  "entrepreneur-month",
  "salsa-dancing-havana",
  "casa-son",
  "salsa-classes-havana",
  "cuban-style-salsa-lessons",
  "about-dancing-salsa",
  "dancer-month",
  "arjen-calter-feedback",
  "philanthropist-month",
  "10-reasons-why-every-girl-should-learn-to-kiteboard",
  "5-things-nobody-tells-you-about-kiteboarding",
  "kiteboarding-playa-del-carmen",
  "find-best-kiteboard-school",
  "kiteboarder-month",
  "memory-bytes",
  "artist-month",
  "polyglot-month",
  "about",
];

const pageSlugs = ["resources", "contact", "aboutme", "now", "faqs"];

export default function TSOP() {
  return (
    <div className="text-white">
      <h2>Posts</h2>
      {postSlugs.map((slug) => {
        return (
          <a className="block" key={slug} href={`tsop/posts/${slug}`}>
            {slug}
          </a>
        );
      })}
      <br />
      <br />
      <h2>Pages</h2>
      {pageSlugs.map((slug) => {
        return (
          <a className="block" key={slug} href={`tsop/${slug}`}>
            {slug}
          </a>
        );
      })}
    </div>
  );
}
