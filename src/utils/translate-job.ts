const JOB_TRANSLATIONS: Record<string, string> = {
  Director: "Réalisateur",
  Screenplay: "Scénariste",
  Producer: "Producteur",
  "Executive Producer": "Producteur exécutif",
  "Director of Photography": "Directeur de la photographie",
  "Original Music Composer": "Compositeur",
  Editor: "Monteur",
};

export default function translateJob(job: string): string | null {
  return JOB_TRANSLATIONS[job] || null;
}
