import { toast } from "sonner";
import type { NavigateFn } from "@tanstack/react-router";

export function handleMutationError(
  error: Error,
  navigate: NavigateFn,
  fallbackMessage = "Une erreur est survenue",
) {
  if (error.message === "Unauthenticated") {
    toast.error("Vous devez vous connecter");

    return navigate({
      to: "/auth/sign-in",
      search: { redirect: location.pathname },
    });
  }

  toast.error(error.message || fallbackMessage);
}
