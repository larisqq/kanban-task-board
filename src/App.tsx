import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import TaskBoard from "./components/board/TaskBoard/TaskBoard";
import CreateTaskModal from "./components/tasks/CreateTaskModal/CreateTaskModal";
import { useTasks } from "./hooks/useTasks";
import type { CreateTaskInput } from "./types/task";

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    tasks,
    isLoading,
    isCreatingTask,
    deletingTaskId,
    error,
    loadTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  async function handleCreateTask(input: CreateTaskInput) {
    await createTask(input);
    setIsCreateModalOpen(false);
  }

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
          onClick={() => setIsCreateModalOpen(true)}
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
            onDeleteTask={deleteTask}
          />
        )}
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        isSubmitting={isCreatingTask}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}

export default App;
