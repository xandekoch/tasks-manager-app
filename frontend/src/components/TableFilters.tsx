import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface TableFiltersProps {
  orderOptions: { value: string; label: string }[];
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const TableFilters = ({
  orderOptions,
  search,
  sort,
  onSearchChange,
  onSortChange,
}: TableFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 600); // Debounce delay
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="relative w-auto sm:w-72">
        <Input
          placeholder="Search"
          className="pl-8"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <Select value={sort} onValueChange={(value) => onSortChange(value)}>
        <SelectTrigger className="w-[175px]">
          <SelectValue placeholder="Ordered by" />
        </SelectTrigger>
        <SelectContent>
          {orderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
