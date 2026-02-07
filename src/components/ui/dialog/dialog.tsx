import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import "./dialog.scss";
import Button from "../button";

type DialogContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog />");
  return ctx;
};

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: ReactElement<{ onClick?: React.MouseEventHandler }>;
}) {
  const { onOpenChange } = useDialog();
  const onClick = () => onOpenChange(true);

  if (asChild) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        onClick();
      },
    });
  }

  return <Button onClick={onClick}>{children}</Button>;
}
export function DialogContent({ children }: { children: ReactNode }) {
  const { open, onOpenChange } = useDialog();
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) setShouldRender(true);
    else {
      const timer = setTimeout(() => setShouldRender(false), 280);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className="dialog-overlay"
        data-state={open ? "open" : "closed"}
        onClick={() => onOpenChange(false)}
      />
      <section
        className="dialog-content"
        data-state={open ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </section>
    </>
  );
}

export const DialogFooter = ({ children }: { children: ReactNode }) => (
  <footer className="dialog-footer">{children}</footer>
);
