import type { ReactNode } from "react";
import "./badge.scss";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
}: BadgeProps) {
  return (
    <span
      className={`badge badge-${variant} badge-${size} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
