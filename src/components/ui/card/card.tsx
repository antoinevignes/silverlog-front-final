import "./card.scss";

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <article className={`card ${className || ""}`} {...props} />
);

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <header className={`card-header ${className || ""}`} {...props} />
);

export const CardTitleRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`card-title-row ${className || ""}`} {...props} />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`card-title ${className || ""}`} {...props} />
);

export const CardRating = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`card-rating ${className || ""}`} {...props} />
);

export const CardSubtitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`card-subtitle ${className || ""}`} {...props} />
);

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <footer className={`card-footer ${className || ""}`} {...props} />
);
