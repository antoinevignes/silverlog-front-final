import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { movieKeys } from "@/utils/query-keys";

interface CrewPickMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  genres: Array<{ id: number; name: string }> | null;
}

export function useUpdateCrewPicks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movies }: { movies: CrewPickMovie[] }) => {
      return await apiClient("/movies/crew-picks", {
        method: "PUT",
        body: JSON.stringify({ movies }),
      });
    },
    onSuccess: () => {
      toast.success("Sélection de la rédaction mise à jour");
      queryClient.invalidateQueries({
        queryKey: movieKeys.crewPicks(),
      });
    },
    onError: () => {
      toast.error("Échec de la mise à jour");
    },
  });
}
