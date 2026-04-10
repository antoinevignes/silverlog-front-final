import { useSuspenseQuery } from "@tanstack/react-query";
import { movieSearchQuery } from "@/features/movie/api/movie.queries";
import { personSearchQuery } from "@/features/movie/api/person.queries";
import { userSearchQuery } from "@/features/user/api/user.queries";
import MovieCard from "@/features/movie/components/movie-card/movie-card";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { Avatar } from "@/components/ui/avatar/avatar";
import { User } from "lucide-react";
import "./search-results.scss";
import Title from "@/components/ui/title/title";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { data: movieData } = useSuspenseQuery(movieSearchQuery(query));
  const { data: personData } = useSuspenseQuery(personSearchQuery(query));
  const { data: users } = useSuspenseQuery(userSearchQuery(query));

  const hasResults =
    movieData.results.length > 0 ||
    personData.results.length > 0 ||
    users.length > 0;

  if (!hasResults) {
    return (
      <section className="empty-results">
        <p className="text-secondary">Aucun résultat trouvé pour "{query}"</p>
      </section>
    );
  }

  return (
    <section className="search-results-container">
      {/* Section Utilisateurs */}
      {users.length > 0 && (
        <section className="search-section">
          <Title title="Utilisateurs" className="section-title font-fraunces" />

          <ul className="users-grid">
            {users.map((user: any) => (
              <li key={`user-${user.id}`}>
                <Link
                  to="/user/$userId"
                  params={{ userId: String(user.id) }}
                  className="person-result-card"
                >
                  <Avatar
                    username={user.username}
                    src={user.avatar_path ?? null}
                    size="lg"
                    className="person-avatar-wrapper"
                  />

                  <h3 className="person-name font-fraunces">{user.username}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section Films */}
      {movieData.results.length > 0 && (
        <section className="search-section">
          <Title title="Films" className="section-title" />

          <ul className="results-grid">
            {movieData.results.map((item) => (
              <li key={`movie-${item.id}`} className="result-item">
                <MovieCard movie={item} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section Personnes */}
      {personData.results.length > 0 && (
        <section className="search-section">
          <Title title="Personnes" className="section-title" />

          <ul className="results-grid">
            {personData.results.map((item) => {
              const profileSrc = getCloudinarySrc(item.profile_path, "posters");
              return (
                <li>
                  <Link
                    key={`person-${item.id}`}
                    to="/person/$personId"
                    params={{ personId: String(item.id) }}
                    className="person-result-card link"
                  >
                    <div className="person-avatar-wrapper">
                      {item.profile_path ? (
                        <Image
                          src={profileSrc}
                          layout="constrained"
                          width={120}
                          height={120}
                          alt={item.name}
                          className="person-avatar"
                          background="auto"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="person-avatar-placeholder">
                          <User size={36} />
                        </div>
                      )}
                    </div>

                    <div className="person-meta">
                      <h3 className="person-name font-fraunces">{item.name}</h3>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </section>
  );
}
