import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.scss";

type Variant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "default",
  size = "md",
  type = "button",
  asChild = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const classNames = ["btn", `btn--${variant}`, `btn--${size}`, className]
    .join(" ")
    .trim();

  if (asChild) {
    return (
      <span
        className={classNames}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    );
  }

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  );
}
