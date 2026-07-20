import "./ConfirmDialog.css";

import { useEffect } from "react";
import { TriangleAlert, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = "";
    };
  }, [isOpen, isConfirming, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="confirm-dialog__backdrop"
      role="presentation"
      onMouseDown={() => {
        if (!isConfirming) {
          onCancel();
        }
      }}
    >
      <section
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="confirm-dialog__close"
          aria-label="Close confirmation dialog"
          disabled={isConfirming}
          onClick={onCancel}
        >
          <X size={18} />
        </button>

        <div className="confirm-dialog__icon">
          <TriangleAlert size={24} />
        </div>

        <div className="confirm-dialog__content">
          <h2 id="confirm-dialog-title">{title}</h2>

          <p id="confirm-dialog-description">{description}</p>

          <span className="confirm-dialog__warning">
            This action cannot be undone.
          </span>
        </div>

        <footer className="confirm-dialog__actions">
          <button
            type="button"
            className="secondary-button"
            disabled={isConfirming}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="danger-button"
            disabled={isConfirming}
            onClick={() => void onConfirm()}
          >
            {isConfirming ? "Deleting..." : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default ConfirmDialog;
