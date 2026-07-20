import "./TaskCard.css";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, Pencil, Trash2 } from "lucide-react";

import { getDueDateStatus } from "../../../utils/date";

function formatDueDate(date?: string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}
import type { Task } from "../../../types/task";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  isDeleting?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => Promise<void>;
}

function TaskCard({
  task,
  isOverlay = false,
  isDeleting = false,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
      disabled: isOverlay || isDeleting,
    });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const dueDateStatus = getDueDateStatus(task.due_date);

  async function handleDelete() {
    if (!onDelete) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${task.title}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await onDelete(task.id);
    } catch {
      // Eroarea este gestionată în useTasks.
    }
  }

  function getDueDateLabel(): string | null {
    if (!task.due_date || !dueDateStatus) {
      return null;
    }

    switch (dueDateStatus) {
      case "overdue":
        return "Overdue";

      case "today":
        return "Due today";

      case "tomorrow":
        return "Tomorrow";

      case "future":
        return formatDueDate(task.due_date);
    }
  }

  const dueDateLabel = getDueDateLabel();

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={[
        "task-card",
        isDragging ? "task-card--dragging" : "",
        isOverlay ? "task-card--overlay" : "",
        isDeleting ? "task-card--deleting" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="task-card__top">
        <span className={`priority-badge priority-badge--${task.priority}`}>
          {task.priority}
        </span>

        {!isOverlay && (
          <div className="task-card__actions">
            <button
              type="button"
              className="task-card__action-button"
              aria-label={`Edit task ${task.title}`}
              disabled={isDeleting}
              onClick={() => onEdit?.(task)}
            >
              <Pencil size={15} />
            </button>

            <button
              type="button"
              className="task-card__action-button task-card__action-button--delete"
              aria-label={`Delete task ${task.title}`}
              disabled={isDeleting}
              onClick={() => void handleDelete()}
            >
              <Trash2 size={15} />
            </button>

            <button
              type="button"
              className="task-card__drag-handle"
              aria-label={`Move task ${task.title}`}
              disabled={isDeleting}
              {...listeners}
              {...attributes}
            >
              <GripVertical size={17} />
            </button>
          </div>
        )}
      </div>

      <h3 className="task-card__title">{task.title}</h3>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {task.due_date && dueDateStatus && dueDateLabel && (
        <div
          className={[
            "task-card__date",
            `task-card__date--${dueDateStatus}`,
          ].join(" ")}
        >
          <CalendarDays size={15} />

          <span>{dueDateLabel}</span>
        </div>
      )}

      {isDeleting && (
        <p className="task-card__deleting-message" aria-live="polite">
          Deleting...
        </p>
      )}
    </article>
  );
}

export default TaskCard;
