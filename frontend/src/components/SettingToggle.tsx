import { Toggle } from "@/components/ui/toggle";

interface SettingToggleProps {
  role: string;
  active: boolean;
  onToggle?: () => void;
}

export const SettingToggle = ({
  role,
  active,
  onToggle,
}: SettingToggleProps) => (
  <Toggle
    variant="outline"
    size="sm"
    pressed={active}
    onPressedChange={onToggle}
    className={`w-[80px] text-foreground ${
      active
        ? "bg-accent hover:bg-transparent/90"
        : "bg-transparent hover:bg-accent/90"
    } w-full sm:w-fit`}
  >
    {role}
  </Toggle>
);
