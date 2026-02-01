import type { PersonType } from "@/utils/types/person";
import "./biography-container.scss";
import { useState } from "react";

export default function BiographyContainer({
  personDetails,
  className,
}: {
  personDetails: PersonType;
  className: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const overviewPreviewLength = 180;
  const shouldShowReadMore =
    personDetails.biography.length > overviewPreviewLength && !isExpanded;

  return (
    <section className={`biography ${className}`}>
      <p className={isExpanded ? "overview-expanded" : "overview-preview"}>
        {isExpanded || className === "biography-desktop"
          ? personDetails.biography
          : shouldShowReadMore
            ? `${personDetails.biography.substring(0, overviewPreviewLength)}...`
            : personDetails.biography}
      </p>

      {shouldShowReadMore && className !== "biography-desktop" && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(true)}
          aria-expanded={isExpanded}
        >
          Voir plus
        </button>
      )}

      {isExpanded && personDetails.biography.length > overviewPreviewLength && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(false)}
          aria-expanded={isExpanded}
        >
          Voir moins
        </button>
      )}
    </section>
  );
}
