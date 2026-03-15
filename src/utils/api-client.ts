/**
 * Client API centralisé pour Silverlog.
 * Gère automatiquement l'URL de base, le parsing JSON et les erreurs.
 */

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export async function apiClient<T>(
  endpoint: string,
  { params, ...customConfig }: ApiOptions = {},
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL;
  
  // Construction de l'URL avec les query params si présents
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    url += (url.includes("?") ? "&" : "?") + queryString;
  }

  const config: RequestInit = {
    method: customConfig.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...customConfig.headers,
    },
    credentials: "include", // Inclus par défaut pour les sessions/cookies
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    // Si on reçoit 204 No Content, on ne parse pas le JSON
    if (response.status === 204) {
      return {} as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erreur API (${response.status}) : ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur inconnue est survenue lors de la requête API.");
  }
}
