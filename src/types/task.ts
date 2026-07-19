export type TaskStatus =
  | "todo"
  | "in_progress"
  | "in_review"
  | "done";

export type TaskPriority =
  | "low"
  | "normal"
  | "high";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface UpdateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  due_date?: string | null;
}