export type DueDateStatus =
  | "overdue"
  | "today"
  | "tomorrow"
  | "future";

export function getDueDateStatus(
  dueDate: string | null,
): DueDateStatus | null {
  if (!dueDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${dueDate}T00:00:00`);

  const difference =
    (target.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (difference < 0) {
    return "overdue";
  }

  if (difference === 0) {
    return "today";
  }

  if (difference === 1) {
    return "tomorrow";
  }

  return "future";
}

export function formatDueDate(
  dueDate: string,
): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(dueDate));
}