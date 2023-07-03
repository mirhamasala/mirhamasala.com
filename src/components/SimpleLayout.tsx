import { Container } from "@/components/Container";

type Props = {
  title: string;
  intro: string;
  introExtra?: JSX.Element;
  children: JSX.Element;
};

export function SimpleLayout({ title, intro, introExtra, children }: Props) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {title}
        </h1>
        <p className="my-6 text-base text-zinc-600 dark:text-zinc-400">
          {intro}
        </p>
        {introExtra && <p>introExtra</p>}
      </header>
      <div className="mt-16 sm:mt-20">{children}</div>
    </Container>
  );
}
