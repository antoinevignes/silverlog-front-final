const JOB_TRANSLATIONS: Record<string, string> = {
  Director: "Réalisateur",
  Screenplay: "Scénariste",
  Producer: "Producteur",
  "Executive Producer": "Producteur exécutif",
  "Director of Photography": "Directeur de la photographie",
  "Original Music Composer": "Compositeur",
  Editor: "Monteur",

  Acting: "Acteur",
  Directing: "Réalisateur",
  Writing: "Scénariste",
  Production: "Producteur",
  Camera: "Directeur de la photographie",
  Sound: "Compositeur",
  Editing: "Monteur",
};

export default function translateJob(job: string): string | null {
  return JOB_TRANSLATIONS[job] || null;
}
