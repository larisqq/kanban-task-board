import "./TaskFormModal.css";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import DatePicker from "../../ui/DatePicker/DatePicker";
import PrioritySelect from "../../ui/PrioritySelect/PrioritySelect";

import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  UpdateTaskInput,
} from "../../../types/task";

interface TaskFormModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput | UpdateTaskInput) => Promise<void>;
}

function TaskFormModal({
  isOpen,
  isSubmitting,
  task,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const isEditing = Boolean(task);

  const [title, setTitle] = useState(task?.title ?? "");

  const [description, setDescription] = useState(task?.description ?? "");

  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? "normal",
  );

  const [dueDate, setDueDate] = useState(task?.due_date ?? "");

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setValidationError("Please enter a task title.");
      return;
    }

    if (trimmedTitle.length > 150) {
      setValidationError("The title must contain at most 150 characters.");
      return;
    }

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined,
        priority,
        due_date: dueDate || null,
      });
    } catch {
      // Request errors are handled in useTasks and App.
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="task-modal__header">
          <div>
            <p className="task-modal__eyebrow">
              {isEditing ? "Update task" : "Add to workspace"}
            </p>

            <h2 id="task-form-title">
              {isEditing ? "Edit task" : "Create a new task"}
            </h2>

            <p>
              {isEditing
                ? "Update the details of this task."
                : "Add the essential details for your new task."}
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Close task form"
            disabled={isSubmitting}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <div className="form-field__label-row">
              <label htmlFor="task-title">Task title</label>

              <span>{title.length}/150</span>
            </div>

            <input
              id="task-title"
              type="text"
              value={title}
              maxLength={150}
              autoFocus
              disabled={isSubmitting}
              placeholder="For example: Design dashboard"
              onChange={(event) => {
                setTitle(event.target.value);
                setValidationError(null);
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-description">
              Description
              <span className="optional-label">Optional</span>
            </label>

            <textarea
              id="task-description"
              value={description}
              rows={5}
              disabled={isSubmitting}
              placeholder="Add context or useful notes..."
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="task-form__row">
            <div className="form-field">
              <span className="form-field__label">Priority</span>

              <PrioritySelect
                value={priority}
                disabled={isSubmitting}
                onChange={setPriority}
              />
            </div>

            <div className="form-field">
              <span className="form-field__label">
                Due date
                <span className="optional-label">Optional</span>
              </span>

              <DatePicker
                value={dueDate}
                disabled={isSubmitting}
                onChange={setDueDate}
              />
            </div>
          </div>

          {validationError && (
            <p className="form-error" role="alert">
              {validationError}
            </p>
          )}

          <footer className="task-modal__footer">
            <button
              type="button"
              className="secondary-button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create task"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default TaskFormModal;
