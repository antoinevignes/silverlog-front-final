export const movieKeys = {
  all: ["movie"] as const,
  detail: (id: string) => [...movieKeys.all, id] as const,
  data: (id: string) => [...movieKeys.detail(id), "data"] as const,
  state: (id: string) => [...movieKeys.detail(id), "state"] as const,
  credits: (id: string) => [...movieKeys.detail(id), "credits"] as const,
  similar: (id: string) => [...movieKeys.detail(id), "similar"] as const,
  details: (id: string) => [...movieKeys.detail(id), "details"] as const,
  search: (query: string) => [...movieKeys.all, "search", query] as const,
  popular: () => [...movieKeys.all, "popular"] as const,
  crewPicks: () => ["movies", "crew-picks"] as const,
  friendsActivity: (id: string) => ["movies", id, "friends-activity"] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  byMovie: (movieId: string) => [...reviewKeys.all, movieId] as const,
  userReview: (movieId: string) => ["review", movieId] as const,
  recent: () => [...reviewKeys.all, "recent"] as const,
};

export const listKeys = {
  detail: (listId: string) => ["list", listId, "data"] as const,
  custom: (userId: string | number) => ["custom-lists", userId] as const,
  public: () => ["public-lists"] as const,
  personal: (userId: string) => ["personal-lists", userId] as const,
};

export const userKeys = {
  detail: (userId: string) => ["user", userId] as const,
  followers: (userId: string) => ["followers", userId] as const,
  following: (userId: string) => ["following", userId] as const,
  feed: () => ["user", "feed"] as const,
  search: (query: string) => ["user", "search", query] as const,
  seenMovies: (userId: string) => ["user", userId, "seen-movies"] as const,
  session: () => ["session"] as const,
};

export const personKeys = {
  details: (id: string) => ["person", "details", id] as const,
  detailsUS: (id: string) => ["person", "detailsUS", id] as const,
  credits: (id: string) => ["person", "credits", id] as const,
  search: (query: string) => ["person", "search", query] as const,
};
