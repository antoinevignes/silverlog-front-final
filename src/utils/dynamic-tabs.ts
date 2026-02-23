type Tab = { id: string; label: string };

export const getDynamicTabs = (details: any, credits: any): Tab[] => {
  if (!details || !credits) return [];

  const source = [
    { id: "actor", label: "Acteur", exists: credits.cast?.length > 0 },
    {
      id: "director",
      label: "Réalisateur",
      exists: credits.crew?.some((m: any) => m.job === "Director"),
    },
    {
      id: "producer",
      label: "Producteur",
      exists: credits.crew?.some((m: any) =>
        ["Producer", "Executive Producer"].includes(m.job),
      ),
    },
    {
      id: "writer",
      label: "Scénariste",
      exists: credits.crew?.some((m: any) =>
        ["Story", "Screenplay", "Writer"].includes(m.job),
      ),
    },
    {
      id: "photography",
      label: "Dir. de la photo.",
      exists: credits.crew?.some(
        (m: any) => m.job === "Director of Photography",
      ),
    },
    {
      id: "composer",
      label: "Musique",
      exists: credits.crew?.some(
        (m: any) => m.job === "Original Music Composer",
      ),
    },
    {
      id: "editor",
      label: "Montage",
      exists: credits.crew?.some((m: any) => m.job === "Editor"),
    },
  ];

  const PRIORITIES: Record<string, string[]> = {
    Directing: [
      "director",
      "writer",
      "producer",
      "photography",
      "editor",
      "actor",
    ],
    Writing: ["writer", "producer", "director", "editor", "actor"],
    Camera: ["photography", "editor", "director", "producer"],
    Sound: ["composer", "producer"],
    Production: ["producer", "director", "writer", "actor"],
    Acting: ["actor", "producer", "writer", "director"],
    Editing: ["editor", "producer", "director"],
  };

  const order = PRIORITIES[details.known_for_department];

  const sortedWorkTabs = source
    .filter((tab) => tab.exists)
    .sort((a, b) => {
      const indexA = order.indexOf(a.id);
      const indexB = order.indexOf(b.id);

      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

  return [
    { id: "details", label: "À propos" },
    ...sortedWorkTabs.slice(0, 3).map(({ id, label }) => ({ id, label })),
  ];
};
