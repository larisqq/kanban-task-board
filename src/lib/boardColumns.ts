import type { TaskStatus } from "../types/task";

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  description: string;
}

export const boardColumns: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    description: "Tasks waiting to be started",
  },
  {
    id: "in_progress",
    title: "In Progress",
    description: "Work currently in progress",
  },
  {
    id: "in_review",
    title: "In Review",
    description: "Tasks waiting for feedback",
  },
  {
    id: "done",
    title: "Done",
    description: "Completed tasks",
  },
];