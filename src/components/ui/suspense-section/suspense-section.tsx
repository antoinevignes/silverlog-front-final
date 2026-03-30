import { Suspense, type ReactNode } from "react";
import Title from "@/components/ui/title/title";

type SuspenseSectionProps = {
  title: string;
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
};

export function SuspenseSection({
  title,
  children,
  fallback,
  className,
}: SuspenseSectionProps) {
  return (
    <section className={className}>
      <Title title={title} className="section-title" />
      <Suspense fallback={fallback}>{children}</Suspense>
    </section>
  );
}
