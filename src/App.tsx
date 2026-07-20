import { useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import BoardToolbar, {
  type PriorityFilter,
} from "./components/board/BoardToolbar/BoardToolbar";
import TaskBoard from "./components/board/TaskBoard/TaskBoard";
import ConfirmDialog from "./components/common/ConfirmDialog/ConfirmDialog";
import TaskFormModal from "./components/tasks/TaskFormModal/TaskFormModal";
import { useTasks } from "./hooks/useTasks";

import type { CreateTaskInput, Task, UpdateTaskInput } from "./types/task";

function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const {
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
  } = useTasks();

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const titleMatches = task.title.toLowerCase().includes(normalizedSearch);

      const descriptionMatches =
        task.description?.toLowerCase().includes(normalizedSearch) ?? false;

      const matchesSearch =
        normalizedSearch.length === 0 || titleMatches || descriptionMatches;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  function openCreateModal() {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  }

  function openEditModal(task: Task) {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }

  function closeTaskModal() {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  }

  function openDeleteDialog(task: Task) {
    setTaskToDelete(task);
  }

  function closeDeleteDialog() {
    if (deletingTaskId) {
      return;
    }

    setTaskToDelete(null);
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) {
      return;
    }

    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    } catch {
      // Eroarea este gestionată în useTasks.
    }
  }

  async function handleTaskSubmit(input: CreateTaskInput | UpdateTaskInput) {
    if (selectedTask) {
      await updateTask(selectedTask.id, input as UpdateTaskInput);
    } else {
      await createTask(input as CreateTaskInput);
    }

    closeTaskModal();
  }

  const isSubmittingTask = isCreatingTask || editingTaskId === selectedTask?.id;

  const isConfirmingDelete = deletingTaskId === taskToDelete?.id;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">Personal workspace</p>

          <h1>Task Board</h1>

          <p className="app-header__description">
            Organize your work and move tasks from idea to completion.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          New task
        </button>
      </header>

      <main>
        {error && (
          <div className="state-panel state-panel--error" role="alert">
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              className="secondary-button"
              disabled={isLoading}
              onClick={() => void loadTasks()}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {!isLoading && (
          <BoardToolbar
            tasks={tasks}
            searchQuery={searchQuery}
            priorityFilter={priorityFilter}
            onSearchChange={setSearchQuery}
            onPriorityChange={setPriorityFilter}
          />
        )}

        {isLoading && tasks.length === 0 ? (
          <div className="state-panel">Loading your workspace...</div>
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            deletingTaskId={deletingTaskId}
            onTaskStatusChange={updateTaskStatus}
            onEditTask={openEditModal}
            onDeleteTask={openDeleteDialog}
          />
        )}
      </main>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        task={selectedTask}
        isSubmitting={isSubmittingTask}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
      />

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete task"
        description={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"?`
            : ""
        }
        isConfirming={isConfirmingDelete}
        onCancel={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;
