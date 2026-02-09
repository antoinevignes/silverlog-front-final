import { useFieldContext } from "@/utils/useAppForm";
import "./textarea.scss";
import type { TextareaHTMLAttributes } from "react";

export default function Textarea({
  id,
  disabled,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const field = useFieldContext<any>();

  return (
    <textarea
      className="app-textarea"
      id={id}
      disabled={disabled}
      {...props}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
    />
  );
}
