export default function translateJob(job: string) {
  switch (job) {
    case "Director":
      return "Réalisateur";

    case "Producer":
      return "Producteur";

    case "Executive Producer":
      return "Producteur exécutif";

    case "Story":
      return "Scenariste";

    default:
      break;
  }
}
