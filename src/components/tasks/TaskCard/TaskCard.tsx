import "./TaskCard.css";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, Trash2 } from "lucide-react";

import type { Task } from "../../../types/task";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  isDeleting?: boolean;
  onDelete?: (taskId: string) => Promise<void>;
}

function TaskCard({
  task,
  isOverlay = false,
  isDeleting = false,
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

  async function handleDelete() {
    const shouldDelete = window.confirm(`Delete "${task.title}"?`);

    if (!shouldDelete || !onDelete) {
      return;
    }

    try {
      await onDelete(task.id);
    } catch {
      // Eroarea este gestionată și afișată de useTasks.
    }
  }

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

      {task.due_date && (
        <div className="task-card__date">
          <CalendarDays size={15} />
          <span>{task.due_date}</span>
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
