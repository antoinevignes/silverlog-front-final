import "./label.scss";

export const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`label ${className || ""}`} {...props} />
);
