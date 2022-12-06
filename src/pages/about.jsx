import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import clsx from "clsx";

import { Container } from "@/components/Container";
import { GitHubIcon, LinkedInIcon } from "@/components/SocialIcons";
import portraitImage from "@/images/portrait.jpg";

function SocialLink({ className, href, children, icon: Icon }) {
  return (
    <li className={clsx(className, "flex")}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  );
}

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  );
}

export default function About() {
  return (
    <>
      <Head>
        <title>About - Mirha Masala</title>
        <meta
          name="description"
          content="I’m Mirha Masala. I live in Portugal, where I surf, write and code."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none">
              <Image
                src={portraitImage}
                alt=""
                sizes="(min-width: 1024px) 32rem, 20rem"
                className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover grayscale filter dark:bg-zinc-800"
              />
            </div>
          </div>
          <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              I’m Mirha Masala. I live in Portugal, where I surf, write and
              code.
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                Ten years ago, I decided I wasn’t going to pursue a career in
                foreign affairs after all. Instead, I went traveling and started
                The Spin-Off Project–a lifestyle experiment that I designed to
                help me discover my interests.
              </p>
              <p>
                The idea was simple. I would pick twelve things that I wanted to
                do or learn and devote a year of my life to doing one each
                month.
              </p>
              <p>
                In between traveling, setting up and dissembling online
                businesses, and learning to blog, a year became five, and it was
                only in 2017 that I checked off the last spin-off.
              </p>
              <p>
                Twelve lifestyles and five years later, I decided to spend the
                next five years writing and becoming a web developer.
              </p>
            </div>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink
                href="https://github.com/mirhamasala"
                icon={GitHubIcon}
                className="mt-4"
              >
                GitHub
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/in/mirhamasala/"
                icon={LinkedInIcon}
                className="mt-4"
              >
                LinkedIn
              </SocialLink>
              <SocialLink
                href="mailto:keepintouch@mirhamasala"
                icon={MailIcon}
                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              >
                keepintouch@mirhamasala.com
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
