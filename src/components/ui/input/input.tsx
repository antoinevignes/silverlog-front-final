import type { InputHTMLAttributes, ReactNode, RefObject } from "react";
import { useFieldContext } from "@/utils/useAppForm";
import "./input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function Input({
  id,
  label,
  leftIcon,
  rightIcon,
  disabled,
  className,
  inputRef,
  ...props
}: InputProps) {
  const field = useFieldContext<string>();

  const fieldClasses = [
    "input-field",
    leftIcon ? "input-field--has-left-icon" : "",
    rightIcon ? "input-field--has-right-icon" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-wrapper">
      {leftIcon && (
        <span className="input-icon input-icon--left" aria-hidden>
          {leftIcon}
        </span>
      )}

      <input
        ref={inputRef}
        id={id}
        disabled={disabled}
        className={`${fieldClasses} py-sm ${leftIcon ? "pl-xl" : "pl-md"} ${rightIcon ? "pr-xl" : "pr-md"}`}
        {...props}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />

      {rightIcon && (
        <span className="input-icon input-icon--right" aria-hidden>
          {rightIcon}
        </span>
      )}
    </div>
  );
}
