import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { PageLede } from "@/components/page-lede";
import { PageTitle, type PageTitleScale } from "@/components/page-title";

type PageHeaderProps = {
  title: string;
  scale?: PageTitleScale;
  lede?: ReactNode;
} & (
  | { eyebrow?: string; breadcrumbs?: never }
  | { breadcrumbs?: Crumb[]; eyebrow?: never }
);

export function PageHeader(props: PageHeaderProps) {
  const { title, scale = "poster", lede } = props;
  const eyebrow = "eyebrow" in props ? props.eyebrow : undefined;
  const breadcrumbs = "breadcrumbs" in props ? props.breadcrumbs : undefined;

  return (
    <Container as="header">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      <PageTitle scale={scale}>{title}</PageTitle>
      {lede ? <PageLede>{lede}</PageLede> : null}
    </Container>
  );
}
