import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  createFormHook,
  createFormHookContexts,
  type AnyFieldApi,
} from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
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
