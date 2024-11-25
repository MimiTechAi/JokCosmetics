import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface OrderFiltersProps {
  onSearch: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function OrderFilters({ onSearch, onStatusChange }: OrderFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Bestellungen durchsuchen..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Status</SelectItem>
          <SelectItem value="pending">Ausstehend</SelectItem>
          <SelectItem value="processing">In Bearbeitung</SelectItem>
          <SelectItem value="shipped">Versendet</SelectItem>
          <SelectItem value="delivered">Geliefert</SelectItem>
          <SelectItem value="cancelled">Storniert</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="w-full sm:w-auto">
        <Filter className="mr-2 h-4 w-4" />
        Weitere Filter
      </Button>
    </div>
  );
}