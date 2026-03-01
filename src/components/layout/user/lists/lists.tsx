import type { ListType } from "@/utils/types/list";
import ListCard from "../../lists/list-card/list-card";
import "./lists.scss";
import { personalListsQuery } from "@/queries/list.queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useAuth } from "@/auth";

export default function Lists() {
  const routeApi = getRouteApi("/user/$userId/");
  const { userId } = routeApi.useParams();
  const { user } = useAuth();

  const isPublic = Number(user?.id) !== Number(userId);
  const { data: lists } = useSuspenseQuery(
    personalListsQuery(userId, isPublic),
  );

  return (
    <section className="content-section" aria-label="Listes publiques">
      <div className="lists-grid">
        {lists.map((list: ListType) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>
    </section>
  );
}
