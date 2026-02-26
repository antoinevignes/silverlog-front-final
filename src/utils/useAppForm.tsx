import {
  
  createFormHook,
  createFormHookContexts
} from "@tanstack/react-form";
import type {AnyFieldApi} from "@tanstack/react-form";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea/textarea";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
    Textarea,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid
        ? field.state.meta.errors.map((err) => (
            <p role="alert" className="error">
              {err?.message}
            </p>
          ))
        : null}
      {field.state.meta.isValidating ? "Validation..." : null}
    </>
  );
}
