import "./TaskBoard.css";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";

import TaskCard from "../../tasks/TaskCard/TaskCard";
import { boardColumns } from "../../../lib/boardColumns";
import type { Task, TaskStatus } from "../../../types/task";
import BoardColumn from "../BoardColumn/BoardColumn";

interface TaskBoardProps {
  tasks: Task[];
  deletingTaskId: string | null;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

function TaskBoard({
  tasks,
  deletingTaskId,
  onTaskStatusChange,
  onEditTask,
  onDeleteTask,
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((item) => item.id === event.active.id);

    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const task = tasks.find((item) => item.id === active.id);

    if (!task) {
      return;
    }

    const targetStatus =
      over.data.current?.type === "column"
        ? (over.data.current.status as TaskStatus)
        : undefined;

    if (!targetStatus || task.status === targetStatus) {
      return;
    }

    try {
      await onTaskStatusChange(task.id, targetStatus);
    } catch {}
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={(event) => {
        void handleDragEnd(event);
      }}
      onDragCancel={handleDragCancel}
    >
      <div className="task-board">
        {boardColumns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              deletingTaskId={deletingTaskId}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskBoard;
