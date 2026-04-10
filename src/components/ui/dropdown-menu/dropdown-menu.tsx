import "./dropdown-menu.scss";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ref: React.RefObject<HTMLDivElement | null>;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error("Dropdown components must be used inside <DropdownMenu>");
  }
  return ctx;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, ref }}>
      <div className="dropdown-menu" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useDropdownContext();

  return (
    <button
      className="dropdown-trigger"
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls="dropdown-content"
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </button>
  );
}

export function DropdownContent({
  children,
  align = "right",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const { open } = useDropdownContext();

  if (!open) return null;

  return (
    <div
      id="dropdown-content"
      role="menu"
      className={`dropdown-content dropdown-align-${align} p-sm gap-xs`}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="dropdown-item gap-sm" onClick={onClick} role="menuitem" type="button">
      {children}
    </button>
  );
}
