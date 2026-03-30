import { useState, useCallback } from "react";

interface UseToggleOptions {
  initialValue?: boolean;
}

interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

/**
 * Hook pour gérer un état boolean (on/off)
 * 
 * @example
 * ```tsx
 * const { value: isOpen, toggle, setFalse: close } = useToggle();
 * 
 * <button onClick={toggle}>
 *   {isOpen ? "Fermer" : "Ouvrir"}
 * </button>
 * ```
 */
export function useToggle({ initialValue = false }: UseToggleOptions = {}): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
}

export default useToggle;
