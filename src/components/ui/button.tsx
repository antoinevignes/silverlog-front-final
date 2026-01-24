import styled, { css } from "styled-components";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "secondary" | "outline" | "ghost" | "destructive";

type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
  asChild?: boolean;
  children: ReactNode;
  disabled?: boolean;
}

const variantStyles = {
  default: css`
    background: #171717;
    color: #fafafa;

    &:hover {
      background: #262626;
    }
  `,
  secondary: css`
    background: #f5f5f5;
    color: #171717;

    &:hover {
      background: #e5e5e5;
    }
  `,
  outline: css`
    background: transparent;
    border-color: #e5e5e5;
    color: #171717;

    &:hover {
      background: #f5f5f5;
    }
  `,
  ghost: css`
    background: transparent;
    color: #171717;

    &:hover {
      background: #f5f5f5;
    }
  `,
  destructive: css`
    background: #ef4444;
    color: #fafafa;

    &:hover {
      background: #dc2626;
    }
  `,
};

const sizeStyles = {
  sm: css`
    height: 2rem;
    padding: 0 0.75rem;
    font-size: 0.875rem;
  `,
  md: css`
    height: 2.5rem;
    padding: 0 1rem;
    font-size: 0.875rem;
  `,
  lg: css`
    height: 3rem;
    padding: 0 1.5rem;
    font-size: 1rem;
  `,
  icon: css`
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
  `,
};

const StyledButton = styled.button<
  Required<Pick<ButtonProps, "variant" | "size">>
>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  border-radius: 0.5rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;

  border: 1px solid transparent;
  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  ${({ variant }) => variantStyles[variant]}
  ${({ size }) => sizeStyles[size]}
`;

export default function Button({
  variant = "default",
  size = "md",
  type = "button",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <StyledButton type={type} as="span" variant={variant} size={size}>
        {children}
      </StyledButton>
    );
  }

  return (
    <StyledButton type={type} variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
}
