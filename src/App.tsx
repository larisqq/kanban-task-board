import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import TaskBoard from "./components/board/TaskBoard/TaskBoard";
import TaskFormModal from "./components/tasks/TaskFormModal/TaskFormModal";
import { useTasks } from "./hooks/useTasks";

import type { CreateTaskInput, Task, UpdateTaskInput } from "./types/task";

function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  async function handleTaskSubmit(input: CreateTaskInput | UpdateTaskInput) {
    if (selectedTask) {
      await updateTask(selectedTask.id, input as UpdateTaskInput);
    } else {
      await createTask(input as CreateTaskInput);
    }

    closeTaskModal();
  }

  const isSubmittingTask = isCreatingTask || editingTaskId === selectedTask?.id;

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

        {isLoading && tasks.length === 0 ? (
          <div className="state-panel">Loading your workspace...</div>
        ) : (
          <TaskBoard
            tasks={tasks}
            deletingTaskId={deletingTaskId}
            onTaskStatusChange={updateTaskStatus}
            onEditTask={openEditModal}
            onDeleteTask={deleteTask}
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
    </div>
  );
}

export default App;
