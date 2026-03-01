import type { ListType } from "@/utils/types/list";
import ListCard from "../../lists/list-card/list-card";
import "./lists.scss";
import { personalListsQuery } from "@/queries/list.queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Lists() {
  const { data: lists } = useSuspenseQuery(personalListsQuery());

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
