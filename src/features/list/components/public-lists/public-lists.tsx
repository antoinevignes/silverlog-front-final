import { useSuspenseQuery } from "@tanstack/react-query";
import { publicListsQuery } from "../../api/list.queries";
import ListCard from "../list-card/list-card";
import "./public-lists.scss";

export default function PublicLists() {
  const { data: lists } = useSuspenseQuery(publicListsQuery());

  if (!lists || lists.length === 0) {
    return null;
  }

  return (
    <div className="public-lists-grid">
      {lists.slice(0, 10).map((list) => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
