import "./mentions-legales.scss";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about/mentions-legales")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="container mention-legales">
      <h1>Mentions légales</h1>

      <Separator />

      <p>
        Silverlog ne collecte que les informations essentielles au service :
        identifiants de connexion (email, mot de passe chiffré), profil public
        (nom d'utilisateur, bio) et historique cinématographique (notes,
        critiques).
      </p>
      <p>
        Ces données sont traitées uniquement pour permettre le fonctionnement
        social de la plateforme et ne font l'objet d'aucune revente à des tiers.
      </p>
      <p>
        Chaque membre dispose d'un contrôle total sur ses données personnelles
        via son espace personnel.Ces données sont conservées tant que vous
        restez inscrit. Silverlog garantit une suppression effective et
        définitive de l'ensemble des données liées à un compte (critiques,
        notes, historique) sur simple demande ou via la fonction "Supprimer mon
        compte".
      </p>
    </main>
  );
}
