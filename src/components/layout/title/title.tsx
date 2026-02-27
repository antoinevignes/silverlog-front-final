import "./title.scss";

export default function Title({
  title,
  subtitle,
  variant = "h2",
  size = "md",
  className = "",
}: {
  title: string;
  subtitle?: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const Tag = variant;

  return (
    <div className={`title-container ${className}`}>
      <Tag className={`font-sentient truncate-2-lines title ${size}`}>
        {title}
      </Tag>
      {subtitle && <p className="text-secondary subtitle">{subtitle}</p>}
    </div>
  );
}
