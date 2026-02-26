import styled, { css } from "styled-components";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useFieldContext } from "@/utils/useAppForm";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const InputWrapper = styled.div<{
  $hasLeftIcon?: boolean;
  $hasRightIcon?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
`;

const Icon = styled.span<{ $position: "left" | "right" }>`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #a3a3a3;

  ${({ $position }) =>
    $position === "left"
      ? css`
          left: 0.75rem;
        `
      : css`
          right: 0.75rem;
        `}

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Field = styled.input<{
  $hasLeftIcon?: boolean;
  $hasRightIcon?: boolean;
}>`
  width: 100%;
  padding: 0.55rem 0.8rem;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  background-color: #fafafa;
  border: 1.5px solid #d4d4d4;

  ${({ $hasLeftIcon }) =>
    $hasLeftIcon &&
    css`
      padding-left: 2.2rem;
    `}

  ${({ $hasRightIcon }) =>
    $hasRightIcon &&
    css`
      padding-right: 2.2rem;
    `}

  transition: all 150ms ease-in-out;

  &::placeholder {
    color: #a3a3a3;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(23, 23, 23, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

export default function Input({
  id,
  label,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: InputProps) {
  const field = useFieldContext<string>();

  return (
    <InputWrapper $hasLeftIcon={!!leftIcon} $hasRightIcon={!!rightIcon}>
      {leftIcon && <Icon $position="left">{leftIcon}</Icon>}

      <Field
        id={id}
        disabled={disabled}
        $hasLeftIcon={!!leftIcon}
        $hasRightIcon={!!rightIcon}
        {...props}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />

      {rightIcon && <Icon $position="right">{rightIcon}</Icon>}
    </InputWrapper>
  );
}
