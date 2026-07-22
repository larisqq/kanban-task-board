import "./BoardToolbar.css";

import { Search, X } from "lucide-react";

import PriorityFilterSelect from "../../ui/PrioritySelect/PriorityFilterSelect";

import type { TaskPriority } from "../../../types/task";

export type PriorityFilter = "all" | TaskPriority;

interface BoardToolbarProps {
  searchQuery: string;
  priorityFilter: PriorityFilter;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: PriorityFilter) => void;
}

function BoardToolbar({
  searchQuery,
  priorityFilter,
  onSearchChange,
  onPriorityChange,
}: BoardToolbarProps) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 || priorityFilter !== "all";

  function clearFilters() {
    onSearchChange("");
    onPriorityChange("all");
  }

  return (
    <section className="board-toolbar" aria-label="Board filters">
      <div className="board-filters">
        <label className="search-field">
          <Search size={17} />

          <input
            type="search"
            value={searchQuery}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <PriorityFilterSelect
          value={priorityFilter}
          onChange={onPriorityChange}
        />

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

export default BoardToolbar;
