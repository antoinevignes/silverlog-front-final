import "./separator.scss";

export const Separator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) => (
  <hr className={`separator ${className || ""}`} {...props} />
);
