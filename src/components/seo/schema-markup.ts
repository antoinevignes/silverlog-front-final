import type { MovieType } from "@/features/movie/types/movie";

interface PersonData {
  name: string;
  biography?: string;
  profile_path?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for_department?: string;
}

export function generateMovieSchema(movie: MovieType) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date,
    duration:
      movie.runtime && movie.runtime > 0
        ? `PT${Math.floor(movie.runtime / 60)}H${movie.runtime % 60}M`
        : undefined,
    genre: movie.genres.map((g) => g.name),
    aggregateRating:
      movie.vote_average && movie.vote_count
        ? {
            "@type": "AggregateRating",
            ratingValue: (movie.vote_average / 2).toFixed(1),
            bestRating: "5",
            reviewCount: movie.vote_count,
          }
        : undefined,
  };
}

export function generatePersonSchema(person: PersonData) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.biography?.slice(0, 300),
    image: person.profile_path
      ? `https://image.tmdb.org/t/p/original${person.profile_path}`
      : undefined,
    birthDate: person.birthday,
    birthPlace: person.place_of_birth,
    jobTitle: person.known_for_department,
  };
}

export function generateProfileSchema(username: string, avatarPath?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: username,
      image: avatarPath || undefined,
    },
  };
}

export function generateItemListSchema(listName: string, items: Array<string>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Silverlog",
    url: "https://silverlog-front.onrender.com",
    description:
      "Votre journal de films personnalisé. Notez, critiquez et partagez vos films préférés.",
  };
}
