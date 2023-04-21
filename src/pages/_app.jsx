import { MDXProvider } from "@mdx-js/react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";

import { Link } from "@/components/Link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import "@/styles/tailwind.css";
import "focus-visible";

function usePrevious(value) {
  let ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function App({ Component, pageProps, router }) {
  const components = {
    a: Link,
    img: ({ src, height = 800, width = 1200, alt }) => (
      <Image src={src} height={height} width={width} alt={alt} />
    ),
  };

  let previousPathname = usePrevious(router.pathname);

  return (
    <MDXProvider components={components}>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative">
        <Header />
        <main>
          <Component previousPathname={previousPathname} {...pageProps} />
          <Analytics />
        </main>
        <Footer />
      </div>
    </MDXProvider>
  );
}
