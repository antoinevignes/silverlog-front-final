import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { movieKeys } from "@/utils/query-keys";

export function useUpdateCrewPicks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie_ids: number[]) => {
      return await apiClient("/movies/crew-picks", {
        method: "PUT",
        body: JSON.stringify({ movie_ids }),
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
