import "./tabs.scss";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  selected: string;
  setSelected: (value: string) => void;
  tabs: Array<TabItem>;
  variant?: string;
}

export default function Tabs({
  selected,
  setSelected,
  tabs,
  variant = "default",
}: TabsProps) {
  const variantClasses: Record<string, string> = {
    default: "p-xs gap-sm",
    transparent: "",
    header: "p-xs gap-xs mt-md mx-auto",
  };

  return (
    <div className={`tabs ${variant} ${variantClasses[variant] || ""}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = selected === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            className={isActive ? "active" : ""}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setSelected(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
