import styled, { css, keyframes } from "styled-components";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// TYPES
type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ref: React.RefObject<HTMLDivElement | null>;
};

// FADE
const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// STYLES
export const StyledMenu = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledTrigger = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:focus-visible {
    outline: 1px solid #525252;
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`;

export const StyledContent = styled.div<{
  $open: boolean;
  $align?: "left" | "right";
}>`
  position: absolute;
  top: calc(100% + 0.5rem);
  ${({ $align }) => ($align === "left" ? "left: 0;" : "right: 0;")}

  min-width: 180px;
  padding: 0.5rem;
  background: #fafafa;
  border-radius: 0.5rem;

  box-shadow:
    0 2px 15px -3px rgba(0, 0, 0, 0.1),
    0 2px 6px -4px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  transform-origin: ${({ $align }) =>
    $align === "left" ? "top left" : "top right"};

  animation: ${({ $open }) =>
    $open &&
    css`
      ${fadeInScale} 150ms ease-in-out
    `};

  z-index: 50;
`;

export const StyledItem = styled.button`
  all: unset;
  cursor: pointer;

  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:hover,
  &:focus-visible {
    background-color: #e5e5e5;
  }
`;

// CONTEXTE
const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error("Dropdown components must be used inside <DropdownMenu>");
  }
  return ctx;
}

// COMPONENTS
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
      <StyledMenu ref={ref}>{children}</StyledMenu>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useDropdownContext();

  return (
    <StyledTrigger
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls="dropdown-menu"
      onClick={() => setOpen((prev) => !prev)}
    >
      {children}
    </StyledTrigger>
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
    <StyledContent id="dropdown-menu" role="menu" $open $align={align}>
      {children}
    </StyledContent>
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
    <StyledItem onClick={onClick} role="menuitem">
      {children}
    </StyledItem>
  );
}
