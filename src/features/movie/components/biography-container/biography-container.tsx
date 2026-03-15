import "./biography-container.scss";
import { useState } from "react";
import type { PersonType } from "@/features/movie/types/person";

export default function BiographyContainer({
  personDetails,
  personDetailsUS,
}: {
  personDetails: PersonType;
  personDetailsUS: PersonType;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const biography =
    personDetails.biography !== ""
      ? personDetails.biography
      : personDetailsUS.biography;

  const overviewPreviewLength = 180;
  const shouldShowReadMore =
    biography.length > overviewPreviewLength && !isExpanded;

  if (biography.length === 0)
    return (
      <section className="biography">
        <p className="overview-preview">Aucune biographie disponible.</p>
      </section>
    );

  return (
    <section className="biography">
      <p className={isExpanded ? "overview-expanded" : "overview-preview"}>
        {biography}
      </p>

      {shouldShowReadMore && (
        <button
          className="read-more-btn underline-link"
          onClick={() => setIsExpanded(true)}
          aria-expanded={isExpanded}
        >
          Voir plus
        </button>
      )}

      {isExpanded && biography.length > overviewPreviewLength && (
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
