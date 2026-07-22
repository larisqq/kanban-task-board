import "./BoardToolbar.css";

import { CheckCircle2, ListTodo, Search, TriangleAlert, X } from "lucide-react";

import type { Task, TaskPriority } from "../../../types/task";

import PriorityFilterSelect from "../../ui/PrioritySelect/PriorityFilterSelect";

export type PriorityFilter = "all" | TaskPriority;

interface BoardToolbarProps {
  tasks: Task[];
  searchQuery: string;
  priorityFilter: PriorityFilter;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: PriorityFilter) => void;
}

function BoardToolbar({
  tasks,
  searchQuery,
  priorityFilter,
  onSearchChange,
  onPriorityChange,
}: BoardToolbarProps) {
  const completedTasks = tasks.filter((task) => task.status === "done").length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.due_date || task.status === "done") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${task.due_date}T00:00:00`);

    return dueDate < today;
  }).length;

  const hasActiveFilters =
    searchQuery.trim().length > 0 || priorityFilter !== "all";

  function clearFilters() {
    onSearchChange("");
    onPriorityChange("all");
  }

  return (
    <section className="board-toolbar">
      <div className="board-stats">
        <article className="board-stat">
          <span className="board-stat__icon">
            <ListTodo size={18} />
          </span>

          <div>
            <strong>{tasks.length}</strong>
            <span>Total tasks</span>
          </div>
        </article>

        <article className="board-stat">
          <span className="board-stat__icon">
            <CheckCircle2 size={18} />
          </span>

          <div>
            <strong>{completedTasks}</strong>
            <span>Completed</span>
          </div>
        </article>

        <article className="board-stat">
          <span className="board-stat__icon">
            <TriangleAlert size={18} />
          </span>

          <div>
            <strong>{overdueTasks}</strong>
            <span>Overdue</span>
          </div>
        </article>
      </div>

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
