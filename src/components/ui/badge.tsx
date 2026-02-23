import type { ReactNode } from "react";
import styled, { css } from "styled-components";

type Variant = "default" | "secondary" | "outline" | "destructive";

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  default: css`
    background: #171717;
    color: #fafafa;
  `,
  secondary: css`
    background: #f5f5f5;
    color: #171717;
  `,
  outline: css`
    background: transparent;
    border-color: #e5e5e5;
    color: #171717;
  `,
  destructive: css`
    background: #ef4444;
    color: #fafafa;
  `,
};

const StyledBadge = styled.p<Required<Pick<BadgeProps, "variant">>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;

  white-space: nowrap;

  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1;

  border-radius: 1rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid transparent;

  ${({ variant }) => variantStyles[variant]}
`;

export default function Badge({
  variant = "default",
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <StyledBadge variant={variant} {...props} className={className}>
      {children}
    </StyledBadge>
  );
}
