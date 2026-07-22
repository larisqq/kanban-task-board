import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { ensureGuestSession } from "../services/authService";
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
  updateTaskStatus as updateTaskStatusRequest,
} from "../services/taskService";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from "../types/task";

import { toast } from "sonner";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] =
    useState(false);
  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] =
    useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    null,
  );

 const loadTasks = useCallback(async () => {
  try {
    await ensureGuestSession();

    setIsLoading(true);
    setError(null);

    const loadedTasks = await getTasks();

    setTasks(loadedTasks);
  } catch (caughtError) {
    console.error(
      "Could not load tasks:",
      caughtError,
    );

    setError(
      "We could not load your board. Please try again.",
    );
  } finally {
    setIsLoading(false);
  }
}, []);

 const createTask = useCallback(
  async (
    input: CreateTaskInput,
  ): Promise<Task> => {
    setIsCreatingTask(true);
    setError(null);

    try {
      const newTask =
        await createTaskRequest(input);

      setTasks((currentTasks) => [
        newTask,
        ...currentTasks,
      ]);

      toast.success("Task created", {
        description: `"${newTask.title}" was added to To Do.`,
      });

      return newTask;
    } catch (caughtError) {
      console.error(
        "Could not create task:",
        caughtError,
      );

      setError(
        "The task could not be created. Please try again.",
      );

      toast.error("Task creation failed", {
        description:
          "Please check your connection and try again.",
      });

      throw caughtError;
    } finally {
      setIsCreatingTask(false);
    }
  },
  [],
);

 const updateTask = useCallback(
  async (
    taskId: string,
    input: UpdateTaskInput,
  ): Promise<Task> => {
    setEditingTaskId(taskId);
    setError(null);

    try {
      const updatedTask =
        await updateTaskRequest(taskId, input);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id
            ? updatedTask
            : task,
        ),
      );

      toast.success("Task updated", {
        description: `"${updatedTask.title}" was saved successfully.`,
      });

      return updatedTask;
    } catch (caughtError) {
      console.error(
        "Could not update task:",
        caughtError,
      );

      setError(
        "The task could not be updated. Please try again.",
      );

      toast.error("Task update failed", {
        description:
          "Your changes could not be saved.",
      });

      throw caughtError;
    } finally {
      setEditingTaskId(null);
    }
  },
  [],
);

  const updateTaskStatus = useCallback(
    async (
      taskId: string,
      newStatus: TaskStatus,
    ): Promise<void> => {
      let previousTasks: Task[] = [];

      setError(null);

      setTasks((currentTasks) => {
        previousTasks = currentTasks;

        const taskToUpdate = currentTasks.find(
          (task) => task.id === taskId,
        );

        if (
          !taskToUpdate ||
          taskToUpdate.status === newStatus
        ) {
          return currentTasks;
        }

        return currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : task,
        );
      });

      try {
        const updatedTask =
          await updateTaskStatusRequest(
            taskId,
            newStatus,
          );

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id
              ? updatedTask
              : task,
          ),
        );
      } catch (caughtError) {
        console.error(
          "Could not update task status:",
          caughtError,
        );

        setTasks(previousTasks);

        setError(
          "The task could not be moved. Please try again.",
        );

        toast.error("Task could not be moved", {
          description:
            "The task was returned to its previous column.",
        });

        throw caughtError;
      }
    },
    [],
  );

  const deleteTask = useCallback(
  async (taskId: string): Promise<void> => {
    let deletedTask: Task | undefined;

    setError(null);
    setDeletingTaskId(taskId);

    setTasks((currentTasks) => {
      deletedTask = currentTasks.find(
        (task) => task.id === taskId,
      );

      return currentTasks.filter(
        (task) => task.id !== taskId,
      );
    });

    try {
      await deleteTaskRequest(taskId);

      toast.success("Task deleted", {
        description: deletedTask
          ? `"${deletedTask.title}" was removed.`
          : "The task was removed.",
      });
    } catch (caughtError) {
      console.error(
        "Could not delete task:",
        caughtError,
      );

      if (deletedTask) {
        setTasks((currentTasks) => [
          deletedTask as Task,
          ...currentTasks,
        ]);
      }

      setError(
        "The task could not be deleted. Please try again.",
      );

      toast.error("Task deletion failed", {
        description:
          "The task was restored to your board.",
      });

      throw caughtError;
    } finally {
      setDeletingTaskId(null);
    }
  },
  [],
);

  useEffect(() => {
  queueMicrotask(() => {
    void loadTasks();
  });
}, [loadTasks]);

  return {
    tasks,
    isLoading,
    isCreatingTask,
    editingTaskId,
    deletingTaskId,
    error,
    loadTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
}