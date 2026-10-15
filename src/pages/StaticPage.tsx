import { PageShell } from "@/components/layout/PageShell";
import type { RouteMeta } from "@/types";

export interface StaticPageProps {
  meta: RouteMeta;
  title: string;
  intro?: string;
}

export default function StaticPage({ meta, title, intro }: StaticPageProps) {
  return <PageShell meta={meta} title={title} intro={intro} />;
}
