import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";

// TYPES
type DialogContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

type DialogTriggerProps = {
  asChild?: boolean;
  children: ReactElement<{ onClick?: React.MouseEventHandler }>;
};

type DialogContentProps = {
  children: ReactNode;
};

// ANIMATIONS
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const scaleOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`;

export const DialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const DialogTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

export const DialogDescription = styled.p`
  font-size: 0.875rem;
`;

const Overlay = styled.div<{ $state: "open" | "closed" }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 50;

  animation: ${({ $state }) => ($state === "open" ? fadeIn : fadeOut)} 280ms
    ease-out forwards;

  @media (max-width: 768px) {
    background: rgba(0, 0, 0, 0.4);
  }
`;

const Content = styled.div<{ $state: "open" | "closed" }>`
  box-sizing: border-box;
  position: fixed;
  z-index: 51;
  background-color: #fafafa;

  overflow-y: auto;
  overscroll-behavior: contain;

  border-radius: 12px;
  padding: 1.5rem;

  top: auto;
  left: 0;
  bottom: 0;

  width: 100%;
  max-width: none;
  height: fit-content;
  border-radius: 16px 16px 0 0;

  padding: 1rem 1rem 1.5rem;

  transform: none;

  animation: ${({ $state }) => ($state === "open" ? slideUp : slideDown)} 280ms
    cubic-bezier(0.16, 1, 0.3, 1) forwards;

  // RESPONSIVE
  @media (min-width: 768px) {
    top: 50%;
    left: 50%;
    bottom: auto;
    height: auto;

    width: 90vw;
    max-width: 480px;

    border-radius: 12px;
    padding: 1.5rem;

    transform: translate(-50%, -50%);

    animation: ${({ $state }) => ($state === "open" ? scaleIn : scaleOut)} 280ms
      ease-out forwards;
  }
`;

// CONTEXT
const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog components must be used within <Dialog />");
  }
  return ctx;
}

// DIALOG
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const onWheel = (e: WheelEvent) => e.preventDefault();
    const onTouchMove = (e: TouchEvent) => e.preventDefault();

    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

// DIALOG TRIGGER
export function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  const { onOpenChange } = useDialog();

  if (asChild) {
    return cloneElement(children, {
      onClick: () => onOpenChange(true),
    });
  }

  return <button onClick={() => onOpenChange(true)}>{children}</button>;
}

// DIALOG CONTENT
export function DialogContent({ children }: DialogContentProps) {
  const { open, onOpenChange } = useDialog();
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 280);

      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!isVisible) return null;

  return (
    <>
      <Overlay
        $state={open ? "open" : "closed"}
        onClick={() => onOpenChange(false)}
      />
      <Content $state={open ? "open" : "closed"} role="dialog" aria-modal>
        {children}
      </Content>
    </>
  );
}
