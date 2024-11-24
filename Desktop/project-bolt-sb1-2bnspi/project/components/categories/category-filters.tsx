"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { categoryFilters } from "@/lib/categories";

interface CategoryFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export function CategoryFilters({ selectedFilters, onFilterChange }: CategoryFiltersProps) {
  const handleFilterToggle = (value: string) => {
    if (selectedFilters.includes(value)) {
      onFilterChange(selectedFilters.filter(f => f !== value));
    } else {
      onFilterChange([...selectedFilters, value]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-[200px]">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {categoryFilters.map((filterGroup) => (
          <div key={filterGroup.id}>
            <DropdownMenuLabel>{filterGroup.name}</DropdownMenuLabel>
            {filterGroup.values.map((value) => (
              <DropdownMenuCheckboxItem
                key={value}
                checked={selectedFilters.includes(value.toLowerCase())}
                onCheckedChange={() => handleFilterToggle(value.toLowerCase())}
              >
                {value}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}