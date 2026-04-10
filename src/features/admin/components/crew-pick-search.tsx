import Button from "@/components/ui/button/button";
import Title from "@/components/ui/title/title";
import { movieSearchQuery } from "@/features/movie/api/movie.queries";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { Image } from "@unpic/react";
import { Search as SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function CrewPickSearch({
  onAdd,
}: {
  onAdd: (movie: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery(movieSearchQuery(debouncedSearch));

  return (
    <div className="crew-pick-search-box">
      <Title
        title="Rechercher un film à ajouter"
        className="crew-pick-search-box__title"
      />
      <div className="search-input-wrapper">
        <SearchIcon size={18} />
        <input
          type="text"
          placeholder="Titre du film..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && search && (
        <p className="search-loading">Recherche en cours...</p>
      )}

      {data?.results && data.results.length > 0 && (
        <div className="search-results">
          {data.results.slice(0, 5).map((movie) => (
            <div key={movie.id} className="search-result-item">
              {movie.poster_path ? (
                <Image
                  src={getCloudinarySrc(movie.poster_path, "posters")}
                  width={40}
                  aspectRatio={2 / 3}
                  layout="constrained"
                  background="auto"
                  alt={`Affiche de ${movie.title}`}
                  className="search-result-poster"
                />
              ) : (
                <div className="search-result-poster search-result-poster--placeholder">
                  Sans image
                </div>
              )}
              <div className="search-result-info">
                <span className="search-result-info__title">{movie.title}</span>
                <span className="search-result-info__year">
                  {movie.release_date?.substring(0, 4)}
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  onAdd(movie);
                  setSearch("");
                }}
              >
                Ajouter
              </Button>
            </div>
          ))}
        </div>
      )}

      {data?.results && data.results.length === 0 && search && (
        <p className="search-empty">Aucun film trouvé pour "{search}"</p>
      )}
    </div>
  );
}
