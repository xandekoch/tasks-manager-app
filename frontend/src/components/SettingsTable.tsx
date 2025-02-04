import { SettingToggle } from "@/components/SettingToggle";
import FullPageCard from "./FullPageCard";

export interface SettingRow<T extends string> {
  name: string;
  roles: Record<T, boolean>;
}

interface SettingsTableProps<T extends string> {
  title: string;
  description: string;
  rows: SettingRow<T>[];
  roleOptions: T[];
  onToggle?: (rowIndex: number, role: T) => void;
}

export function SettingsTable<T extends string>({
  title,
  description,
  rows,
  roleOptions,
  onToggle,
}: SettingsTableProps<T>) {
  return (
    <FullPageCard
      title={title}
      classNames={{ title: "text-xl" }}
      description={description}
    >
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
            <span className="text-sm">{row.name}</span>
            <div className="flex gap-1 justify-between  w-full sm:w-fit">
              {roleOptions.map((role) => (
                <SettingToggle
                  key={role}
                  role={role}
                  active={row.roles[role]}
                  onToggle={() => onToggle?.(index, role)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </FullPageCard>
  );
}
