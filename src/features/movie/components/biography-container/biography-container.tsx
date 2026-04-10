import "./biography-container.scss";
import { useToggle } from "@/utils/use-toggle";
import type { PersonType } from "@/features/movie/types/person";

export default function BiographyContainer({
  personDetails,
  personDetailsUS,
}: {
  personDetails: PersonType;
  personDetailsUS: PersonType;
}) {
  const {
    value: isExpanded,
    setTrue: expand,
    setFalse: collapse,
  } = useToggle();

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
          onClick={expand}
          aria-expanded={isExpanded}
        >
          Voir plus
        </button>
      )}

      {isExpanded && biography.length > overviewPreviewLength && (
        <button
          className="read-more-btn underline-link"
          onClick={collapse}
          aria-expanded={isExpanded}
        >
          Voir moins
        </button>
      )}
    </section>
  );
}
