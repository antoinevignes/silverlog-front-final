import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog/dialog";
import Button from "@/components/ui/button/button";
import "./movies-filters.scss";
import { Label } from "@/components/ui/label/label";
import Title from "@/components/ui/title/title";

export type MovieFilters = {
  query?: string;
  sort_by?: string;
  with_genres?: string;
  primary_release_year?: string;
  "vote_average.gte"?: string;
};

type MoviesFiltersProps = {
  filters: MovieFilters;
  onFiltersChange: (filters: MovieFilters) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularité" },
  { value: "vote_average.desc", label: "Note moyenne" },
  { value: "primary_release_date.desc", label: "Date de sortie" },
  { value: "title.asc", label: "Titre (A-Z)" },
  { value: "vote_count.desc", label: "Nombre de votes" },
];

const GENRES = [
  { value: "28", label: "Action" },
  { value: "12", label: "Aventure" },
  { value: "16", label: "Animation" },
  { value: "35", label: "Comédie" },
  { value: "80", label: "Crime" },
  { value: "99", label: "Documentaire" },
  { value: "18", label: "Drame" },
  { value: "10751", label: "Familial" },
  { value: "14", label: "Fantastique" },
  { value: "36", label: "Histoire" },
  { value: "27", label: "Horreur" },
  { value: "10402", label: "Musique" },
  { value: "9648", label: "Mystère" },
  { value: "10749", label: "Romance" },
  { value: "878", label: "Science-Fiction" },
  { value: "10770", label: "Téléfilm" },
  { value: "53", label: "Thriller" },
  { value: "10752", label: "Guerre" },
  { value: "37", label: "Western" },
];

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
};

function FiltersContent({
  localFilters,
  handleChange,
}: {
  localFilters: MovieFilters;
  handleChange: (key: keyof MovieFilters, value: string) => void;
}) {
  return (
    <>
      <div className="filter-group">
        <Label className="filter-label" htmlFor="sort_by">
          Trier par
        </Label>
        <select
          id="sort_by"
          className="filter-select"
          value={localFilters.sort_by || ""}
          onChange={(e) => handleChange("sort_by", e.target.value)}
        >
          <option value="">Par défaut</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <Label className="filter-label" htmlFor="with_genres">
          Genre
        </Label>
        <select
          id="with_genres"
          className="filter-select"
          value={localFilters.with_genres || ""}
          onChange={(e) => handleChange("with_genres", e.target.value)}
        >
          <option value="">Tous les genres</option>
          {GENRES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <Label className="filter-label" htmlFor="primary_release_year">
          Année
        </Label>
        <select
          id="primary_release_year"
          className="filter-select"
          value={localFilters.primary_release_year || ""}
          onChange={(e) => handleChange("primary_release_year", e.target.value)}
        >
          <option value="">Toutes les années</option>
          {generateYearOptions().map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <Label className="filter-label">Note minimale</Label>
        <div className="filter-range">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={localFilters["vote_average.gte"] || "0"}
            onChange={(e) => handleChange("vote_average.gte", e.target.value)}
          />
          <span className="range-value">
            {localFilters["vote_average.gte"] || "0"}/10
          </span>
        </div>
      </div>
    </>
  );
}

export default function MoviesFilters({
  filters,
  onFiltersChange,
  isOpen,
  onOpen,
  onClose,
}: MoviesFiltersProps) {
  const [localFilters, setLocalFilters] = useState<MovieFilters>(filters);

  const handleChange = (key: keyof MovieFilters, value: string) => {
    const newFilters = { ...localFilters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters: MovieFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onClose();
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof MovieFilters],
  );

  return (
    <>
      <Button
        className="filters-toggle-btn"
        onClick={onOpen}
        aria-label="Ouvrir les filtres"
        variant="outline"
      >
        <SlidersHorizontal size={18} />
        <span>Filtres</span>
        {hasActiveFilters && <span className="filter-badge" />}
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <header className="filters-header">
            <Title title="Filtres" variant="h3" size="md" />
          </header>

          <div className="filters-body">
            <FiltersContent
              localFilters={localFilters}
              handleChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button size="sm" onClick={handleApply}>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <aside className="movies-filters-sidebar">
        <div className="filters-body">
          <FiltersContent
            localFilters={localFilters}
            handleChange={handleChange}
          />
        </div>

        <footer className="filters-footer">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button size="sm" onClick={handleApply}>
            Appliquer
          </Button>
        </footer>
      </aside>
    </>
  );
}
