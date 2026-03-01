import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { seenMoviesQuery } from "./user-movie.queries";
import { useAuth } from "@/auth";

export function useUpdateMovieRating(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      value,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      genres,
    }: {
      value: number;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user_movie/${movieId}/rate`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: value * 2,
            title,
            poster_path: posterPath?.trim() === "" ? null : posterPath,
            backdrop_path: backdropPath?.trim() === "" ? null : backdropPath,
            release_date: releaseDate?.trim() === "" ? null : releaseDate,
            genres: genres.length > 0 ? genres : null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Note mise à jour !");
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
      queryClient.invalidateQueries({
        queryKey: seenMoviesQuery(String(user?.id)).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "details"],
      });
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }

      toast.error("Une erreur est survenue");
    },
  });
}

export function useDeleteMovieRating(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user_movie/${movieId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      return await res.json();
    },

    onSuccess: () => {
      toast.success("Note supprimée !");
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }
      toast.error("Une erreur est survenue");
    },
  });
}

export function useUpdateSeenDate(movieId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      seenDate,
      title,
      posterPath,
      backdropPath,
      releaseDate,
      genres,
    }: {
      seenDate: Date;
      title: string;
      posterPath: string | null;
      backdropPath: string | null;
      releaseDate: string | null;
      genres: Array<{ id: number; name: string }>;
    }) => {
      if (!user) {
        throw new Error("Unauthenticated");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user_movie/${movieId}/seen-date`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: seenDate,
            title,
            poster_path: posterPath?.trim() === "" ? null : posterPath,
            backdrop_path: backdropPath?.trim() === "" ? null : backdropPath,
            release_date: releaseDate?.trim() === "" ? null : releaseDate,
            genres: genres.length > 0 ? genres : null,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Une erreur est survenue");
      }

      return await res.json();
    },

    onSuccess: () => {
      toast.success("Film ajouté au journal !");
      queryClient.invalidateQueries({
        queryKey: ["movie", movieId, "state"],
      });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId, "data"] });
    },

    onError: (error) => {
      if (error.message === "Unauthenticated") {
        toast.error("Vous devez vous connecter");

        return navigate({
          to: "/auth/sign-in",
          search: { redirect: location.pathname },
        });
      }
      toast.error("Une erreur est survenue");
    },
  });
}
