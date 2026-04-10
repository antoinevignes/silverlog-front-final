import "./mentions-legales.scss";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator/separator";
import Title from "@/components/ui/title/title";
import { Seo } from "@/components/seo/seo";

export const Route = createFileRoute("/about/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Seo
        title="Mentions Légales"
        description="Politique de confidentialité et mentions légales de Silverlog. Découvrez comment nous protégeons vos données conformément au RGPD."
        type="website"
      />
    <main className="container mention-legales">
      <div className="mention-legales__content">
        <Title title="Mentions Légales" variant="h1" size="xl" />

        <Separator />
        <p>
          Chez Silverlog, nous considérons que la confiance est le socle de
          notre communauté.
          <br />
          Conformément au Règlement Général sur la Protection des Données
          (RGPD), nous avons adopté une politique de minimisation des données :
          nous ne collectons et ne conservons que les informations strictement
          nécessaires au bon fonctionnement de l'application et à l'amélioration
          de votre expérience utilisateur.
        </p>

        <Title title="1. Quelles données collectons nous ?" variant="h2" />
        <p>
          Nous collectons uniquement les informations que vous nous transmettez
          volontairement pour utiliser nos services :
          <br />
          Votre adresse email (utilisée pour l'authentification et les
          notifications) et votre mot de passe (stocké de manière chiffrée).
          <br />
          Les films que vous notez, vos critiques, vos listes personnalisées et
          votre watchlist.
          <br />
          Votre pseudo, avatar et biographie, uniquement dans le but de
          personnaliser votre espace public.
          <br />
          Vos données sont conservées tant que votre compte est actif. En cas de
          suppression de votre compte, toutes vos données (critiques, listes,
          historique) sont définitivement effacées de nos serveurs.
        </p>

        <Title title=" 2. Pourquoi utilisons-nous ces données ?" />
        <p>
          La finalité de cette collecte est exclusivement technique et
          fonctionnelle : maintenir votre connexion sécurisée, vous permettre de
          consulter votre historique et vos statistiques cinéphiles et faciliter
          les interactions au sein de la communauté. <br />
          Nous nous engageons formellement à ne jamais vendre, louer ou partager
          vos données personnelles avec des tiers à des fins commerciales.
        </p>

        <Title title="3. Vos droits" variant="h2" />
        <p>
          Vous disposez d'un contrôle total sur vos informations. À tout moment,
          via les paramètres de votre profil, vous pouvez : accéder à vos
          données et les modifier, ainsi que demander la suppression définitive
          de votre compte et de l'intégralité de vos données associées.
        </p>
      </div>
    </main>
    </>
  );
}
