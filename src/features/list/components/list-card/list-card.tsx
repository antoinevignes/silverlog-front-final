import { Image } from "@unpic/react";
import { Bookmark, Film, UserCircle } from "lucide-react";
import "./list-card.scss";
import { Link } from "@tanstack/react-router";
import type { ListType } from "@/features/list/types/list";
import Badge from "@/components/ui/badge/badge";
import { getCloudinarySrc } from "@/utils/cloudinary-handler";
import { formatCompactNumber } from "@/utils/format-compact-number";
import { useAuth } from "@/auth";

export default function ListCard({ list }: { list: ListType }) {
  const { user } = useAuth();

  return (
    <Link
      to="/lists/$listId"
      params={{ listId: String(list.id) }}
      className="public-list-card"
    >
      <section className="list-info-block">
        <h3 className="list-title truncate-2-lines">{list.title}</h3>

        <Badge className="movie-count-badge">
          <Film size={14} /> {list.movies.length} films
        </Badge>

        <p className="list-description truncate-2-lines">{list.description}</p>

        <p className="stat-badge likes">
          <Bookmark size={14} fill="currentColor" />{" "}
          {formatCompactNumber(list.saved_count)}
        </p>

        <div className="list-author">
          {user?.avatar_path ? (
            <Image
              src={getCloudinarySrc(user.avatar_path, "avatars")}
              layout="constrained"
              width={20}
              height={20}
              alt={`Avatar de ${user.username}`}
              background="auto"
              priority
              className="avatar"
            />
          ) : (
            <UserCircle size={16} />
          )}

          <span>{list.username}</span>
        </div>
      </section>

      <section className="posters-overlap-container">
        {list.movies.slice(0, 3).map((movie, index: number) => {
          return (
            <Image
              src={getCloudinarySrc(movie.poster_path, "posters")}
              alt="Posters des films de la liste"
              layout="constrained"
              width={100}
              aspectRatio={2 / 3}
              background="auto"
              className={`preview-poster depth-${index}`}
            />
          );
        })}
      </section>
    </Link>
  );
}
