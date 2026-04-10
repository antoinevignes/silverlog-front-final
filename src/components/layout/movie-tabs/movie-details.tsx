import "./movie-tabs.scss";
import Badge from "@/components/ui/badge";
import { movieDetailsQuery } from "@/queries/movie.queries";
import type { MovieType } from "@/utils/types/movie";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";

const displayCountry = new Intl.DisplayNames(["fr"], {
  type: "region",
});
const displayLanguage = new Intl.DisplayNames(["fr"], { type: "language" });

export default function MovieDetails() {
  const routeApi = getRouteApi("/movies/$movieId/");
  const { movieId } = routeApi.useParams();
  const { data: movie }: { data: MovieType } = useSuspenseQuery(
    movieDetailsQuery(movieId),
  );

  return (
    <ul className="movie-details-tab">
      <li>
        <p className="text-secondary">Pays</p>

        <ul className="list">
          {movie.origin_country.map((country) => (
            <li key={country}>
              <Badge key={country} variant="secondary">
                {displayCountry.of(country)}
              </Badge>
            </li>
          ))}
        </ul>
      </li>

      <li>
        <p className="text-secondary">Langue(s)</p>

        <ul className="list">
          {movie.spoken_languages.map((lang) => {
            const translated = displayLanguage.of(lang.iso_639_1);
            const capitalized = translated
              ? translated.charAt(0).toUpperCase() + translated.slice(1)
              : "";

            return (
              <li key={lang.iso_639_1}>
                <Badge key={lang.iso_639_1} variant="secondary">
                  {capitalized}
                </Badge>
              </li>
            );
          })}
        </ul>
      </li>

      <li>
        <p className="text-secondary">Studio(s)</p>
        <ul className="list">
          {movie.production_companies.map((company, idx) => (
            <li key={company.name}>
              <Badge key={idx} variant="secondary">
                {company.name}
              </Badge>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
}
