import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, X } from "lucide-react";
import type { CreateTaskInput, TaskPriority } from "../../../types/task";
import "./CreateTaskModal.css";
interface CreateTaskModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (input: CreateTaskInput) => Promise<void>;
}

const initialFormState: CreateTaskInput = {
  title: "",
  description: "",
  priority: "normal",
  due_date: null,
};

function CreateTaskModal({
  isOpen,
  isSubmitting,
  onClose,
  onCreate,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskInput>(initialFormState);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function updateField<Key extends keyof CreateTaskInput>(
    field: Key,
    value: CreateTaskInput[Key],
  ) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }));

    setValidationError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      setValidationError("Please enter a task title.");
      return;
    }

    if (trimmedTitle.length > 150) {
      setValidationError("The task title must contain at most 150 characters.");
      return;
    }

    try {
      await onCreate({
        ...formData,
        title: trimmedTitle,
        description: formData.description?.trim() || undefined,
        due_date: formData.due_date || null,
      });

      setFormData(initialFormState);
      setValidationError(null);
    } catch {
      // Eroarea de server va fi afișată de App.
    }
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setFormData(initialFormState);
    setValidationError(null);
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="task-modal__header">
          <div>
            <p className="task-modal__eyebrow">Add to workspace</p>

            <h2 id="create-task-title">Create a new task</h2>

            <p>
              Add the essential details now. You can move the task across the
              board afterward.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Close create task modal"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <div className="form-field__label-row">
              <label htmlFor="task-title">Task title</label>

              <span>{formData.title.length}/150</span>
            </div>

            <input
              id="task-title"
              type="text"
              value={formData.title}
              maxLength={150}
              autoFocus
              placeholder="For example: Design dashboard header"
              disabled={isSubmitting}
              onChange={(event) => updateField("title", event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-description">
              Description
              <span className="optional-label">Optional</span>
            </label>

            <textarea
              id="task-description"
              value={formData.description ?? ""}
              rows={5}
              placeholder="Add context, requirements, or useful notes..."
              disabled={isSubmitting}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
          </div>

          <div className="task-form__row">
            <div className="form-field">
              <label htmlFor="task-priority">Priority</label>

              <select
                id="task-priority"
                value={formData.priority}
                disabled={isSubmitting}
                onChange={(event) =>
                  updateField("priority", event.target.value as TaskPriority)
                }
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-due-date">
                Due date
                <span className="optional-label">Optional</span>
              </label>

              <div className="date-input-wrapper">
                <CalendarDays size={17} />

                <input
                  id="task-due-date"
                  type="date"
                  value={formData.due_date ?? ""}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateField("due_date", event.target.value || null)
                  }
                />
              </div>
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
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create task"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default CreateTaskModal;
