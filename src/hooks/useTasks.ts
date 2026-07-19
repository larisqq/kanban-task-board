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
  updateTaskStatus as updateTaskStatusRequest,
} from "../services/taskService";

import type {
  CreateTaskInput,
  Task,
  TaskStatus,
} from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTask, setIsCreatingTask] =
    useState(false);
  const [deletingTaskId, setDeletingTaskId] =
    useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    null,
  );

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await ensureGuestSession();

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

        return newTask;
      } catch (caughtError) {
        console.error(
          "Could not create task:",
          caughtError,
        );

        setError(
          "The task could not be created. Please try again.",
        );

        throw caughtError;
      } finally {
        setIsCreatingTask(false);
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

        throw caughtError;
      } finally {
        setDeletingTaskId(null);
      }
    },
    [],
  );

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    isCreatingTask,
    deletingTaskId,
    error,
    loadTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  };
}