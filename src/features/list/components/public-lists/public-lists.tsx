import { useSuspenseQuery } from "@tanstack/react-query";
import { ListX } from "lucide-react";
import { publicListsQuery } from "../../api/list.queries";
import ListCard from "../list-card/list-card";
import "./public-lists.scss";

export default function PublicLists() {
  const { data: lists } = useSuspenseQuery(publicListsQuery());

  if (!lists || lists.length === 0) {
    return (
      <div className="public-lists-empty">
        <ListX size={48} />
        <p className="text-secondary">
          Aucune liste publique disponible pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="public-lists-grid">
      {lists.map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
