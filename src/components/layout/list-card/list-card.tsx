import Badge from "@/components/ui/badge/badge";
import {
  getCloudinaryPlaceholder,
  getCloudinarySrc,
} from "@/utils/cloudinary-handler";
import { Image } from "@unpic/react";
import { Film, Heart, UserCircle } from "lucide-react";
import "./list-card.scss";

export default function ListCard({ list }: { list: any }) {
  const formatCompactNumber = (number: number) => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(number);
  };

  return (
    <article key={list.id} className="public-list-card">
      <section className="list-info-block">
        <h3 className="list-title truncate-2-lines">{list.title}</h3>

        <Badge className="movie-count-badge">
          <Film size={14} /> {list.movies.length} films
        </Badge>

        <p className="list-description truncate-2-lines">{list.description}</p>

        <p className="stat-badge likes">
          <Heart size={14} fill="red" stroke="red" />{" "}
          {formatCompactNumber(3500)}
        </p>

        <div className="list-author">
          <UserCircle size={16} />
          <span>{list.username}</span>
        </div>
      </section>

      <section className="posters-overlap-container">
        {list.movies.slice(0, 3).map((movie: any, index: number) => {
          return (
            <Image
              src={getCloudinarySrc(movie.poster_path, "posters")}
              alt="Posters des films de la liste"
              layout="constrained"
              width={100}
              aspectRatio={2 / 3}
              background={getCloudinaryPlaceholder(
                movie.poster_path,
                "posters",
              )}
              className={`preview-poster depth-${index}`}
            />
          );
        })}
      </section>
    </article>
  );
}
