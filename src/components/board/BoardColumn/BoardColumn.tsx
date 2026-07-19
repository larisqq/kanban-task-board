import "./BoardColumn.css";

import { useDroppable } from "@dnd-kit/core";

import TaskCard from "../../tasks/TaskCard/TaskCard";
import type { BoardColumn as BoardColumnType } from "../../../lib/boardColumns";
import type { Task } from "../../../types/task";

interface BoardColumnProps {
  column: BoardColumnType;
  tasks: Task[];
  deletingTaskId: string | null;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
}

function BoardColumn({
  column,
  tasks,
  deletingTaskId,
  onEditTask,
  onDeleteTask,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      status: column.id,
    },
  });

  return (
    <section
      ref={setNodeRef}
      className={["board-column", isOver ? "board-column--over" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="board-column__header">
        <div>
          <div className="board-column__title-row">
            <h2>{column.title}</h2>

            <span className="board-column__count">{tasks.length}</span>
          </div>

          <p>{column.description}</p>
        </div>
      </header>

      <div className="board-column__tasks">
        {tasks.length === 0 ? (
          <div className="board-column__empty">
            <p>Drop a task here.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDeleting={deletingTaskId === task.id}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default BoardColumn;
