import { createFileRoute, redirect } from "@tanstack/react-router";
import { crewPicksQuery } from "@/features/movie/api/movie.queries";
import Title from "@/components/ui/title/title";
import { Shield } from "lucide-react";
import Tabs from "@/components/ui/tabs/tabs";
import { z } from "zod";
import AdminStats from "../../features/admin/components/admin-stats";
import AdminUsers from "../../features/admin/components/admin-users";
import AdminReviews from "../../features/admin/components/admin-reviews";
import "./admin.scss";
import { Seo } from "@/components/seo/seo";
import CrewPicksEditor from "@/features/admin/components/crew-picks-editor";

const adminSearchSchema = z.object({
  tab: z.enum(["general", "reviews"]).catch("general").default("general"),
});

export const Route = createFileRoute("/admin/")({
  validateSearch: adminSearchSchema,
  beforeLoad: ({ context: { auth } }) => {
    if (auth.user?.role !== "admin") {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(crewPicksQuery());
  },
  component: Page,
});

function Page() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  const adminTabs = [
    { id: "general", label: "Général" },
    { id: "reviews", label: "Commentaires & Modération" },
  ];

  return (
    <>
      <Seo
        title="Administration"
        description="Page d'administration de Silverlog"
        noIndex
      />
      <main className="admin-container container">
        <header className="admin-header">
          <Shield size={32} />
          <Title title="Administration" variant="h1" size="xl" />
        </header>

        <div className="admin-tabs-wrapper">
          <Tabs
            selected={tab}
            setSelected={(id) =>
              navigate({ search: { tab: id as any }, replace: true })
            }
            tabs={adminTabs}
            variant="transparent"
          />
        </div>

        {tab === "general" && (
          <div className="admin-general-layout">
            <AdminStats />
            <CrewPicksEditor />
            <AdminUsers />
          </div>
        )}
        {tab === "reviews" && <AdminReviews />}
      </main>
    </>
  );
}
