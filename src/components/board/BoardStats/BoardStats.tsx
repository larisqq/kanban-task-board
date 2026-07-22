import "./BoardStats.css";

import {
  CheckCircle2,
  ListTodo,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useMemo } from "react";

import type { Task } from "../../../types/task";
import { getDueDateStatus } from "../../../utils/date";

interface BoardStatsProps {
  tasks: Task[];
}

function BoardStats({ tasks }: BoardStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter((task) => task.status === "done").length;

    const overdue = tasks.filter(
      (task) =>
        task.status !== "done" && getDueDateStatus(task.due_date) === "overdue",
    ).length;

    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      overdue,
      progress,
    };
  }, [tasks]);

  const cards = [
    {
      label: "Total tasks",
      value: stats.total,
      icon: ListTodo,
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: TriangleAlert,
    },
    {
      label: "Completion rate",
      value: `${stats.progress}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <section className="board-summary" aria-label="Board statistics">
      <div className="board-summary__grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="board-summary-card">
            <span className="board-summary-card__icon">
              <Icon size={19} />
            </span>

            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="board-summary__progress">
        <div className="board-summary__progress-header">
          <span>Overall progress</span>
          <strong>{stats.progress}%</strong>
        </div>

        <div
          className="board-summary__progress-track"
          role="progressbar"
          aria-label="Task completion progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.progress}
        >
          <div
            className="board-summary__progress-fill"
            style={{
              width: `${stats.progress}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default BoardStats;
