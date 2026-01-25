import { useRef, type ReactNode } from "react";
import "./horizontal-scroller.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalScroller({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollerRef.current) return;

    const { clientWidth } = scrollerRef.current;
    scrollerRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className={`horizontal-wrapper ${className}`}>
      <button
        className="scroll-btn left"
        onClick={() => scroll("left")}
        aria-label="Dérouler à gauche"
      >
        <ChevronLeft />
      </button>

      <ul className="horizontal-scroll" ref={scrollerRef}>
        {children}
      </ul>

      <button
        className="scroll-btn right"
        onClick={() => scroll("right")}
        aria-label="Dérouler à droite"
      >
        <ChevronRight />
      </button>
    </section>
  );
}
