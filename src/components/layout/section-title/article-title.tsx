import { Link } from "@tanstack/react-router";
import "./article-title.scss";
import { ArrowRight } from "lucide-react";

export default function ArticleTitle({
  title,
  subtitle,
  url,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  url?: string;
  linkLabel?: string;
}) {
  return (
    <section className="article-title">
      <div>
        <h2 className="font-sentient">{title}</h2>
        <p className="text-secondary">{subtitle}</p>
      </div>

      {url && (
        <Link to={url} className="animated-link">
          {linkLabel}
          <ArrowRight size={15} />
        </Link>
      )}
    </section>
  );
}
