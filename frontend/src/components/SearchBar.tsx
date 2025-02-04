"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  localSearch: string;
  handleOnSearchChange: (value: string) => void;
  debounceDelayMs?: number;
}

const SearchBar = ({
  localSearch,
  handleOnSearchChange,
  debounceDelayMs = 500,
}: SearchBarProps) => {
  const [componentSearch, setComponentSearch] = useState(localSearch);

  const handleSearchDebounced = useDebouncedCallback(() => {
    handleOnSearchChange(componentSearch);
  }, debounceDelayMs);

  useEffect(() => {
    handleSearchDebounced();
  }, [componentSearch, handleSearchDebounced]);

  return (
    <div className="relative w-full max-w-full md:w-72">
      <Input
        placeholder="Search"
        className="basis-72 pl-8"
        value={componentSearch}
        onChange={(e) => setComponentSearch(e.target.value)}
      />
      <SearchIcon className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};

export default SearchBar;
